import express from "express";
import categoryRoutes from "./routes/categoryRoutes";
import subCategoryRoutes from "./routes/subCategoryRoutes";
import itemRoutes from "./routes/itemRoutes";

const app = express();
app.use(express.json());

app.use("/categories", categoryRoutes);
app.use("/subcategories", subCategoryRoutes);
app.use("/items", itemRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
