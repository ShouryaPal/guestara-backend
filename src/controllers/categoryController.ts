import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { validateCategory } from "../utils/validationSchema";

const prisma = new PrismaClient();

export const getAllCategories = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        subCategories: true,
        items: true,
      },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

export const getCategoryById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        subCategories: true,
        items: true,
      },
    });
    if (!category) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch category" });
  }
};

export const getCategoryByName = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name } = req.params;
    const category = await prisma.category.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
      include: {
        subCategories: true,
        items: true,
      },
    });
    if (!category) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch category" });
  }
};

export const createCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const validation = validateCategory(req.body);
    if (!validation.success) {
      res.status(400).json({ error: validation.error.errors });
      return;
    }

    const { name, image, description, taxApplicable, tax, taxType } =
      validation.data;

    const newCategory = await prisma.category.create({
      data: {
        name,
        image,
        description,
        taxApplicable,
        tax: taxApplicable ? tax : null,
        taxType: taxApplicable ? taxType : null,
      },
    });

    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error creating category:", error); // Log the actual error
    res.status(500).json({ error: "Failed to create category" });
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const validation = validateCategory(req.body);
    if (!validation.success) {
      res.status(400).json({ error: validation.error.errors });
      return;
    }

    const { name, image, description, taxApplicable, tax, taxType } =
      validation.data;

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name,
        image,
        description,
        taxApplicable,
        tax: taxApplicable ? tax : null,
        taxType: taxApplicable ? taxType : null,
      },
    });

    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Failed to update category" });
  }
};
