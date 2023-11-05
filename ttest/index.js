const mysql = require("mysql2");
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const YAML = require("yaml");
const file = fs.readFileSync("./swagger.yaml", "utf8");
const swaggerDocument = YAML.parse(file);
const cors = require("cors");

// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "mydb_test",
// });
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "MYSQL_ROOT_PASSWORD",
  database: "L9Ddb",
  port: 3306
});
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// const port = 3000;
const port = 3306;

app.get("/attractions", (req, res) => {
  connection.query("SELECT * FROM attractions", function (err, results) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(results);
    }
  });
});

app.post("/attractions", (req, res) => {
  const { name, detail, coverimage, latitude, longitude } = req.body;
  console.log(name, detail, coverimage, latitude, longitude);
  connection.query(
    "INSERT INTO attractions (name, detail, coverimage, latitude, longitude) VALUES (?,?,?,?,?)",
    [name, detail, coverimage, latitude, longitude],
    function (err, results) {
      res.json(results);
    }
  );
});

app.put("/attractions", (req, res) => {
    const { id, name, detail, coverimage, latitude, longitude } = req.body;
    connection.query(
      "UPDATE attractions SET name=?, detail=?, coverimage=?, latitude=?, longitude=? WHERE attractions.id = ?",
      [name, detail, coverimage, latitude, longitude,id],
      function (err, results) {
        res.json(results);
      }
    );
  });

app.get("/attractions/:id", (req, res) => {
  const id = req.params.id;
  connection.query(
    "SELECT * FROM attractions WHERE id = ?",
    [id],
    function (err, results) {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
      } else if (results.length === 0) {
        res.status(404).json({ status: "not found" });
      } else {
        res.json(results[0]);
      }
    }
  );
});


app.delete("/attractions/:id", (req, res) => {
    const id = req.params.id;
    connection.query(
      "DELETE FROM attractions WHERE attractions.id = ?",
      [id],
      function (err, results) {
        res.json(results);
      }
    );
  });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
