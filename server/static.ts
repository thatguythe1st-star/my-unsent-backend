import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.resolve(process.cwd(), "dist/public");

  if (!fs.existsSync(distPath)) {
    console.error("Static build not found at:", distPath);
    return;
  }

  console.log("Serving static files from:", distPath);

  // 1️⃣ Serve static assets FIRST
  app.use(
    express.static(distPath, {
      index: false, // important
    })
  );

  // 2️⃣ SPA fallback — BUT ignore asset requests
  app.get("*", (req, res) => {
    if (req.path.startsWith("/assets")) {
      return res.sendStatus(404);
    }

    res.sendFile(path.join(distPath, "index.html"));
  });
}
