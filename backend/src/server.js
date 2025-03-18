require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const tasksRoutes = require("./routes/tasksRoutes"); // ✅ 일정 관리 라우트 추가

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api/tasks", tasksRoutes); // ✅ 일정 API 추가

app.listen(3001, () => console.log("✅ 서버 실행 중 (포트 3001)"));
