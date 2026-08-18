import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Operation } from "../entities/Operation";

const operationRepository = AppDataSource.getRepository(Operation);

class OperationController {
  // ==========================================
  // 1. CRIAR OPERAÇÃO (POST /api/operations)
  // ==========================================
  async create(req: Request, res: Response) {
    try {
      const {
        code,
        name,
        description,
        setupTime,
        productionTime,
        fixedCost,
        isActive,
      } = req.body;

      // Validação
      if (!code || !name) {
        return res.status(400).json({
          error: "Código e Nome são obrigatórios",
        });
      }

      const operation = operationRepository.create({
        code,
        name,
        description,
        setupTime: setupTime ? parseFloat(setupTime) : 0,
        productionTime: productionTime ? parseFloat(productionTime) : 0,
        fixedCost: fixedCost ? parseFloat(fixedCost) : 0,
        isActive: isActive !== undefined ? isActive : true,
      });

      await operationRepository.save(operation);
      return res.status(201).json(operation);
    } catch (error) {
      console.error("❌ Erro ao criar operação:", error);
      return res.status(500).json({ error: "Erro ao criar operação" });
    }
  }

  // ==========================================
  // 2. LISTAR TODAS AS OPERAÇÕES (GET /api/operations)
  // ==========================================
  async findAll(req: Request, res: Response) {
    try {
      const operations = await operationRepository.find({
        order: { name: "ASC" },
      });
      return res.json(operations);
    } catch (error) {
      console.error("❌ Erro ao buscar operações:", error);
      return res.status(500).json({ error: "Erro ao buscar operações" });
    }
  }

  // ==========================================
  // 3. BUSCAR OPERAÇÃO POR ID (GET /api/operations/:id)
  // ==========================================
  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const operation = await operationRepository.findOne({
        where: { id: id as string },
      });

      if (!operation) {
        return res.status(404).json({ error: "Operação não encontrada" });
      }

      return res.json(operation);
    } catch (error) {
      console.error("❌ Erro ao buscar operação:", error);
      return res.status(500).json({ error: "Erro ao buscar operação" });
    }
  }

  // ==========================================
  // 4. ATUALIZAR OPERAÇÃO (PUT /api/operations/:id)
  // ==========================================
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const {
        code,
        name,
        description,
        setupTime,
        productionTime,
        fixedCost,
        isActive,
      } = req.body;

      const operation = await operationRepository.findOne({
        where: { id: id as string },
      });

      if (!operation) {
        return res.status(404).json({ error: "Operação não encontrada" });
      }

      operationRepository.merge(operation, {
        code,
        name,
        description,
        setupTime:
          setupTime !== undefined ? parseFloat(setupTime) : operation.setupTime,
        productionTime:
          productionTime !== undefined
            ? parseFloat(productionTime)
            : operation.productionTime,
        fixedCost:
          fixedCost !== undefined ? parseFloat(fixedCost) : operation.fixedCost,
        isActive: isActive !== undefined ? isActive : operation.isActive,
      });

      await operationRepository.save(operation);
      return res.json(operation);
    } catch (error) {
      console.error("❌ Erro ao atualizar operação:", error);
      return res.status(500).json({ error: "Erro ao atualizar operação" });
    }
  }

  // ==========================================
  // 5. DELETAR OPERAÇÃO (DELETE /api/operations/:id)
  // ==========================================
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await operationRepository.delete(id);

      if (result.affected === 0) {
        return res.status(404).json({ error: "Operação não encontrada" });
      }

      return res.status(204).send();
    } catch (error) {
      console.error("❌ Erro ao deletar operação:", error);
      return res.status(500).json({ error: "Erro ao deletar operação" });
    }
  }

  // ==========================================
  // 6. BUSCAR OPERAÇÕES ATIVAS (GET /api/operations/active)
  // ==========================================
  async findActive(req: Request, res: Response) {
    try {
      const operations = await operationRepository.find({
        where: { isActive: true },
        order: { name: "ASC" },
      });
      return res.json(operations);
    } catch (error) {
      console.error("❌ Erro ao buscar operações ativas:", error);
      return res.status(500).json({ error: "Erro ao buscar operações ativas" });
    }
  }
}

export default new OperationController();
