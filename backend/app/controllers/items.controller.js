require("core-js/actual/array/group-by");
const {
  covertPriceToTwoDecimalPoints,
  convertStringPriceToFloat,
} = require("../utils/priceConversionUtils.js");
const { Op, literal } = require("sequelize");
const db = require("../models/index.js");
const httpStatusCodes = require("../constants/httpStatusCodes.js");

const InventoryItem = db.inventoryItem;

async function getAllItems(req, res) {
  const allItems = await InventoryItem.findAll();
  res.status(httpStatusCodes.OK).send({
    items: allItems,
  });
}

async function searchForCategory(req, res) {
  // Category = ALL
  if (req.body.category === "all") {
    const allItems = await InventoryItem.findAll();
    let aggregatedItemsByCategory = [];

    const itemsByCategory = allItems.groupBy((item) => {
      return item.category;
    });
    // Iterate through entries and populate aggregatedItemsByCategory
    for (const [key, value] of Object.entries(itemsByCategory)) {
      let aggregatedItem = {
        category: key,
        total_price: 0,
        count: value.length,
      };
      for (item of value) {
        aggregatedItem.total_price += convertStringPriceToFloat(item.price);
      }
      aggregatedItem.total_price = covertPriceToTwoDecimalPoints(
        aggregatedItem.total_price
      );
      aggregatedItemsByCategory.push(aggregatedItem);
    }
    res.status(httpStatusCodes.OK).send({
      items: aggregatedItemsByCategory,
    });
  }
  // Single Category
  else {
    // Check if single category exists in DB
    const itemsForSingleCategory = await InventoryItem.findAll({
      where: { category: req.body.category },
    });
    if (
      itemsForSingleCategory === undefined ||
      itemsForSingleCategory.length == 0
    ) {
      res.status(httpStatusCodes.BAD_REQUEST).send({
        message: "Category does not exist",
      });
    } else {
      const aggregatedItemsForSingleCategory = {
        items: [],
      };
      for (item of itemsForSingleCategory) {
        const { id, name, category, price, last_updated_dt } = item;
        aggregatedItemsForSingleCategory.items.push({
          id,
          name,
          category,
          price: convertStringPriceToFloat(item.price),
          last_updated_dt,
        });
      }
      res.status(httpStatusCodes.OK).send(aggregatedItemsForSingleCategory);
    }
  }
}

async function searchWithinDateRange(req, res) {
  const { dt_from: startDate, dt_to: endDate } = req.body;
  if (new Date(startDate) > new Date(endDate)) {
    res.status(httpStatusCodes.BAD_REQUEST).send({
      message: "Starting date is after end date",
    });
  }
  let aggregatedItemsWithinDateRange = {
    items: [],
    total_price: 0,
  };
  const itemsWithinDateRange = await InventoryItem.findAll({
    where: {
      last_updated_dt: {
        [Op.between]: [new Date(startDate + "Z"), new Date(endDate + "Z")],
      },
    },
  });
  for (item of itemsWithinDateRange) {
    const { id, name, category, price } = item;
    aggregatedItemsWithinDateRange.items.push({
      id,
      name,
      category,
      price: convertStringPriceToFloat(price),
    });
    aggregatedItemsWithinDateRange.total_price += convertStringPriceToFloat(
      item.price
    );
  }
  aggregatedItemsWithinDateRange.total_price = covertPriceToTwoDecimalPoints(
    aggregatedItemsWithinDateRange.total_price
  );
  res.status(httpStatusCodes.OK).send(aggregatedItemsWithinDateRange);
}

async function advancedSearch(req, res) {
  const { filters, pagination, sort } = req.body;

  let page = parseInt(pagination.page) || 1;
  let limit = parseInt(pagination.limit) || 10;
  const offset = (page - 1) * limit;
  let order;
  if (sort.order) {
    if (sort.order == "asc") order = "ASC";
    if (sort.order == "desc") order = "DESC";
  }

  const orderQuery =
    sort.field === "price"
      ? [literal("CAST(price AS DECIMAL(10, 2))"), order]
      : [sort.field, order];

  const itemsInPage = await InventoryItem.findAll({
    where: {
      ...(filters.name && { name: filters.name }),
      ...(filters.category && { category: filters.category }),
      ...(filters.price_range && {
        price: {
          [Op.between]: filters.price_range,
        },
      }),
    },
    limit,
    offset,
    order: [sort && orderQuery],
  });
  res.status(httpStatusCodes.OK).send({
    items: itemsInPage,
    count: itemsInPage.length,
    page,
    limit,
  });
}

exports.getAllItems = async (req, res) => {
  try {
    getAllItems(req, res);
  } catch (err) {
    console.error(err);
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).send({
      message: "Error searching for items",
    });
  }
};

exports.createOrUpdate = async (req, res) => {
  if (!req.body.name || !req.body.category || !req.body.price) {
    res.status(httpStatusCodes.BAD_REQUEST).send({
      message: "Fields: name, category are not all present",
    });
  }
  try {
    // Check if inventory item exists
    let item = await InventoryItem.findOne({ where: { name: req.body.name } });
    // If item does not exist, create one
    if (item === null) {
      item = await InventoryItem.create({
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
      });
    }
    // If inventory item exists, update the fields
    else {
      item.set({
        category: req.body.category,
        price: req.body.price,
      });
    }
    await item.save();
    res.status(httpStatusCodes.OK).send({
      id: item.id,
    });
  } catch (err) {
    console.error(err);
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).send({
      message: "Error creating/updating inventory item",
    });
  }
};

exports.search = (req, res) => {
  const numberOfKeys = Object.keys(req.body).length;
  try {
    function sendBadRequest() {
      res.status(httpStatusCodes.BAD_REQUEST).send({
        message: "Invalid request payload",
      });
    }

    if (numberOfKeys == 0) {
      getAllItems(req, res);
    } else if (numberOfKeys == 1) {
      // For category search only
      if (req.body.category) {
        searchForCategory(req, res);
      } else {
        sendBadRequest();
      }
    } else if (numberOfKeys == 2) {
      // Date range search only
      if (req.body.dt_from && req.body.dt_to) {
        searchWithinDateRange(req, res);
      } else {
        sendBadRequest();
      }
    } else if (numberOfKeys == 3) {
      if (req.body.filters && req.body.pagination && req.body.sort) {
        advancedSearch(req, res);
      } else {
        sendBadRequest();
      }
    } else {
      sendBadRequest();
    }
  } catch (err) {
    console.error(err);
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).send({
      message: "Error searching for items",
    });
  }
};

exports.categories = async (req, res) => {
  try {
    const distinctCategories = await InventoryItem.findAll({
      attributes: [
        [db.sequelize.fn("DISTINCT", db.sequelize.col("category")), "category"],
      ],
    });
    const categories = distinctCategories.map(
      (categoryObject) => categoryObject.category
    );
    res.status(httpStatusCodes.OK).send({
      categories,
    });
  } catch (err) {
    console.error(err);
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).send({
      message: "Error searching for items",
    });
  }
};
