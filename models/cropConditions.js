const { Sequelize } = require("sequelize");
const { sequelize2 } = require("../utils/db");
const cropCondition = sequelize2.define("cropCondition", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    cropname: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Cropname cannot be null.'
            },
            notEmpty: {
                msg: 'Cropname cannot be empty.'
            }
        },
    },
    condition: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Condition cannot be empty.'
            },
            notNull: {
                msg: 'Condition cannot be null.'
            }
        },
    }
},
    {
        timestamps: false,
        indexes: [{
            unique: true,
            fields: ['cropname', 'condition'],
            name: 'unique_cropname_condition'
        }]
    });
module.exports = { cropCondition };