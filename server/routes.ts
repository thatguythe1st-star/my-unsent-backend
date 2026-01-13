import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.messages.list.path, async (req, res) => {
    const search = req.query.search as string | undefined;
    const messages = await storage.getMessages(search);
    res.json(messages);
  });

  app.get(api.messages.get.path, async (req, res) => {
    const message = await storage.getMessage(Number(req.params.id));
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json(message);
  });

  app.post(api.messages.create.path, async (req, res) => {
    try {
      const input = api.messages.create.input.parse(req.body);
      const message = await storage.createMessage(input);
      res.status(201).json(message);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingMessages = await storage.getMessages();
  if (existingMessages.length === 0) {
    await storage.createMessage({
      toName: "Alex",
      content: "I still think about the time we drove to the beach at 2am. I miss you.",
      color: "#3b82f6" // Blue
    });
    await storage.createMessage({
      toName: "Sarah",
      content: "I'm sorry I never said goodbye properly. I hope you're happy now.",
      color: "#ef4444" // Red
    });
    await storage.createMessage({
      toName: "Mom",
      content: "I wish I could call you one last time.",
      color: "#18181b" // Black
    });
    await storage.createMessage({
      toName: "Future Me",
      content: "Don't forget how far you've come. Keep going.",
      color: "#10b981" // Green
    });
    await storage.createMessage({
      toName: "J",
      content: "You were my favorite mistake.",
      color: "#f59e0b" // Orange
    });
  }
}
