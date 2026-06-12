import { Router } from "express";
import { authRoutes } from "../modules/auth";
import { projectsRouter } from "../modules/projects";
import { tasksRouter, projectTasksRouter } from "../modules/tasks";
import { authenticate } from "../middleware";
import prisma from "../lib/prisma";

const router = Router();

// Health check
router.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      success: true,
      message: "Servidor activo",
      database: "conectada",
      timestamp: new Date().toISOString(),
    });
  } catch {
    res.status(503).json({
      success: false,
      message: "Servidor activo pero base de datos desconectada",
      database: "desconectada",
    });
  }
});

// Auth (público)
router.use("/auth", authRoutes);

// Módulos protegidos
router.use("/projects/:projectId/tasks", authenticate, projectTasksRouter);
router.use("/projects", authenticate, projectsRouter);
router.use("/tasks", authenticate, tasksRouter);

export default router;
