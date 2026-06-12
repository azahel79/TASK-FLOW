"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectTasksRouter = exports.tasksRouter = exports.tasksController = exports.tasksService = void 0;
var tasks_service_1 = require("./tasks.service");
Object.defineProperty(exports, "tasksService", { enumerable: true, get: function () { return tasks_service_1.tasksService; } });
var tasks_controller_1 = require("./tasks.controller");
Object.defineProperty(exports, "tasksController", { enumerable: true, get: function () { return tasks_controller_1.tasksController; } });
var tasks_routes_1 = require("./tasks.routes");
Object.defineProperty(exports, "tasksRouter", { enumerable: true, get: function () { return __importDefault(tasks_routes_1).default; } });
Object.defineProperty(exports, "projectTasksRouter", { enumerable: true, get: function () { return tasks_routes_1.projectTasksRouter; } });
//# sourceMappingURL=index.js.map