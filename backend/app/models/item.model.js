/**
 * @param {new Sequelize()} sequelize sequelize instance
 * @param {Object} DataTypes Expected field type
 */
module.exports = (sequelize, DataTypes) => {
  const InventoryItem = sequelize.define(
    "InventoryItem",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "inventory_items",
      timestamps: true,
      createdAt: false,
      updatedAt: "last_updated_dt",
    }
  );

  return InventoryItem;
};
