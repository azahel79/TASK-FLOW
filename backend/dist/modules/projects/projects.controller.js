"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectsController = exports.ProjectsController = void 0;
const middleware_1 = require("../../middleware");
const utils_1 = require("../../utils");
const projects_service_1 = require("./projects.service");
class ProjectsController {
    constructor() {
        this.getAll = (0, middleware_1.asyncHandler)(async (req, res) => {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search;
            const userId = req.userId;
            const { projects, total } = await projects_service_1.projectsService.findAll({ page, limit, search, userId });
            return (0, utils_1.sendPaginated)(res, projects, total, page, limit);
        });
        this.getById = (0, middleware_1.asyncHandler)(async (req, res) => {
            const id = parseInt(String(req.params.id));
            const userId = req.userId;
            const project = await projects_service_1.projectsService.findById(id, userId);
            return (0, utils_1.sendSuccess)(res, project);
        });
        this.create = (0, middleware_1.asyncHandler)(async (req, res) => {
            const { name, description } = req.body;
            const userId = req.userId;
            const project = await projects_service_1.projectsService.create({ name, description, userId });
            return (0, utils_1.sendSuccess)(res, project, 201, "Proyecto creado exitosamente");
        });
        this.update = (0, middleware_1.asyncHandler)(async (req, res) => {
            const id = parseInt(String(req.params.id));
            const userId = req.userId;
            const { name, description } = req.body;
            const project = await projects_service_1.projectsService.update(id, { name, description }, userId);
            return (0, utils_1.sendSuccess)(res, project, 200, "Proyecto actualizado exitosamente");
        });
        this.delete = (0, middleware_1.asyncHandler)(async (req, res) => {
            const id = parseInt(String(req.params.id));
            const userId = req.userId;
            await projects_service_1.projectsService.delete(id, userId);
            return (0, utils_1.sendSuccess)(res, null, 200, "Proyecto eliminado exitosamente");
        });
    }
}
exports.ProjectsController = ProjectsController;
exports.projectsController = new ProjectsController();
//# sourceMappingURL=projects.controller.js.map