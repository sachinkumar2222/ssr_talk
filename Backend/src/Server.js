import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import env from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";
import { connectDb } from "./Lib/db.js";
import { createSocketServer } from "./Lib/socket.js";

env.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function createServer() {
  const app = express();

  app.use(
    "/assets",
    express.static(path.resolve(__dirname, "../../Frontend/dist/assets"), {
      index: false,
    })
  );

  const manifest = JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, "../../Frontend/dist/.vite/manifest.json"),
      "utf-8"
    )
  );

  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
  app.use(express.json({ limit: "10mb" }));
  app.use(cookieParser());

  // ---------------- API Routes ----------------
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/message", messageRoutes);

  // ---------------- SSR Render ----------------
  app.use("*", async (req, res) => {
    try {
      const url = req.originalUrl;

      if (url === "/favicon.ico") {
        return res.status(204).send();
      }

      const { render } = await import(
        "../../Frontend/dist-ssr/entry-server.js"
      );

      const { appHtml, dehydratedState } = await render(url, req);

      const entry = manifest["src/entry-client.jsx"];
      const cssLinks = (entry.css || [])
        .map((css) => `<link rel="stylesheet" href="/${css}">`)
        .join("\n");
      const jsScript = `<script type="module" src="/${entry.file}"></script>`;

      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Social Talk</title>
  ${cssLinks}
</head>
<body>
  <div id="root">${appHtml}</div>
  <script>window.__REACT_QUERY_STATE__ = ${JSON.stringify(
    dehydratedState
  )}</script>
  ${jsScript}
</body>
</html>`;

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (err) {
      console.error("❌ SSR Error:", err);
      res.status(500).send(err.stack);
    }
  });

  return app;
}

createServer().then((app) => {
  const PORT = process.env.PORT || 5001;

  const { server } = createSocketServer(app);

  server.listen(PORT, () => {
    console.log(`✅ Server + SSR running at http://localhost:${PORT}`);
    connectDb();
  });
});