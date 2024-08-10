module.exports = (app) => {
  const inventoryItemController = require("../controllers/items.controller.js");
  var router = require("express").Router();

  // Get all items
  router.get("/", inventoryItemController.getAllItems);

  // Create/update inventory item
  router.post("/", inventoryItemController.createOrUpdate);

  // Search
  router.post("/search", inventoryItemController.search);

  // Get Distinct Categories
  router.get("/categories", inventoryItemController.categories);

  app.use("/items", router);
};
