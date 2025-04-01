const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: "",  // AWS 서버 IP
  user: "",
  password: "",
  database: "",  // ✅ todo_app 데이터베이스 사용
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
