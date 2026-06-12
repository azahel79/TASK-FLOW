"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectsRouter = exports.projectsController = exports.projectsService = void 0;
var projects_service_1 = require("./projects.service");
Object.defineProperty(exports, "projectsService", { enumerable: true, get: function () { return projects_service_1.projectsService; } });
var projects_controller_1 = require("./projects.controller");
Object.defineProperty(exports, "projectsController", { enumerable: true, get: function () { return projects_controller_1.projectsController; } });
var projects_routes_1 = require("./projects.routes");
Object.defineProperty(exports, "projectsRouter", { enumerable: true, get: function () { return __importDefault(projects_routes_1).default; } });
//# sourceMappingURL=index.js.map