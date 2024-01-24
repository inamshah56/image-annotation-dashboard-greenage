const express = require("express");
const dashboard = require("./../controllers/dashboard");
const router = express.Router();

router
  .route("/crop-condition")
  .get(dashboard.getCropCondition)
  .post(dashboard.addCropCondition)
  .delete(dashboard.deleteCropCondition);

  router
  .route("/crop-prevention")
  .get(dashboard.getCropPrevention)
  .post(dashboard.addCropPrevention)
  .patch(dashboard.updateCropPrevention)
  .delete(dashboard.deleteCropPrevention);

  router
  .route("/image-processing-result")
  .get(dashboard.getImageProcessingResult)
  .patch(dashboard.submitImageProcessingResult);

router
  .route("/image-processing-history")
  .get(dashboard.getImageProcessingHistory);

module.exports = router;
