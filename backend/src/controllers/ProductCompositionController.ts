import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { ProductComposition } from "../entities/ProductComposition";

const compositionRepository = AppDataSource.getRepository(ProductComposition);

class ProductCompositionController {
  // ==========================================
  // 1. CRIAR COMPOSIÇÃO (POST /api/product-compositions)
  // ==========================================
  async create(req: Request, res: Response) {
    try {
      const { productId, rawMaterialId, quantity, wasteFactor } = req.body;

      // Validação
      if (!productId || !rawMaterialId || !quantity) {
        return res.status(400).json({
          error: "ProductId, RawMaterialId e Quantity são obrigatórios",
        });
      }

      // Criar a composição
      const composition = compositionRepository.create({
        productId,
        rawMaterialId,
        quantity: parseFloat(quantity),
        wasteFactor: wasteFactor ? parseFloat(wasteFactor) : 1.0,
      });

      // Salvar no banco
      await compositionRepository.save(composition);

      // Buscar a composição com os relacionamentos carregados
      const savedComposition = await compositionRepository.findOne({
        where: { id: composition.id },
        relations: {
          product: true,
          rawMaterial: true,
        },
      });

      return res.status(201).json(savedComposition || composition);
    } catch (error) {
      console.error("❌ Erro ao criar composição:", error);
      return res.status(500).json({ error: "Erro ao criar composição" });
    }
  }

  // ==========================================
  // 2. LISTAR TODAS AS COMPOSIÇÕES (GET /api/product-compositions)
  // ==========================================
  async findAll(req: Request, res: Response) {
    try {
      const compositions = await compositionRepository.find({
        relations: {
          product: true,
          rawMaterial: true,
        },
        order: {
          createdAt: "DESC",
        },
      });
      return res.json(compositions);
    } catch (error) {
      console.error("❌ Erro ao buscar composições:", error);
      return res.status(500).json({ error: "Erro ao buscar composições" });
    }
  }

  // ==========================================
  // 3. BUSCAR COMPOSIÇÕES POR PRODUTO (GET /api/product-compositions/product/:productId)
  // ==========================================
  async findByProduct(req: Request, res: Response) {
    try {
      const { productId } = req.params;

      // CORREÇÃO: Garantir que productId é uma string
      const compositions = await compositionRepository.find({
        where: {
          productId: productId as string, // <-- FORÇAR COMO STRING
        },
        relations: {
          rawMaterial: true,
        },
        order: {
          createdAt: "DESC",
        },
      });

      return res.json(compositions);
    } catch (error) {
      console.error("❌ Erro ao buscar composições do produto:", error);
      return res.status(500).json({ error: "Erro ao buscar composições" });
    }
  }

  // ==========================================
  // 4. DELETAR COMPOSIÇÃO (DELETE /api/product-compositions/:id)
  // ==========================================
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await compositionRepository.delete(id);

      if (result.affected === 0) {
        return res.status(404).json({ error: "Composição não encontrada" });
      }

      return res.status(204).send();
    } catch (error) {
      console.error("❌ Erro ao deletar composição:", error);
      return res.status(500).json({ error: "Erro ao deletar composição" });
    }
  }
}

export default new ProductCompositionController();
