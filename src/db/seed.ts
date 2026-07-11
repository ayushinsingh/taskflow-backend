import prisma from "../config/db.ts";

async function main() {
  console.log("🌱 Cleaning out old data...");

  await prisma.workspace.deleteMany();

  console.log("🌱 Inserting fresh sample board layout...");
  const workspace = await prisma.workspace.create({
    data: { name: "Engineering Squad Workspace" },
  });

  const board = await prisma.board.create({
    data: {
      title: "Q3 Development Sprint",
      workspaceId: workspace.id,
    },
  });

  const todoColumn = await prisma.column.create({
    data: {
      title: "To do",
      position: 0,
      boardId: board.id,
    },
  });

  const inProgressColumn = await prisma.column.create({
    data: {
      title: "In Progress",
      position: 1,
      boardId: board.id,
    },
  });

  const task1 = await prisma.task.create({
    data: {
      title: "Configure Development Environment",
      description: "Initialize repository layout structure and styling baselines.",
      priority: "high",
      position: 0,
      columnId: todoColumn.id,
    },
  });

  await prisma.subtask.createMany({
    data: [
      { title: "Create JSX structure", position: 0, taskId: task1.id },
      { title: "Add state logic", position: 1, taskId: task1.id },
    ],
  });

  console.log("✅ Database successfully seeded!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });