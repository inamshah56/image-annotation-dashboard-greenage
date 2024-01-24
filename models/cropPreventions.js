// const { Model, DataTypes } = require("sequelize");
// const { sequelize2 } = require("../utils/db");

// class CropPrevention extends Model {}

function checkValidation(msg) {
  return {
    notEmpty: {
      msg: `${msg} cannot be empty`,
    },
    notNull: {
      msg: `${msg} cannot be null`,
    },
  };
}

const { Sequelize } = require("sequelize");
const { sequelize2 } = require("../utils/db");

const CropPrevention = sequelize2.define(
  "crop_prevention",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    condition: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    severity: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "general",
    },
    prevention_eng: {
      type: Sequelize.TEXT,
    },
    prevention_urdu: {
      type: Sequelize.TEXT,
    },
    formula: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    chemical_control_eng: {
      type: Sequelize.STRING,
    },
    chemical_control_urdu: {
      type: Sequelize.STRING,
    },
  },
  {
    timestamps: false,
    uniqueKeys: {
      unique_condition_severity: {
        fields: ["condition", "severity"],
      },
    },
  }
);

module.exports = { CropPrevention };
