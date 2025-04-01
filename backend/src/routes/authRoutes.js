const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../config/db");
const jwt = require("jsonwebtoken");

const router = express.Router();

// 🔹 로그인 API (JWT 토큰 포함)
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const [users] = await pool.execute("SELECT * FROM users WHERE username = ?", [username]);

    if (users.length === 0) {
      return res.status(401).json({ error: "사용자를 찾을 수 없습니다." });
    }

    const user = users[0];

    // 🔹 비밀번호 검증 (bcrypt 사용)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(409).json({ error: "비밀번호가 틀립니다." });
      
    }

    // 🔹 JWT 토큰 생성 (사용자 ID, 역할, 팀 포함)
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role, team: user.team },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );

    res.json({ token, id: user.id, username: user.username, role: user.role, team: user.team });
  } catch (error) {
    console.error("❌ 로그인 오류:", error);
    res.status(500).json({ error: "서버 오류" });
  }
});

module.exports = router;
