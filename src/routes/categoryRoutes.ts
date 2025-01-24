import express, { Router } from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  getCategoryByName,
  updateCategory,
} from "../controllers/categoryController";

const router: Router = express.Router();

router.get("/", getAllCategories);
router.get("/id/:id", getCategoryById);
router.get("/name/:name", getCategoryByName);
router.post("/", createCategory);
router.put("/:id", updateCategory);

export default router;
