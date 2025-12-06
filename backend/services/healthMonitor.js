// Health Monitoring Service
const mongoose = require("mongoose");

// Database health check
const checkDatabaseHealth = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.db.admin().ping();
      return { status: "healthy", message: "Database connected" };
    }
    return { status: "unhealthy", message: "Database disconnected" };
  } catch (error) {
    return { status: "unhealthy", message: error.message };
  }
};

// Memory usage check
const checkMemoryUsage = () => {
  const used = process.memoryUsage();
  const memoryMB = {
    rss: Math.round(used.rss / 1024 / 1024),
    heapTotal: Math.round(used.heapTotal / 1024 / 1024),
    heapUsed: Math.round(used.heapUsed / 1024 / 1024),
    external: Math.round(used.external / 1024 / 1024),
  };

  const threshold = 450; // MB
  const status = memoryMB.heapUsed < threshold ? "healthy" : "warning";

  return {
    status,
    usage: memoryMB,
    threshold: `${threshold}MB`,
  };
};

// Uptime check
const getUptime = () => {
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);

  return {
    seconds: uptime,
    formatted: `${hours}h ${minutes}m ${seconds}s`,
  };
};

// Comprehensive health check
const performHealthCheck = async () => {
  const database = await checkDatabaseHealth();
  const memory = checkMemoryUsage();
  const uptime = getUptime();

  const isHealthy =
    database.status === "healthy" && memory.status !== "critical";

  return {
    status: isHealthy ? "healthy" : "degraded",
    timestamp: new Date().toISOString(),
    checks: {
      database,
      memory,
      uptime,
    },
    environment: process.env.NODE_ENV || "development",
    version: process.env.npm_package_version || "1.0.0",
  };
};

// Periodic health monitoring (every 5 minutes)
const startHealthMonitoring = () => {
  setInterval(async () => {
    const health = await performHealthCheck();
    if (health.status !== "healthy") {
      console.warn("⚠️ HEALTH CHECK WARNING:", JSON.stringify(health, null, 2));
    } else {
      console.log(`✅ Health Check: ${health.status} | Memory: ${health.checks.memory.usage.heapUsed}MB | Uptime: ${health.checks.uptime.formatted}`);
    }
  }, 5 * 60 * 1000);
};

// Graceful shutdown handler
const setupGracefulShutdown = (server) => {
  const shutdown = async (signal) => {
    console.log(`\n⚠️  Received ${signal}. Starting graceful shutdown...`);

    // Stop accepting new connections
    server.close(async () => {
      console.log("✅ HTTP server closed");

      // Close database connection
      try {
        await mongoose.connection.close();
        console.log("✅ Database connection closed");
        process.exit(0);
      } catch (error) {
        console.error("❌ Error during shutdown:", error);
        process.exit(1);
      }
    });

    // Force shutdown after 30 seconds
    setTimeout(() => {
      console.error("❌ Forced shutdown after timeout");
      process.exit(1);
    }, 30000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
};

module.exports = {
  performHealthCheck,
  startHealthMonitoring,
  setupGracefulShutdown,
};
