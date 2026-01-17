import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  // frontend build lives in dist/public
  const distPath = path.resolve(process.cwd(), "dist/public");

  if (!fs.existsSync(distPath)) {
    console.error("Static build not found at:", distPath);
    return;
  }

  console.log("Serving static files from:", distPath);
  console.log("Static files:", fs.readdirSync(distPath));


  app.use(express.static(distPath));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}