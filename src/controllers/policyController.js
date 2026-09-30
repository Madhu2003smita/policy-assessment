const Policy = require("../models/Policy");
const User = require("../models/User");
const Lob = require("../models/Lob");
const Carrier = require("../models/Carrier");
const Agent = require("../models/Agent");

const searchPolicyByUsername = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "username query parameter is required",
      });
    }

    const policies = await Policy.find()
      .populate("userId")
      .populate("policyCategoryId")
      .populate("companyId")
      .populate("agentId");

    const searchTerm = username.trim().toLowerCase();

    const filteredPolicies = policies.filter((policy) => {
      const firstName =
        policy.userId?.firstName?.toLowerCase() || "";

      const email =
        policy.userId?.email?.toLowerCase() || "";

      return (
        firstName.includes(searchTerm) ||
        email.includes(searchTerm)
      );
    });

    return res.status(200).json({
      success: true,
      count: filteredPolicies.length,
      data: filteredPolicies,
    });
  } catch (error) {
    console.error("Policy search error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to search policies",
      error: error.message,
    });
  }
};


const getPolicyAggregationByUser = async (req, res) => {
  try {
    const result = await Policy.aggregate([
      {
        $group: {
          _id: "$userId",
          totalPolicies: {
            $sum: 1,
          },
          policies: {
            $push: {
              policyNumber: "$policyNumber",
              policyStartDate: "$policyStartDate",
              policyEndDate: "$policyEndDate",
              policyCategoryId: "$policyCategoryId",
              companyId: "$companyId",
            },
          },
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },

      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $project: {
          _id: 0,

          userId: "$_id",

          userName: "$user.firstName",

          email: "$user.email",

          totalPolicies: 1,

          policies: 1,
        },
      },

      {
        $sort: {
          totalPolicies: -1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    console.error("Policy aggregation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to aggregate policies",
      error: error.message,
    });
  }
};

module.exports = {
  searchPolicyByUsername,
  getPolicyAggregationByUser,
};