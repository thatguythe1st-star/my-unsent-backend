import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  // client build lives in dist/client
  const distPath = path.resolve(process.cwd(), "dist/client");

  if (!fs.existsSync(distPath)) {
    console.error("Static build not found at:", distPath);
    return;
  }

  app.use(express.static(distPath));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}