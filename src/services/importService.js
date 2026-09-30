const path = require("path");
const { Worker } = require("worker_threads");

const startImportWorker = (filePath) => {
  return new Promise((resolve, reject) => {
    const workerPath = path.resolve(
      __dirname,
      "../workers/importWorker.js"
    );

    const worker = new Worker(workerPath, {
      workerData: {
        filePath,
        mongoUri: process.env.MONGO_URI,
      },
    });

    worker.on("message", (result) => {
      console.log("Worker result:", result);

      if (result.success) {
        console.log(
          `Import completed: ${result.rowsProcessed} rows, ${result.policiesImported} policies`
        );

        resolve(result);
      } else {
        console.error("Worker import failed:", result.error);
        reject(new Error(result.error));
      }
    });

    worker.on("error", (error) => {
      console.error("Worker error:", error);
      reject(error);
    });

    worker.on("exit", (code) => {
      console.log("Worker exited with code:", code);

      if (code !== 0) {
        reject(
          new Error(`Worker stopped with exit code ${code}`)
        );
      }
    });
  });
};

module.exports = {
  startImportWorker,
};