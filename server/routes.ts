import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  /* ---------------- LIST MESSAGES ---------------- */
  app.get(api.messages.list.path, async (req, res) => {
    const search = req.query.search as string | undefined;
    const messages = await storage.getMessages(search);
    res.json(messages);
  });

  /* ---------------- GET SINGLE MESSAGE ---------------- */
  app.get(api.messages.get.path, async (req, res) => {
    const message = await storage.getMessage(Number(req.params.id));

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.json(message);
  });

  /* ---------------- CREATE MESSAGE ---------------- */
  app.post(api.messages.create.path, async (req, res) => {
    try {
      const input = api.messages.create.input.parse(req.body);
      const message = await storage.createMessage(input);
      res.status(201).json(message);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }

      console.error("❌ CREATE MESSAGE ERROR:", err);
      return res.status(500).json({
        message: "Failed to create message",
      });
    }
  });

  /* ---------------- WIPE DATABASE (ADMIN) ---------------- */
  app.delete("/api/admin/wipe", async (req, res) => {
    try {
      // OPTIONAL: protect with admin key
      if (
        process.env.ADMIN_KEY &&
        req.headers["x-admin-key"] !== process.env.ADMIN_KEY
      ) {
        return res.status(403).json({ message: "Forbidden" });
      }

      await storage.deleteAllMessages();
      console.log("🧹 Database wiped");

      res.json({ message: "Database wiped successfully" });
    } catch (err) {
      console.error("❌ WIPE DATABASE ERROR:", err);
      res.status(500).json({ message: "Failed to wipe database" });
    }
  });

  /* ---------------- SEED DATABASE (SAFE) ---------------- */
  await seedDatabase();

  return httpServer;
}

/* ---------------- SEED FUNCTION ---------------- */
async function seedDatabase() {
  try {
    const existingMessages = await storage.getMessages();

    if (existingMessages.length === 0) {
      await storage.createMessage({
        toName: "Mylah",
        content: "Whats crackalackin",
        color: "#3b82f6",
      });

      await storage.createMessage({
        toName: "Mimi",
        content: "Can we go home now, Its getting later baby",
        color: "#ef4444",
      });

      await storage.createMessage({
        toName: "Senior Project",
        content: "I love working on this project",
        color: "#18181b",
      });

      console.log("✅ Database seeded");
    }
  } catch (err) {
    console.error("❌ SEED DATABASE ERROR:", err);
  }
}

{isAdmin && (
  <button
    onClick={async () => {
      if (!confirm("Delete permanently?")) return;

      await fetch(`/api/messages/${message.id}`, {
        method: "DELETE",
        headers: {
          "x-admin-key": import.meta.env.VITE_ADMIN_PASSWORD,
        },
      });

      window.location.reload();
    }}
    className="absolute top-2 right-2 text-red-500 text-xs"
  >
    ✕
  </button>
)}

