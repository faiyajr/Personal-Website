/**
 * One-time helper to mint a Spotify refresh token.
 *
 *   npm run spotify:auth
 *
 * Before running, create an app at https://developer.spotify.com/dashboard,
 * add `http://127.0.0.1:8888/callback` as a Redirect URI, and put the client
 * ID and secret in `.env.local`.
 *
 * The script opens the Spotify consent screen, catches the redirect on a
 * throwaway local server, exchanges the code, and prints the refresh token.
 * Refresh tokens do not expire, so this is genuinely a one-time step.
 */

import http from "node:http";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const PORT = 8888;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;
const SCOPES = ["user-top-read", "user-read-currently-playing", "user-read-recently-played"];

/** Minimal .env.local reader — avoids a dependency for a script run once. */
function loadEnvLocal(): Record<string, string> {
  const file = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(file)) return {};

  const out: Record<string, string> = {};
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const match = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/.exec(line);
    if (!match) continue;
    out[match[1]] = (match[2] ?? "").replace(/^["']|["']$/g, "").trim();
  }
  return out;
}

function open(url: string) {
  const command =
    process.platform === "win32" ? "start" : process.platform === "darwin" ? "open" : "xdg-open";
  spawn(command, [url], { shell: true, stdio: "ignore", detached: true }).unref();
}

const env = { ...loadEnvLocal(), ...process.env };
const clientId = env.SPOTIFY_CLIENT_ID;
const clientSecret = env.SPOTIFY_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error(
    "\n  Missing SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET.\n" +
      "  Add them to .env.local first — see .env.example.\n",
  );
  process.exit(1);
}

const authUrl =
  "https://accounts.spotify.com/authorize?" +
  new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: SCOPES.join(" "),
    show_dialog: "true",
  });

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://127.0.0.1:${PORT}`);
  if (url.pathname !== "/callback") {
    res.writeHead(404).end();
    return;
  }

  const error = url.searchParams.get("error");
  const code = url.searchParams.get("code");

  if (error || !code) {
    res.writeHead(400, { "Content-Type": "text/html" });
    res.end(`<h1>Authorisation failed</h1><p>${error ?? "no code returned"}</p>`);
    server.close();
    process.exit(1);
  }

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });

  const data: { refresh_token?: string; error_description?: string } = await tokenRes.json();

  if (!tokenRes.ok || !data.refresh_token) {
    res.writeHead(500, { "Content-Type": "text/html" });
    res.end(`<h1>Token exchange failed</h1><pre>${JSON.stringify(data, null, 2)}</pre>`);
    console.error("\n  Token exchange failed:", data);
    server.close();
    process.exit(1);
  }

  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(
    "<h1>Done.</h1><p>Refresh token printed in your terminal. You can close this tab.</p>",
  );

  console.log("\n  Add this to .env.local and to Vercel:\n");
  console.log(`  SPOTIFY_REFRESH_TOKEN=${data.refresh_token}\n`);

  server.close();
  process.exit(0);
});

server.listen(PORT, () => {
  console.log(`\n  Opening Spotify authorisation…`);
  console.log(`  If nothing opens, visit:\n\n  ${authUrl}\n`);
  open(authUrl);
});
