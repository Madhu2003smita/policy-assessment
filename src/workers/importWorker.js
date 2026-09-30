const { parentPort, workerData } = require("worker_threads");
const XLSX = require("xlsx");
const mongoose = require("mongoose");

const Agent = require("../models/Agent");
const User = require("../models/User");
const UserAccount = require("../models/UserAccount");
const Lob = require("../models/Lob");
const Carrier = require("../models/Carrier");
const Policy = require("../models/Policy");

const connectDB = async () => {
  await mongoose.connect(workerData.mongoUri);
};

const clean = (value) => {
  if (value === undefined || value === null) {
    return null;
  }

  const stringValue = String(value).trim();

  return stringValue === "" ? null : stringValue;
};

const toDate = (value) => {
  const cleaned = clean(value);

  if (!cleaned) {
    return null;
  }

  const date = new Date(cleaned);

  return Number.isNaN(date.getTime()) ? null : date;
};

const toNumber = (value) => {
  const cleaned = clean(value);

  if (!cleaned) {
    return null;
  }

  const number = Number(cleaned);

  return Number.isNaN(number) ? null : number;
};

const importData = async () => {
  try {
    await connectDB();

    console.log("Worker: MongoDB connected");

    const workbook = XLSX.readFile(workerData.filePath, {
      cellDates: true,
    });

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(worksheet, {
      defval: null,
    });

    console.log(`Worker: ${rows.length} rows found`);

    let importedPolicies = 0;

    for (const row of rows) {
      /*
       * 1. Agent
       */
      let agent = null;

      if (clean(row.agent)) {
        agent = await Agent.findOneAndUpdate(
          {
            agentName: clean(row.agent),
          },
          {
            $setOnInsert: {
              agentName: clean(row.agent),
            },
          },
          {
             returnDocument: "after",
            upsert: true,
          }
        );
      }

      /*
       * 2. User Account
       */
      let account = null;

      if (clean(row.account_name)) {
        account = await UserAccount.findOneAndUpdate(
          {
            accountName: clean(row.account_name),
          },
          {
            $set: {
              accountName: clean(row.account_name),
              accountType: clean(row.account_type),
            },
          },
          {
             returnDocument: "after",
            upsert: true,
          }
        );
      }

      /*
       * 3. User
       */
      let user = null;

      if (clean(row.email)) {
        user = await User.findOneAndUpdate(
          {
            email: clean(row.email).toLowerCase(),
          },
          {
            $set: {
              firstName: clean(row.firstname),
              dob: toDate(row.dob),
              address: clean(row.address),
              phoneNumber: clean(row.phone),
              state: clean(row.state),
              zipCode: clean(row.zip),
              email: clean(row.email).toLowerCase(),
              gender: clean(row.gender),
              userType: clean(row.userType),
              accountId: account?._id || null,
              agentId: agent?._id || null,
            },
          },
          {
             returnDocument: "after",
            upsert: true,
          }
        );
      }

      /*
       * 4. LOB
       */
      let lob = null;

      if (clean(row.category_name)) {
        lob = await Lob.findOneAndUpdate(
          {
            categoryName: clean(row.category_name),
          },
          {
            $setOnInsert: {
              categoryName: clean(row.category_name),
            },
          },
          {
             returnDocument: "after",
            upsert: true,
          }
        );
      }

      /*
       * 5. Carrier
       */
      let carrier = null;

      if (clean(row.company_name)) {
        carrier = await Carrier.findOneAndUpdate(
          {
            companyName: clean(row.company_name),
          },
          {
            $setOnInsert: {
              companyName: clean(row.company_name),
            },
          },
          {
             returnDocument: "after",
            upsert: true,
          }
        );
      }

      /*
       * 6. Policy
       */
      if (clean(row.policy_number) && user) {
        await Policy.findOneAndUpdate(
          {
            policyNumber: clean(row.policy_number),
          },
          {
            $set: {
              policyNumber: clean(row.policy_number),

              policyStartDate: toDate(row.policy_start_date),

              policyEndDate: toDate(row.policy_end_date),

              policyCategoryId: lob?._id || null,

              companyId: carrier?._id || null,

              userId: user._id,

              agentId: agent?._id || null,

              premiumAmount: toNumber(row.premium_amount),

              premiumAmountWritten: toNumber(
                row.premium_amount_written
              ),

              policyType: clean(row.policy_type),

              policyMode: toNumber(row.policy_mode),

              producer: clean(row.producer),

              csr: clean(row.csr),
            },
          },
          {
            upsert: true,
          }
        );

        importedPolicies++;
      }
    }

    await mongoose.disconnect();

    console.log(
  `Worker: Import completed. Policies imported: ${importedPolicies}`
);

    parentPort.postMessage({
      success: true,
      rowsProcessed: rows.length,
      policiesImported: importedPolicies,
    });
  } catch (error) {
    console.error("Worker error:", error);

    try {
      await mongoose.disconnect();
    } catch (disconnectError) {
      // Ignore disconnect errors
    }

    parentPort.postMessage({
      success: false,
      error: error.message,
    });
  }
};

importData();