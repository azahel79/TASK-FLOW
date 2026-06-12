"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../modules/auth");
const projects_1 = require("../modules/projects");
const tasks_1 = require("../modules/tasks");
const middleware_1 = require("../middleware");
const prisma_1 = __importDefault(require("../lib/prisma"));
const router = (0, express_1.Router)();
// Health check
router.get("/health", async (_req, res) => {
    try {
        await prisma_1.default.$queryRaw `SELECT 1`;
        res.json({
            success: true,
            message: "Servidor activo",
            database: "conectada",
            timestamp: new Date().toISOString(),
        });
    }
    catch {
        res.status(503).json({
            success: false,
            message: "Servidor activo pero base de datos desconectada",
            database: "desconectada",
        });
    }
});
// Auth (público)
router.use("/auth", auth_1.authRoutes);
// Módulos protegidos
router.use("/projects/:projectId/tasks", middleware_1.authenticate, tasks_1.projectTasksRouter);
router.use("/projects", middleware_1.authenticate, projects_1.projectsRouter);
router.use("/tasks", middleware_1.authenticate, tasks_1.tasksRouter);
exports.default = router;
//# sourceMappingURL=index.js.map