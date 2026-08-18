import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { ProductOperation } from "../entities/ProductOperation";

const productOperationRepository =
  AppDataSource.getRepository(ProductOperation);

class ProductOperationController {
  // ==========================================
  // 1. CRIAR RELACIONAMENTO (POST /api/product-operations)
  // ==========================================
  async create(req: Request, res: Response) {
    try {
      const { productId, operationId, sequence, setupTime, productionTime } =
        req.body;

      // Validação
      if (!productId || !operationId || sequence === undefined) {
        return res.status(400).json({
          error: "ProductId, OperationId e Sequence são obrigatórios",
        });
      }

      // Verificar se já existe um relacionamento com a mesma sequência para este produto
      const existing = await productOperationRepository.findOne({
        where: {
          productId: productId as string,
          sequence: sequence,
        },
      });

      if (existing) {
        return res.status(409).json({
          error: `Já existe uma operação na sequência ${sequence} para este produto`,
        });
      }

      const productOperation = productOperationRepository.create({
        productId,
        operationId,
        sequence,
        setupTime: setupTime ? parseFloat(setupTime) : 0,
        productionTime: productionTime ? parseFloat(productionTime) : 0,
      });

      await productOperationRepository.save(productOperation);

      // Buscar com relacionamentos carregados
      const saved = await productOperationRepository.findOne({
        where: { id: productOperation.id },
        relations: { product: true, operation: true },
      });

      return res.status(201).json(saved || productOperation);
    } catch (error) {
      console.error("❌ Erro ao criar relacionamento:", error);
      return res.status(500).json({ error: "Erro ao criar relacionamento" });
    }
  }

  // ==========================================
  // 2. LISTAR TODOS OS RELACIONAMENTOS (GET /api/product-operations)
  // ==========================================
  async findAll(req: Request, res: Response) {
    try {
      const productOperations = await productOperationRepository.find({
        relations: { product: true, operation: true },
        order: { sequence: "ASC" },
      });
      return res.json(productOperations);
    } catch (error) {
      console.error("❌ Erro ao buscar relacionamentos:", error);
      return res.status(500).json({ error: "Erro ao buscar relacionamentos" });
    }
  }

  // ==========================================
  // 3. BUSCAR POR PRODUTO (GET /api/product-operations/product/:productId)
  // ==========================================
  async findByProduct(req: Request, res: Response) {
    try {
      const { productId } = req.params;

      const productOperations = await productOperationRepository.find({
        where: { productId: productId as string },
        relations: { operation: true },
        order: { sequence: "ASC" },
      });

      return res.json(productOperations);
    } catch (error) {
      console.error("❌ Erro ao buscar relacionamentos do produto:", error);
      return res.status(500).json({ error: "Erro ao buscar relacionamentos" });
    }
  }

  // ==========================================
  // 4. BUSCAR POR OPERAÇÃO (GET /api/product-operations/operation/:operationId)
  // ==========================================
  async findByOperation(req: Request, res: Response) {
    try {
      const { operationId } = req.params;

      const productOperations = await productOperationRepository.find({
        where: { operationId: operationId as string },
        relations: { product: true },
        order: { sequence: "ASC" },
      });

      return res.json(productOperations);
    } catch (error) {
      console.error("❌ Erro ao buscar relacionamentos da operação:", error);
      return res.status(500).json({ error: "Erro ao buscar relacionamentos" });
    }
  }

  // ==========================================
  // 5. ATUALIZAR RELACIONAMENTO (PUT /api/product-operations/:id)
  // ==========================================
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { sequence, setupTime, productionTime } = req.body;

      const productOperation = await productOperationRepository.findOne({
        where: { id: id as string },
      });

      if (!productOperation) {
        return res.status(404).json({ error: "Relacionamento não encontrado" });
      }

      // Se a sequência está sendo alterada, verificar conflito
      if (sequence !== undefined && sequence !== productOperation.sequence) {
        const existing = await productOperationRepository.findOne({
          where: {
            productId: productOperation.productId,
            sequence: sequence,
          },
        });

        if (existing && existing.id !== id) {
          return res.status(409).json({
            error: `Já existe uma operação na sequência ${sequence} para este produto`,
          });
        }
      }

      productOperationRepository.merge(productOperation, {
        sequence: sequence !== undefined ? sequence : productOperation.sequence,
        setupTime:
          setupTime !== undefined
            ? parseFloat(setupTime)
            : productOperation.setupTime,
        productionTime:
          productionTime !== undefined
            ? parseFloat(productionTime)
            : productOperation.productionTime,
      });

      await productOperationRepository.save(productOperation);

      // Buscar com relacionamentos carregados
      const updated = await productOperationRepository.findOne({
        where: { id: productOperation.id },
        relations: { product: true, operation: true },
      });

      return res.json(updated || productOperation);
    } catch (error) {
      console.error("❌ Erro ao atualizar relacionamento:", error);
      return res
        .status(500)
        .json({ error: "Erro ao atualizar relacionamento" });
    }
  }

  // ==========================================
  // 6. DELETAR RELACIONAMENTO (DELETE /api/product-operations/:id)
  // ==========================================
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await productOperationRepository.delete(id);

      if (result.affected === 0) {
        return res.status(404).json({ error: "Relacionamento não encontrado" });
      }

      return res.status(204).send();
    } catch (error) {
      console.error("❌ Erro ao deletar relacionamento:", error);
      return res.status(500).json({ error: "Erro ao deletar relacionamento" });
    }
  }
}

export default new ProductOperationController();
