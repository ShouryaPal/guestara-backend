import { z } from "zod";

export const CategorySchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    image: z.string().url("Invalid image URL"),
    description: z.string().min(1, "Description is required"),
    taxApplicable: z.boolean(),
    tax: z.number().optional().nullable(),
    taxType: z.enum(["PERCENTAGE", "FIXED"]).optional().nullable(),
  })
  .refine(
    (data) =>
      !data.taxApplicable ||
      (data.tax !== undefined && data.taxType !== undefined),
    {
      message: "Tax and tax type are required when tax is applicable",
    },
  );

export const SubCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  image: z.string().url("Invalid image URL"),
  description: z.string().min(1, "Description is required"),
  categoryName: z.string().min(1, "Category name is required"), // Use categoryName instead of categoryId
  taxApplicable: z.boolean().optional(),
  tax: z.number().optional(),
});

export const ItemSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    image: z.string().url("Invalid image URL"),
    description: z.string().min(1, "Description is required"),
    taxApplicable: z.boolean(),
    tax: z.number().optional().nullable(),
    baseAmount: z.number().min(0, "Base amount must be positive"),
    discount: z.number().optional().default(0),
    totalAmount: z.number().min(0, "Total amount must be positive"),
    categoryName: z.string().optional(),
    subCategoryName: z.string().optional(),
  })
  .refine((data) => !data.taxApplicable || data.tax !== undefined, {
    message: "Tax is required when tax is applicable",
  })
  .refine(
    (data) => data.totalAmount === data.baseAmount - (data.discount || 0),
    {
      message: "Total amount must be base amount minus discount",
    },
  );

export const validateCategory = (data: unknown) => {
  return CategorySchema.safeParse(data);
};

export const validateSubCategory = (data: unknown) => {
  return SubCategorySchema.safeParse(data);
};

export const validateItem = (data: unknown) => {
  return ItemSchema.safeParse(data);
};
