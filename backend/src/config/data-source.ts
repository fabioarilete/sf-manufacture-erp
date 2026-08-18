import "reflect-metadata";
import { DataSource } from "typeorm";
import { Product } from "../entities/Product";
import { RawMaterial } from "../entities/RawMaterial"; // <-- ADICIONAR ESTA LINHA
import { ProductComposition } from "../entities/ProductComposition";
import { Operation } from "../entities/Operation";
import { ProductOperation } from "../entities/ProductOperation";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "sf_manufacture_erp",
  synchronize: true,
  logging: true,
  entities: [
    Product,
    RawMaterial,
    ProductComposition,
    Operation,
    ProductOperation,
  ], // <-- ADICIONAR AQUI
  migrations: ["src/migrations/*.ts"],
  subscribers: [],
});
