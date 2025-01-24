import express from "express";
import {
  createSubCategory,
  getAllSubCategories,
  getSubCategoriesByCategory,
  getSubCategoryById,
  getSubCategoryByName,
  updateSubCategory,
} from "../controllers/subCategoryController";

const router = express.Router();

router.get("/", getAllSubCategories);
router.get("/category/:categoryId", getSubCategoriesByCategory);
router.get("/id/:id", getSubCategoryById);
router.get("/name/:name", getSubCategoryByName);
router.post("/", createSubCategory);
router.put("/:id", updateSubCategory);

export default router;
