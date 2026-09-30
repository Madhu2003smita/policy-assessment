const express = require("express");

const {
  searchPolicyByUsername,
  getPolicyAggregationByUser,
} = require("../controllers/policyController");

const router = express.Router();

router.get("/search", searchPolicyByUsername);
router.get("/aggregate", getPolicyAggregationByUser);

module.exports = router;