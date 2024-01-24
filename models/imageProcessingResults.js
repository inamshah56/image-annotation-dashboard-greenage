const { Sequelize } = require("sequelize");
const { sequelize2 } = require("../utils/db");

const imageProcessingResult = sequelize2.define("image_processing_results", {
    id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    farm_id: {
        type: Sequelize.BIGINT
    },
    crop: {
        type: Sequelize.STRING(30),
    },
    crop_variety: {
        type: Sequelize.STRING(30),
    },
    crop_age: {
        type: Sequelize.INTEGER,
    },
    crop_stage: {
        type: Sequelize.STRING(50),
    },
    img1: {
        type: Sequelize.STRING(500),
    },
    img_date: {
        type: Sequelize.DATEONLY,
        defaultValue: Sequelize.NOW
    },
    average_prediction: {
        type: Sequelize.STRING(5000),
    },
    img2: {
        type: Sequelize.STRING(500),
    },
    img3: {
        type: Sequelize.STRING(500),
    },
    img4: {
        type: Sequelize.STRING(500),
    },
    img5: {
        type: Sequelize.STRING(500),
    },
    img1_result: {
        type: Sequelize.STRING(30),
    },
    img2_result: {
        type: Sequelize.STRING(30),
    },
    img3_result: {
        type: Sequelize.STRING(30),
    },
    img4_result: {
        type: Sequelize.STRING(30),
    },
    img5_result: {
        type: Sequelize.STRING(30),
    },
    img_count: {
        type: Sequelize.INTEGER,
    },
    annotated: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
    img1_annotation: {
        type: Sequelize.STRING(255)
    },
    img2_annotation: {
        type: Sequelize.STRING(255)
    },
    img3_annotation: {
        type: Sequelize.STRING(255)
    },
    img4_annotation: {
        type: Sequelize.STRING(255)
    },
    img5_annotation: {
        type: Sequelize.STRING(255)
    }

}, {
    timestamps: false,
    // indexes: [{
    //     unique: true,
    //     fields: ['farm_id'],
    //     name: 'index_farmid'
    // }]
});

module.exports = { imageProcessingResult };