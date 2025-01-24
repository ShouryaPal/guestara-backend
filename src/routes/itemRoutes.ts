import express from "express";
import {
  getAllItems,
  getItemsByCategory,
  getItemsBySubCategory,
  getItemById,
  getItemByName,
  searchItems,
  createItem,
  updateItem,
} from "../controllers/itemController";

const router = express.Router();

router.get("/", getAllItems);
router.get("/category/:categoryId", getItemsByCategory);
router.get("/subcategory/:subCategoryId", getItemsBySubCategory);
router.get("/id/:id", getItemById);
router.get("/name/:name", getItemByName);
router.get("/search", searchItems);
router.post("/", createItem);
router.put("/:id", updateItem);

export default router;
