const express = require("express");
const network = require("network");
const router = require("./routes/route");
const { sequelize, sequelize2 } = require("./utils/db");

const app = express();
const cors = require("cors");
const port = 8093;

// JSON Middleware for req body
app.use(express.json());
app.use(cors());

// DB Connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("----- Connection established successfully DB1 -----");
    await sequelize.sync();
    console.log("----- All models were synchronized successfully -----");
    await sequelize2.authenticate();
    console.log("----- Connection established successfully DB2 -----");
    await sequelize2.sync();
    console.log("----- All models were synchronized successfully -----");
  } catch (err) {
    console.error("----- Unable to connect to the database -----", err);
  }
};

connectDB();

// Get local IP address
const getLocalIpAddress = () => {
  return new Promise((resolve, reject) => {
    network.get_private_ip((err, ip) => {
      if (err) {
        reject(err);
      } else {
        resolve(ip);
      }
    });
  });
};

app.get("/", (req, res) => {
  res.send({ message: "Welcome to the image annotation dashboard" });
});

app.use("/", router);

const startServer = async () => {
  try {
    const ipAddress = await getLocalIpAddress();
    app.listen(port, () =>
      console.log(`Server running on http://${ipAddress}:${port}`)
    );
  } catch (error) {
    console.error("Error:", error.message);
  }
};

startServer();
