import "reflect-metadata";
import app from "./server";
import { AppDataSource } from "./config/data-source";

const PORT = process.env.PORT || 3333;

async function startServer() {
  try {
    await AppDataSource.initialize();
    console.log("✅ Conectado ao banco de dados");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor em: http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error("❌ Erro ao conectar ao banco:", error);
    process.exit(1);
  }
}

startServer();
