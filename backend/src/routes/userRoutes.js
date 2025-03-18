const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../config/db");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

// 🔹 사용자 등록 (관리자만 가능)
router.post("/register", authenticateToken, async (req, res) => {
  const { newUsername, newPassword, role, team } = req.body;

  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "관리자만 사용자 등록이 가능합니다." });
  }

  try {
    // 🔹 중복 username 확인
    const [existingUser] = await pool.execute("SELECT * FROM users WHERE username = ?", [newUsername]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: "이미 존재하는 사용자입니다." });
    }

    // 🔹 비밀번호 해싱 (bcrypt 사용)
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 🔹 새 사용자 등록
    await pool.execute(
      "INSERT INTO users (id, username, password, role, team) VALUES (UUID(), ?, ?, ?, ?)",
      [newUsername, hashedPassword, role, team]
    );

    res.json({ message: "사용자 등록 완료!" });
  } catch (error) {
    console.error("❌ 사용자 등록 오류:", error);
    res.status(500).json({ error: "서버 오류" });
  }
});

module.exports = router;
