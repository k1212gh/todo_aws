const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: "44.204.8.221",  // AWS 서버 IP
  user: "KevDev",
  password: "!Kevin8578",
  database: "todo_app",  // ✅ todo_app 데이터베이스 사용
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
