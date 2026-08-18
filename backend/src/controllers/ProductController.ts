import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Product } from "../entities/Product";

const productRepository = AppDataSource.getRepository(Product);

class ProductController {
  async create(req: Request, res: Response) {
    try {
      const { sku, name, description, category, unitOfMeasure } = req.body;

      if (!sku || !name || !category) {
        return res.status(400).json({
          error: "SKU, Nome e Categoria são obrigatórios",
        });
      }

      const product = productRepository.create({
        sku,
        name,
        description,
        category,
        unitOfMeasure: unitOfMeasure || "UN",
      });

      await productRepository.save(product);

      return res.status(201).json(product);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao criar produto" });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const products = await productRepository.find({
        order: { name: "ASC" },
      });
      return res.json(products);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar produtos" });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id || Array.isArray(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }
      const product = await productRepository.findOne({ where: { id } });

      if (!product) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }

      return res.json(product);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar produto" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id || Array.isArray(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }
      const { name, description, category, unitOfMeasure } = req.body;

      const product = await productRepository.findOne({ where: { id } });

      if (!product) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }

      productRepository.merge(product, {
        name,
        description,
        category,
        unitOfMeasure,
      });

      await productRepository.save(product);

      return res.json(product);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao atualizar produto" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await productRepository.delete(id);

      if (result.affected === 0) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }

      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao deletar produto" });
    }
  }
}

export default new ProductController();
