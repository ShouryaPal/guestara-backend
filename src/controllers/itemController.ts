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
      categoryName,
      subCategoryName,
    } = validation.data;

    let categoryId: string | undefined;
    let subCategoryId: string | undefined;

    // Find the sub-category by name (if provided)
    if (subCategoryName) {
      const subCategory = await prisma.subCategory.findFirst({
        where: { name: subCategoryName },
        include: { category: true },
      });

      if (!subCategory) {
        res.status(404).json({ error: "Sub-category not found" });
        return;
      }

      subCategoryId = subCategory.id;
      categoryId = subCategory.categoryId; // Use the category ID from the sub-category
    }

    // Find the category by name (if sub-category is not provided)
    if (categoryName && !subCategoryName) {
      const category = await prisma.category.findFirst({
        where: { name: categoryName },
      });

      if (!category) {
        res.status(404).json({ error: "Category not found" });
        return;
      }

      categoryId = category.id;
    }

    // Ensure either categoryId or subCategoryId is provided
    if (!categoryId && !subCategoryId) {
      res
        .status(400)
        .json({ error: "Either categoryName or subCategoryName is required" });
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
    console.error("Error creating item:", error);
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
      categoryName,
      subCategoryName,
    } = validation.data;

    let categoryId: string | undefined;
    let subCategoryId: string | undefined;

    // Find the sub-category by name (if provided)
    if (subCategoryName) {
      const subCategory = await prisma.subCategory.findFirst({
        where: { name: subCategoryName },
        include: { category: true },
      });

      if (!subCategory) {
        res.status(404).json({ error: "Sub-category not found" });
        return;
      }

      subCategoryId = subCategory.id;
      categoryId = subCategory.categoryId; // Use the category ID from the sub-category
    }

    // Find the category by name (if sub-category is not provided)
    if (categoryName && !subCategoryName) {
      const category = await prisma.category.findFirst({
        where: { name: categoryName },
      });

      if (!category) {
        res.status(404).json({ error: "Category not found" });
        return;
      }

      categoryId = category.id;
    }

    // Ensure either categoryId or subCategoryId is provided
    if (!categoryId && !subCategoryId) {
      res
        .status(400)
        .json({ error: "Either categoryName or subCategoryName is required" });
      return;
    }

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
    console.error("Error updating item:", error);
    res.status(500).json({ error: "Failed to update item" });
  }
};
