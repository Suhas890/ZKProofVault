import express, { type Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import session from "express-session"; // NEW IMPORT (if missing)
import MemoryStore from "memorystore"; // NEW IMPORT

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // --- START: In-Memory Session Setup ---
  const MaxAge = 24 * 60 * 60 * 1000; // 24 hours
  const Store = MemoryStore(session);

  app.use(
    session({
      // Use the in-memory store
      store: new Store({ checkPeriod: MaxAge }), 
      secret: process.env.SESSION_SECRET!, // Requires SESSION_SECRET in .env.development
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: MaxAge,
        secure: process.env.NODE_ENV === "production",
      },
    }),
  );
  // --- END: In-Memory Session Setup ---

  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  return httpServer;
}