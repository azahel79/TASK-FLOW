"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("./lib/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function main() {
    console.log("🌱 Limpiando datos existentes...");
    await prisma_1.default.task.deleteMany();
    await prisma_1.default.project.deleteMany();
    await prisma_1.default.user.deleteMany();
    console.log("👤 Creando usuarios...");
    const hashedPassword = await bcryptjs_1.default.hash("password123", 10);
    const user1 = await prisma_1.default.user.create({
        data: {
            name: "Carlos García",
            email: "carlos@example.com",
            password: hashedPassword,
        },
    });
    const user2 = await prisma_1.default.user.create({
        data: {
            name: "María López",
            email: "maria@example.com",
            password: hashedPassword,
        },
    });
    console.log(`✅ Usuarios creados: ${user1.name}, ${user2.name}`);
    console.log("📂 Creando proyectos...");
    const projectsData = [
        {
            name: "Desarrollo Web",
            description: "Proyecto de desarrollo de aplicación web con React y Node.js",
            userId: user1.id,
            tasks: [
                { title: "Diseñar interfaz de usuario", description: "Crear mockups y prototipos en Figma", status: "done" },
                { title: "Configurar backend", description: "Inicializar Express con TypeScript y Prisma", status: "done" },
                { title: "Implementar autenticación", description: "JWT con login y registro", status: "in_progress" },
                { title: "Crear base de datos", description: "Diseñar esquema y migraciones", status: "in_progress" },
                { title: "Escribir tests", description: "Tests unitarios y de integración", status: "pending" },
                { title: "Deploy a producción", description: "Configurar CI/CD y desplegar", status: "pending" },
            ],
        },
        {
            name: "App Móvil",
            description: "Aplicación móvil multiplataforma con React Native",
            userId: user1.id,
            tasks: [
                { title: "Configurar entorno React Native", description: "Instalar dependencias y configurar Android/iOS", status: "done" },
                { title: "Diseñar navegación", description: "Implementar React Navigation", status: "in_progress" },
                { title: "Integrar API REST", description: "Conectar con el backend existente", status: "pending" },
                { title: "Implementar notificaciones push", description: "Firebase Cloud Messaging", status: "pending" },
            ],
        },
        {
            name: "Marketing Digital",
            description: "Campaña de marketing para lanzamiento del producto",
            userId: user1.id,
            tasks: [
                { title: "Investigación de mercado", description: "Análisis de competencia y público objetivo", status: "done" },
                { title: "Crear contenido para redes", description: "Posts, stories y videos cortos", status: "in_progress" },
                { title: "Configurar Google Ads", description: "Campañas de búsqueda y display", status: "pending" },
                { title: "Newsletter", description: "Diseñar y enviar primer boletín informativo", status: "pending" },
            ],
        },
        {
            name: "Proyecto de María",
            description: "Proyecto exclusivo de María con sus propias tareas",
            userId: user2.id,
            tasks: [
                { title: "Análisis de requerimientos", description: "Documentar necesidades del cliente", status: "done" },
                { title: "Prototipo funcional", description: "Crear MVP del producto", status: "in_progress" },
                { title: "Presentación final", description: "Preparar demo para stakeholders", status: "pending" },
            ],
        },
    ];
    for (const projectData of projectsData) {
        const { tasks, ...projectInfo } = projectData;
        const project = await prisma_1.default.project.create({
            data: {
                ...projectInfo,
                tasks: {
                    create: tasks,
                },
            },
            include: { tasks: true },
        });
        console.log(`  📁 ${project.name} - ${project.tasks.length} tareas`);
    }
    console.log("\n✨ Seed completado exitosamente!");
    console.log("\n📋 Usuarios de prueba:");
    console.log(`   ${user1.email} / password123 (3 proyectos)`);
    console.log(`   ${user2.email} / password123 (1 proyecto)`);
}
main()
    .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
})
    .finally(async () => {
    await prisma_1.default.$disconnect();
});
//# sourceMappingURL=seed.js.map