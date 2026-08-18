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
import { RawMaterial } from "./RawMaterial";

@Entity({ name: "product_compositions" })
export class ProductComposition {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "product_id" })
  productId: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: "product_id" })
  product: Product;

  @Column({ name: "raw_material_id" })
  rawMaterialId: string;

  @ManyToOne(() => RawMaterial)
  @JoinColumn({ name: "raw_material_id" })
  rawMaterial: RawMaterial;

  @Column({ type: "decimal", precision: 10, scale: 3 })
  quantity: number;

  @Column({ type: "decimal", precision: 10, scale: 3, default: 1.0 })
  wasteFactor: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
