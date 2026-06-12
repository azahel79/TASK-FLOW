import prisma from "./lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Limpiando datos existentes...");

  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  console.log("👤 Creando usuarios...");

  const hashedPassword = await bcrypt.hash("password123", 10);

  const user1 = await prisma.user.create({
    data: {
      name: "Carlos García",
      email: "carlos@example.com",
      password: hashedPassword,
    },
  });

  const user2 = await prisma.user.create({
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
        { title: "Diseñar interfaz de usuario", description: "Crear mockups y prototipos en Figma", status: "done" as const },
        { title: "Configurar backend", description: "Inicializar Express con TypeScript y Prisma", status: "done" as const },
        { title: "Implementar autenticación", description: "JWT con login y registro", status: "in_progress" as const },
        { title: "Crear base de datos", description: "Diseñar esquema y migraciones", status: "in_progress" as const },
        { title: "Escribir tests", description: "Tests unitarios y de integración", status: "pending" as const },
        { title: "Deploy a producción", description: "Configurar CI/CD y desplegar", status: "pending" as const },
      ],
    },
    {
      name: "App Móvil",
      description: "Aplicación móvil multiplataforma con React Native",
      userId: user1.id,
      tasks: [
        { title: "Configurar entorno React Native", description: "Instalar dependencias y configurar Android/iOS", status: "done" as const },
        { title: "Diseñar navegación", description: "Implementar React Navigation", status: "in_progress" as const },
        { title: "Integrar API REST", description: "Conectar con el backend existente", status: "pending" as const },
        { title: "Implementar notificaciones push", description: "Firebase Cloud Messaging", status: "pending" as const },
      ],
    },
    {
      name: "Marketing Digital",
      description: "Campaña de marketing para lanzamiento del producto",
      userId: user1.id,
      tasks: [
        { title: "Investigación de mercado", description: "Análisis de competencia y público objetivo", status: "done" as const },
        { title: "Crear contenido para redes", description: "Posts, stories y videos cortos", status: "in_progress" as const },
        { title: "Configurar Google Ads", description: "Campañas de búsqueda y display", status: "pending" as const },
        { title: "Newsletter", description: "Diseñar y enviar primer boletín informativo", status: "pending" as const },
      ],
    },
    {
      name: "Proyecto de María",
      description: "Proyecto exclusivo de María con sus propias tareas",
      userId: user2.id,
      tasks: [
        { title: "Análisis de requerimientos", description: "Documentar necesidades del cliente", status: "done" as const },
        { title: "Prototipo funcional", description: "Crear MVP del producto", status: "in_progress" as const },
        { title: "Presentación final", description: "Preparar demo para stakeholders", status: "pending" as const },
      ],
    },
  ];

  for (const projectData of projectsData) {
    const { tasks, ...projectInfo } = projectData;

    const project = await prisma.project.create({
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
    await prisma.$disconnect();
  });