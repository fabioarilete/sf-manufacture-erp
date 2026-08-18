import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "operations" })
export class Operation {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  setupTime: number; // Tempo de setup em minutos

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  productionTime: number; // Tempo de produção por unidade (minutos)

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  fixedCost: number; // Custo fixo por operação (ex: energia, manutenção)

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
