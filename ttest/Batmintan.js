const mysql = require("mysql2");
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const YAML = require("yaml");
const file = fs.readFileSync("./swagger.yaml", "utf8");
const swaggerDocument = YAML.parse(file);
const cors = require("cors");

const connection1 = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "MYSQL_ROOT_PASSWORD",
  database: "L9Ddb",
  port: 8800,
  connectTimeout: 20000
});
const connection2 = mysql.createConnection({
  host: "localhost",
  user: "admin",
  password: "1234",
  database: "L9Ddb",
  port: 8800,
  connectTimeout: 20000
});

connection1.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.message);
    // Implement error handling or retry logic here
  } else {
    console.log("Connected to the database");
    // Start your Express app here
  }
});

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
app.get("/", (req, res) => {
  res.send({msg : "hi bro"})
});

// COURT//
app.get("/court/getAll", (req, res) => {
  connection1.query("SELECT * FROM courts", function (err, results) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(results);
    }
  });
});

app.get("/court/:id", (req, res) => {
  const id = req.params.id;
  connection1.query(
    "SELECT * FROM courts WHERE id = ?",
    [id],
    function (err, results) {
      if(results.length > 0) {
        res.json(results[0]);
      }else{
        res.json({'status' : 'notfound'})
      }
      // if (err) {
      //   console.error(err);
      //   res.status(500).json({ error: "Internal Server Error" });
      // } else if (results.length === 0) {
      //   res.status(404).json({ status: "not found" });
      // } else {
      //   res.json(results[0]);
      // }
    }
  );
});

app.post("/court/update/:id", (req, res) => {
  const { id, name } = req.body;
  connection2.query(
    "UPDATE courts SET name=? WHERE id = ?",
    [name, id],
    function (err, results) {
      res.json(results);
    }
  );
});
app.post("/court/delete/:id", (req, res) => {
  const id = req.params.id;
  connection2.query(
    "DELETE FROM courts WHERE id = ?",
    [id],
    function (err, results) {
      res.json(results);
    }
  );
});
app.post("/court/put", (req, res) => {
  const { name } = req.body;
  connection2.query(
    "INSERT INTO courts (name) VALUES (?)",
    [name],
    function (err, results) {
      res.json(results);
    }
  );
});
// OTP//
app.get("/otp/getAll", (req, res) => {
  connection2.query("SELECT * FROM o_t_p_s", function (err, results) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(results);
    }
  });
});
app.get("/otp/:id", (req, res) => {
  const id = req.params.id;
  connection1.query(
    "SELECT * FROM o_t_p_s WHERE id = ?",
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
app.post("/otp/update/:id", (req, res) => {
  const { id, rid, QR, expire } = req.body;
  connection2.query(
    "UPDATE o_t_p_s SET rid=?, QR=?, expire=? WHERE id = ?",
    [rid, QR, expire, id],
    function (err, results) {
      res.json(results);
    }
  );
});
app.post("/otp/delete/:id", (req, res) => {
  const id = req.params.id;
  connection2.query(
    "DELETE FROM o_t_p_s WHERE id = ?",
    [id],
    function (err, results) {
      res.json(results);
    }
  );
});
app.post("/otp/put", (req, res) => {
  const { rid, QR, expire } = req.body;
  connection2.query(
    "INSERT INTO o_t_p_s (rid, QR, expire) VALUES (?,?,?)",
    [rid, QR, expire],
    function (err, results) {
      res.json(results);
    }
  );
});
//reserved
app.get("/reserved/getAll", (req, res) => {
  connection2.query("SELECT * FROM reserveds", function (err, results) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(results);
    }
  });
});
app.get("/reserved/get/:id", (req, res) => {
  const id = req.params.id;
  connection2.query(
    "SELECT * FROM reserveds WHERE id = ?",
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
app.post("/reserved/update/:id", (req, res) => {
  const { id, cid, start, end, genaratedKey } = req.body;
  connection2.query(
    "UPDATE reserveds SET cid =?, start=?, end=?, genaratedKey=? WHERE id = ?",
    [cid, start, end, genaratedKey, id],
    function (err, results) {
      res.json(results);
    }
  );
});
app.post("/reserved/delete/:id", (req, res) => {
  const id = req.params.id;
  connection2.query(
    "DELETE FROM reserveds WHERE id = ?",
    [id],
    function (err, results) {
      res.json(results);
    }
  );
});
app.post("/reserved/put", (req, res) => {
  const { name, detail, coverimage, latitude, longitude } = req.body;
  connection2.query(
    "INSERT INTO reserveds (name, detail, coverimage, latitude, longitude) VALUES (?,?,?,?,?)",
    [name, detail, coverimage, latitude, longitude],
    function (err, results) {
      res.json(results);
    }
  );
});
