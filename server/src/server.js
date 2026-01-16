import app from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./config/prisma.js";

async function testConnection() {
  try {
    await prisma.$connect();
    console.log("✅ Prisma connected successfully!");
  } catch (error) {
    console.error("❌ Prisma connection failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

app.listen(env.PORT, () => {
  console.log(`🚀 Server running on port ${env.PORT}`);
  testConnection()
});
