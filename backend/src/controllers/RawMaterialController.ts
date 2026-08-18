import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { RawMaterial } from "../entities/RawMaterial";

const rawMaterialRepository = AppDataSource.getRepository(RawMaterial);

class RawMaterialController {
  async create(req: Request, res: Response) {
    try {
      const {
        code,
        name,
        description,
        unitOfMeasure,
        unitCost,
        currentStock,
        minStock,
      } = req.body;

      if (!code || !name || !unitOfMeasure || !unitCost === undefined) {
        return res.status(400).json({
          error: "Código, Nome, Unidade e Custo Unitário são obrigatórios",
        });
      }

      const rawMaterial = rawMaterialRepository.create({
        code,
        name,
        description,
        unitOfMeasure,
        unitCost: parseFloat(unitCost),
        currentStock: currentStock ? parseFloat(currentStock) : 0,
        minStock: minStock ? parseFloat(minStock) : 0,
      });

      await rawMaterialRepository.save(rawMaterial);

      return res.status(201).json(rawMaterial);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao criar matéria-prima" });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const rawMaterial = await rawMaterialRepository.find({
        order: { name: "ASC" },
      });
      return res.json(rawMaterial);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar matérias-primas" });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id || Array.isArray(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }
      const rawMaterial = await rawMaterialRepository.findOne({
        where: { id },
      });

      if (!rawMaterial) {
        return res.status(404).json({ error: "Matéria-Prima não encontrada" });
      }

      return res.json(rawMaterial);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar matéria-prima" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id || Array.isArray(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }
      const {
        name,
        description,
        unitOfMeasure,
        unitCost,
        currentStock,
        minStock,
      } = req.body;

      const rawMaterial = await rawMaterialRepository.findOne({
        where: { id },
      });

      if (!rawMaterial) {
        return res.status(404).json({ error: "Matéria-Prima não encontrada" });
      }

      rawMaterialRepository.merge(rawMaterial, {
        name,
        description,
        unitOfMeasure,
        unitCost:
          unitCost !== undefined ? parseFloat(unitCost) : rawMaterial.unitCost,
        currentStock:
          currentStock !== undefined
            ? parseFloat(currentStock)
            : rawMaterial.currentStock,
        minStock:
          minStock !== undefined ? parseFloat(minStock) : rawMaterial.minStock,
      });

      await rawMaterialRepository.save(rawMaterial);

      return res.json(rawMaterial);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao atualizar matéria-prima" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await rawMaterialRepository.delete(id);

      if (result.affected === 0) {
        return res.status(404).json({ error: "Matéria-Prima não encontrada" });
      }

      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao deletar matéria-prima" });
    }
  }
}

export default new RawMaterialController();
