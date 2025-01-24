import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { validateSubCategory } from "../utils/validationSchema";

const prisma = new PrismaClient();

export const getAllSubCategories = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const subCategories = await prisma.subCategory.findMany({
      include: {
        category: true,
        items: true,
      },
    });
    res.json(subCategories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sub-categories" });
  }
};

export const getSubCategoriesByCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { categoryId } = req.params;
    const subCategories = await prisma.subCategory.findMany({
      where: { categoryId },
      include: {
        items: true,
      },
    });
    res.json(subCategories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sub-categories" });
  }
};

export const getSubCategoryById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const subCategory = await prisma.subCategory.findUnique({
      where: { id },
      include: {
        category: true,
        items: true,
      },
    });
    if (!subCategory) {
      res.status(404).json({ error: "Sub-category not found" });
      return;
    }
    res.json(subCategory);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sub-category" });
  }
};

export const getSubCategoryByName = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name } = req.params;
    const subCategory = await prisma.subCategory.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
      include: {
        category: true,
        items: true,
      },
    });
    if (!subCategory) {
      res.status(404).json({ error: "Sub-category not found" });
      return;
    }
    res.json(subCategory);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sub-category" });
  }
};

export const createSubCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const validation = validateSubCategory(req.body);
    if (!validation.success) {
      res.status(400).json({ error: validation.error.errors });
      return;
    }

    const { name, image, description, categoryId, taxApplicable, tax } =
      validation.data;
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      res.status(404).json({ error: "Category not found" });
      return;
    }

    const newSubCategory = await prisma.subCategory.create({
      data: {
        name,
        image,
        description,
        categoryId,
        taxApplicable: taxApplicable ?? category.taxApplicable,
        tax: tax ?? category.tax,
      },
    });

    res.status(201).json(newSubCategory);
  } catch (error) {
    res.status(500).json({ error: "Failed to create sub-category" });
  }
};

export const updateSubCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const validation = validateSubCategory(req.body);
    if (!validation.success) {
      res.status(400).json({ error: validation.error.errors });
      return;
    }

    const { name, image, description, categoryId, taxApplicable, tax } =
      validation.data;

    const updatedSubCategory = await prisma.subCategory.update({
      where: { id },
      data: {
        name,
        image,
        description,
        categoryId,
        taxApplicable,
        tax,
      },
    });

    res.status(200).json(updatedSubCategory);
  } catch (error) {
    res.status(500).json({ error: "Failed to update sub-category" });
  }
};
