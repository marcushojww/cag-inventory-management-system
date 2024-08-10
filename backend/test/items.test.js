var chai = require("chai");
var should = chai.should();
var expect = chai.expect;
var chaiHttp = require("chai-http");
var server = require("../server.js");
const db = require("../app/models/index.js");
const {
  convertStringPriceToFloat,
  covertPriceToTwoDecimalPoints,
} = require("../app/utils/priceConversionUtils.js");

chai.use(chaiHttp);
const InventoryItem = db.inventoryItem;
var inventoryItems;

describe("Inventory items CRU unit tests", () => {
  // Creates table, dropping it first if it already existed
  // Then add mock data
  beforeEach(async () => {
    await db.sequelize.sync({ force: true });
    inventoryItems = await InventoryItem.bulkCreate([
      { name: "Speaker", category: "Gift", price: 150.5 },
      { name: "Bottle", category: "Gift", price: 10.5 },
      { name: "Figurine", category: "Toy", price: 90.2 },
    ]);
  });
  // Drop all tables
  afterEach(async () => {
    await db.sequelize.drop();
  });

  describe("/items/categories", () => {
    it("should list all distinct categories", (done) => {
      const categories = ["Gift", "Toy"];
      chai
        .request(server)
        .get("/items/categories")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("categories");
          res.body.categories.should.have.lengthOf(2);
          for (category of res.body.categories) {
            expect(categories.includes(category)).to.be.true;
          }
          done();
        });
    });
  });

  describe("/items", () => {
    it("Adding new item", (done) => {
      chai
        .request(server)
        .post("/items")
        .send({
          name: "Notebook",
          category: "Stationery",
          price: 5.5,
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("id");
          res.body.id.should.equal(4);
          done();
        });
    });
  });

  describe("/items", () => {
    it("Updating existing item", (done) => {
      chai
        .request(server)
        .post("/items")
        .send({
          name: "Speaker",
          category: "Stationery",
          price: 5.5,
        })
        .end(async (err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("id");
          const item = await InventoryItem.findOne({
            where: { id: res.body.id },
          });
          item.category.should.equal("Stationery");
          convertStringPriceToFloat(item.price).should.equal(5.5);
          done();
        });
    });
  });

  describe("/items/search", () => {
    it("Get aggregated items data per category", (done) => {
      chai
        .request(server)
        .post("/items/search")
        .send({
          category: "all",
        })
        .end(async (err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("items");
          res.body.items.should.have.lengthOf(2);
          for (aggItems of res.body.items) {
            aggItems.should.have.property("category");
            aggItems.should.have.property("total_price");
            aggItems.should.have.property("count");
            if (aggItems.category === "Gift") {
              aggItems.total_price.should.equal(
                covertPriceToTwoDecimalPoints(150.5 + 10.5)
              );
            }
            if (aggItems.category === "Toy") {
              aggItems.total_price.should.equal(
                covertPriceToTwoDecimalPoints(90.2)
              );
            }
          }
          done();
        });
    });
  });

  describe("/items/search", () => {
    it("Get items for a single category", (done) => {
      chai
        .request(server)
        .post("/items/search")
        .send({
          category: "Gift",
        })
        .end(async (err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("items");
          res.body.items.should.have.lengthOf(2);
          for (item of res.body.items) {
            item.should.have.property("id");
            item.should.have.property("name");
            item.should.have.property("category");
            item.should.have.property("price");
            if (item.name === "Speaker") {
              item.price.should.equal(150.5);
              item.category.should.equal("Gift");
            }
            if (item.name === "Bottle") {
              item.price.should.equal(10.5);
              item.category.should.equal("Gift");
            }
          }
          done();
        });
    });
  });
});
