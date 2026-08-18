import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Product } from "./Product";
import { Operation } from "./Operation";

@Entity({ name: "product_operations" })
export class ProductOperation {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "product_id" })
  productId: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: "product_id" })
  product: Product;

  @Column({ name: "operation_id" })
  operationId: string;

  @ManyToOne(() => Operation)
  @JoinColumn({ name: "operation_id" })
  operation: Operation;

  @Column({ type: "integer" })
  sequence: number; // Ordem da operação no processo

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  setupTime: number; // Tempo de setup específico para este produto/operação

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  productionTime: number; // Tempo de produção específico para este produto/operação

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
