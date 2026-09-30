# Policy Assessment API

A Node.js and MongoDB backend application developed as a technical assessment.

The application imports policy data from CSV/XLSX files, stores different entities in separate MongoDB collections, provides policy search and aggregation APIs, monitors CPU usage, and supports scheduled messages.

## Features

### Task 1 - Policy Management

- Upload CSV/XLSX policy data
- Import data using Node.js Worker Threads
- Store data in separate MongoDB collections
- Agent management
- User management
- User Account management
- Policy Category / LOB management
- Carrier management
- Policy management
- Search policies by username
- Aggregate policies by user

### Task 2 - System Monitoring & Scheduler

- Monitor Node.js server CPU utilization
- Detect CPU usage above 70%
- Restart the server when the CPU remains above the configured threshold
- Schedule messages using day and time
- Store scheduled messages in MongoDB
- Background scheduler checks pending messages
- Mark processed messages as completed

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- Worker Threads
- XLSX
- Multer
- PM2
- pidusage

## Project Structure

```text
policy-assessment/
│
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── workers/
│   └── ...
│
├── uploads/
├── .env
├── package.json
├── package-lock.json
├── server.js
└── README.md