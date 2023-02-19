const express = require("express");
const app = express();

const path = require("path");
const dbPath = path.join(__dirname, "todoApplication.db");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

let db = null;
app.use(express.json());

const initializeDbAndServer = async () => {
  try {
    db = await open({ filename: dbPath, driver: sqlite3.Database });
    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000/");
    });
  } catch (e) {
    console.log("Db Error:${e.message}");
  }
};
initializeDbAndServer();
//api1

const hasPropertyAndStatus = (requestQuery) => {
  return (
    requestQuery.property !== undefined && requestQuery.status !== undefined
  );
};
const hasProperty = (requestQuery) => {
  return requestQuery.property !== undefined;
};
const hasStatus = (requestQuery) => {
  return requestQuery.status !== undefined;
};
app.get("/todos/", async (request, Response) => {
  let dataBase = null;
  let todoQuery = "";
  const { search_q, property, status } = request.query;
  switch (true) {
    case hasPropertyAndStatus(request.query):
      todoQuery = `SELECT * FROM todo WHERE todo LIKE '%{search_q}%'
            AND status='${status}' AND property='${property}';`;
      break;
    case hasProperty(request.query):
      todoQuery = `SELECT * FROM todo WHERE todo LIKE '%{search_q}%' AND property='${property}';`;
      break;
    case hasStatus(request.query):
      todoQuery = `SELECT * FROM todo WHERE todo LIKE '%{search_q}%' AND status='${status}';`;
      break;
    default:
      todoQuery = `SELECT * FROM todo WHERE todo LIKE '%{search_q}%';`;

      dataBase = await db.all(todoQuery);
      response.send(dataBase);
  }
});
module.exports = app;
