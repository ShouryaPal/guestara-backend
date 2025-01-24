import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { validateItem } from "../utils/validationSchema";

const prisma = new PrismaClient();

export const getAllItems = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const items = await prisma.item.findMany({
      include: {
        category: true,
        subCategory: true,
      },
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch items" });
  }
};

export const getItemsByCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { categoryId } = req.params;
    const items = await prisma.item.findMany({
      where: { categoryId },
      include: {
        category: true,
        subCategory: true,
      },
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch items" });
  }
};

export const getItemsBySubCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { subCategoryId } = req.params;
    const items = await prisma.item.findMany({
      where: { subCategoryId },
      include: {
        category: true,
        subCategory: true,
      },
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch items" });
  }
};

export const getItemById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const item = await prisma.item.findUnique({
      where: { id },
      include: {
        category: true,
        subCategory: true,
      },
    });
    if (!item) {
      res.status(404).json({ error: "Item not found" });
      return;
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch item" });
  }
};

export const getItemByName = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name } = req.params;
    const item = await prisma.item.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
      include: {
        category: true,
        subCategory: true,
      },
    });
    if (!item) {
      res.status(404).json({ error: "Item not found" });
      return;
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch item" });
  }
};

export const searchItems = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== "string") {
      res.status(400).json({ error: "Search query is required" });
      return;
    }

    const items = await prisma.item.findMany({
      where: {
        name: { contains: q, mode: "insensitive" },
      },
      include: {
        category: true,
        subCategory: true,
      },
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Failed to search items" });
  }
};

export const createItem = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const validation = validateItem(req.body);
    if (!validation.success) {
      res.status(400).json({ error: validation.error.errors });
      return;
    }

    const {
      name,
      image,
      description,
      taxApplicable,
      tax,
      baseAmount,
      discount,
      totalAmount,
      categoryId,
      subCategoryId,
    } = validation.data;

    if (!categoryId && !subCategoryId) {
      res
        .status(400)
        .json({ error: "Either categoryId or subCategoryId is required" });
      return;
    }

    const newItem = await prisma.item.create({
      data: {
        name,
        image,
        description,
        taxApplicable,
        tax: taxApplicable ? tax : null,
        baseAmount,
        discount: discount || 0,
        totalAmount,
        categoryId,
        subCategoryId,
      },
    });

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: "Failed to create item" });
  }
};

export const updateItem = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const validation = validateItem(req.body);
    if (!validation.success) {
      res.status(400).json({ error: validation.error.errors });
      return;
    }

    const {
      name,
      image,
      description,
      taxApplicable,
      tax,
      baseAmount,
      discount,
      totalAmount,
      categoryId,
      subCategoryId,
    } = validation.data;

    const updatedItem = await prisma.item.update({
      where: { id },
      data: {
        name,
        image,
        description,
        taxApplicable,
        tax: taxApplicable ? tax : null,
        baseAmount,
        discount: discount || 0,
        totalAmount,
        categoryId,
        subCategoryId,
      },
    });

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: "Failed to update item" });
  }
};
