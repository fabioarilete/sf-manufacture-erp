import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "raw_materials" })
export class RawMaterial {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  unitOfMeasure: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  unitCost: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  currentStock: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  minStock: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
