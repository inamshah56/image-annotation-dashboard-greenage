const { validationError } = require("../utils/validationError");
const { cropCondition } = require("./../models/cropConditions");
const { imageProcessingResult } = require("./../models/imageProcessingResults");
const { Op } = require("sequelize");
const dF = require("./../utils/dashboardFunctions");
const { CropPrevention } = require("../models/cropPreventions");
const Sequelize = require("sequelize");

////////////////////////////////~////////////////////////////////////
exports.getCropCondition = async (req, res) => {
  let { cropname } = req.query;
  if (!cropname) {
    return res
      .status(400)
      .send({ success: false, message: "Cropname is required" });
  }
  cropname = cropname?.toLowerCase();
  try {
    if (cropname in ["", " ", null]) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid cropname" });
    }
    const cropConditions = await cropCondition.findAll({
      attributes: { exclude: ["id"] },
      where: { cropname: cropname },
    });
    return res.send(cropConditions);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || " Internal Server Error",
    });
  }
};

// ################################################################
exports.addCropCondition = async (req, res) => {
  const { body } = req;
  try {
    for (key in body) {
      body[key] = body[key].toLowerCase();
    }
    await cropCondition.create(body);
    res
      .status(201)
      .send({ success: true, message: "Crop condition added successfully" });
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      const errors = validationError(err);
      if (errors) {
        return res.status(400).send({ success: false, errors });
      }
    } else if (err.name === "SequelizeUniqueConstraintError") {
      const errors = validationError(err);
      if (errors) {
        return res.status(400).send({ success: false, errors });
      }
    } else {
      res.status(500).json({
        success: false,
        message: err.message || " Internal Server Error",
      });
    }
  }
};

////////////////////////////////////////////////////////////////
exports.deleteCropCondition = async (req, res) => {
  let { cropname, condition } = req.query;
  cropname = cropname.toLowerCase();
  condition = condition.toLowerCase();
  try {
    if (!cropname || !condition) {
      return res
        .status(400)
        .json({ success: false, message: "cropname or condition is empty." });
    }
    await cropCondition.destroy({
      where: {
        [Op.and]: [{ cropname }, { condition }],
      },
    });
    return res
      .status(200)
      .json({ success: true, message: "record deleted successfully." });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || " Internal Server Error",
    });
  }
};

// ################################################################
// ################################################################
exports.getCropPrevention = async (req, res) => {
  let { condition } = req.query;
  if (!condition) {
    return res
      .status(400)
      .json({ success: false, message: "Condition is required" });
  }
  condition = condition?.toLowerCase();
  try {
    const cropPrevention = await CropPrevention.findAll({
      where: { condition },
    });
    return res.json(cropPrevention);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || " Internal Server Error",
    });
  }
};

// ################################################################
exports.addCropPrevention = async (req, res) => {
  let { body } = req;

  if (!body.condition) {
    return res.status(400).send({
      success: false,
      message: "Condition is required",
    });
  }

  if (!body.formula) {
    return res.status(400).send({
      success: false,
      message: "Formula is required",
    });
  }

  body = {
    ...body,
    condition: body.condition.toLowerCase(),
    severity: body.severity?.toLowerCase() || "general",
  };

  try {
    await CropPrevention.create(body);
    res.status(200).json({
      success: true,
      message: "Crop Prevention added successfully",
    });
  } catch (err) {
    if (err.name == "SequelizeUniqueConstraintError") {
      res.status(400).json({
        success: false,
        message: "Same condition can not be added twice with same severity",
      });
    } else {
      res.status(500).json({
        success: false,
        message: err.message || " Internal Server Error",
      });
    }
  }
};

// ################################################################
exports.updateCropPrevention = async (req, res) => {
  let { body } = req;
  const { id } = body;

  if (!id) {
    return res.status(400).send({
      success: false,
      message: "Id is required",
    });
  }

  if (!body.condition) {
    return res.status(400).send({
      success: false,
      message: "Condition is required",
    });
  }

  if (!body.formula) {
    return res.status(400).send({
      success: false,
      message: "Formula is required",
    });
  }

  body = {
    ...body,
    condition: body.condition.toLowerCase(),
    severity: body.severity?.toLowerCase() || "general",
  };

  const record = await CropPrevention.findByPk(id);
  if (!record) {
    return res.status(404).json({
      message: `Cannot find the record against the requested id : "${id}".`,
    });
  }
  try {
    await CropPrevention.update(body, {
      where: {
        id,
      },
    });
    return res.status(200).json({
      success: true,
      message: "Crop Prevention Updated Successfully",
    });
  } catch (err) {
    if (err.name == "SequelizeUniqueConstraintError") {
      res.status(400).json({
        success: false,
        message: "Same condition can not be added twice with same severity",
      });
    } else {
      res.status(500).json({
        success: false,
        message: err.message || " Internal Server Error",
      });
    }
  }
};

// ################################################################
exports.deleteCropPrevention = async (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ success: false, message: "id is required" });
  }
  const record = await CropPrevention.findByPk(id);
  if (!record) {
    return res.status(404).json({
      message: `Cannot find the record against the requested id : "${id}".`,
    });
  }
  try {
    await CropPrevention.destroy({
      where: { id },
    });
    return res.status(200).json("record deleted successfully");
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || " Internal Server Error",
    });
  }
};

// ################################################################
// ################################################################

////////////////////////////////////////////////////////////////
exports.getImageProcessingResult = async (req, res) => {
  let { img_name, img_date } = req.query;
  try {
    if (!img_name) {
      return res.status(400).json({
        success: false,
        message: { img_name: "Image name is required" },
      });
    }
    const crop = img_name.split("_")[1];
    const farm_id = Number(img_name.split("_")[0]);
    img_name = `/static/${crop}/${img_name}`;
    if (img_date) {
      const data = await imageProcessingResult.findOne({
        where: {
          [Op.and]: [{ farm_id }, { img_date }],
        },
      });
      if (!data) {
        return res
          .status(404)
          .send({ success: false, message: "Image not exist." });
      }

      if (data.dataValues.annotated === true) {
        return res
          .status(409)
          .json({ success: true, message: "All images are annotated" });
      }

      const prevAnnotation = dF.getPreviousAnnotations(data.dataValues);
      const response = prevAnnotation;
      // Now we are finding the image column in data using the img name.
      const img_column = dF.getImageColumn(data, img_name);
      response["img_column"] = `${img_column}_annotation`;

      if (response["img_column"] in prevAnnotation) {
        return res
          .status(409)
          .json({ success: true, message: "Image Already Annotated" });
      }

      const count = prevAnnotation.count;
      if (count == 4) {
        response["overall_result"] = true;
      } else {
        response["overall_result"] = false;
      }
      response["id"] = data.dataValues.id;
      return res.send(response);
    }

    // if img_date is not specified then this query will run but time complexity is more
    else {
      const data = await imageProcessingResult.findOne({
        where: {
          [Op.and]: [
            { farm_id },
            {
              [Op.or]: [
                { img1: img_name },
                { img2: img_name },
                { img3: img_name },
                { img4: img_name },
                { img5: img_name },
              ],
            },
          ],
        },
      });

      if (!data) {
        return res
          .status(404)
          .send({ success: false, message: "Image not exist." });
      }

      if (data.dataValues.annotated === true) {
        return res
          .status(409)
          .json({ success: true, message: "All images are annotated" });
      }

      const prevAnnotation = dF.getPreviousAnnotations(data.dataValues);
      const response = prevAnnotation;
      const img_column = dF.getImageColumn(data, img_name);
      response["img_column"] = `${img_column}_annotation`;

      if (response["img_column"] in prevAnnotation) {
        return res
          .status(409)
          .json({ success: true, message: "Image Already Annotated" });
      }

      const count = prevAnnotation.count;
      if (count == 4) {
        response["overall_result"] = true;
      } else {
        response["overall_result"] = false;
      }
      response["id"] = data.dataValues.id;
      return res.send(response);
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || " Internal Server Error",
    });
  }
};

/////////////////////////////////////////////////////////////////
exports.submitImageProcessingResult = async (req, res) => {
  let { id, img_column, annotated, result, overall_result } = req.body;

  try {
    if (!id) {
      return res
        .status(400)
        .send({ success: false, message: { id: "id is required" } });
    }
    if (!img_column) {
      return res.status(400).send({
        success: false,
        message: { img_column: "img_column is required" },
      });
    }
    if (annotated === undefined) {
      return res.status(400).send({
        success: false,
        message: { annotated: "annotated is required" },
      });
    }
    if (!result) {
      return res
        .status(400)
        .send({ success: false, message: { result: "result is required" } });
    }
    result = result.toLowerCase();
    if (annotated && !overall_result) {
      return res.status(400).send({
        success: false,
        message: { overall_result: "overall_result is required" },
      });
    }
    if (annotated) {
      overall_result = overall_result.toLowerCase();
      await imageProcessingResult.update(
        {
          [img_column]: result,
          annotated: true,
          average_prediction: overall_result,
        },
        {
          where: {
            id,
          },
        }
      );
    } else {
      await imageProcessingResult.update(
        { [img_column]: result },
        {
          where: {
            id,
          },
        }
      );
    }
    return res.status(200).json({
      success: true,
      message: "Annotation Result Updated Successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || " Internal Server Error",
    });
  }
};

// ################################################################
exports.getImageProcessingHistory = async (req, res) => {
  const { farmId } = req.query;
  try {
    if (!farmId) {
      return res
        .status(400)
        .json({ success: false, message: "farmId is required." });
    }
    const data = await imageProcessingResult.findAll({
      attributes: ["average_prediction", "img_date"],
      where: {
        [Op.and]: [{ farm_id: farmId }, { annotated: true }],
      },
      order: [["img_date", "DESC"]],
      limit: 45,
    });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || " Internal Server Error",
    });
  }
};
