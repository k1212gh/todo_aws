const express = require("express");
const pool = require("../config/db");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

// 🔹 일정 목록 조회 (admin: 모든 일정 조회, user: 팀 일정만 조회)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { role, team } = req.user;

    let query = "SELECT * FROM tasks";
    let params = [];

    if (role !== "admin") {
        query += " WHERE team = ? OR team = 'General'";
        params.push(team);
    }
      
    const [tasks] = await pool.execute(query, params);
    res.json(tasks);
  } catch (error) {
    console.error("❌ 일정 조회 오류:", error);
    res.status(500).json({ error: "서버 오류" });
  }
});

// 🔹 일정 추가 (중복 일정 방지)
router.post("/", authenticateToken, async (req, res) => {
    try {
      let { task, task_datetime, task_priority } = req.body;
      const { id: userId, username, team } = req.user;
      console.log("📌 요청 데이터:", { task, task_datetime, task_priority, userId, team });

      // ✅ task_datetime 값 검증
      if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(task_datetime)) {
        return res.status(400).json({ error: "날짜 형식이 올바르지 않습니다. (YYYY-MM-DD HH:MM:SS)" });
      }
  
      // ✅ 중복 일정 체크
      const [existing] = await pool.execute(
        "SELECT * FROM tasks WHERE task_datetime = ? AND task = ?",
        [task_datetime, task]
      );
      if (existing.length > 0) {
        return res.status(400).json({ error: "같은 날짜와 시간에 이미 등록된 일정이 있습니다." });
      }
      // ✅ 일정 추가
      await pool.execute(
        "INSERT INTO tasks (id, task, task_datetime, task_priority, created_by, team, completed) VALUES (UUID(), ?, ?, ?, ?, ?, 0)",
        [task, task_datetime, task_priority, userId, team]
      );
  
      console.log(`✅ 일정 추가됨: ${task} - ${task_datetime} (by ${username})`);
      res.json({ message: "일정 추가 완료!" });
  
    } catch (error) {
      console.error("❌ 일정 추가 오류:", error);
      res.status(500).json({ error: "서버 오류" });
    }
  });
  
  

// 🔹 일정 수정 (사용자 권한 체크 포함)
router.put("/:taskId", authenticateToken, async (req, res) => {
  try {
    const { taskId } = req.params;
    const { task, task_date, task_time, task_priority } = req.body;
    const { id, role } = req.user;

    // ✅ 일정이 존재하는지 확인
    const [existing] = await pool.execute("SELECT * FROM tasks WHERE id = ?", [taskId]);
    if (existing.length === 0) {
      return res.status(404).json({ error: "해당 일정이 존재하지 않습니다." });
    }

    // ✅ 권한 확인 (admin은 모든 일정 수정 가능, user는 본인이 작성한 일정만 수정 가능)
    if (role !== "admin" && existing[0].created_by !== id) {
      return res.status(403).json({ error: "해당 일정을 수정할 권한이 없습니다." });
    }

    // ✅ 동일한 날짜와 시간에 같은 일정이 존재하는지 확인
    const [duplicate] = await pool.execute(
      "SELECT * FROM tasks WHERE task_date = ? AND task_time = ? AND task = ? AND id != ?",
      [task_date, task_time, task, taskId]
    );

    if (duplicate.length > 0) {
      return res.status(400).json({ error: "같은 날짜와 시간에 이미 등록된 일정이 있습니다." });
    }

    // ✅ 일정 수정
    await pool.execute(
      "UPDATE tasks SET task = ?, task_date = ?, task_time = ?, task_priority = ?, updated_at = NOW() WHERE id = ?",
      [task, task_date, task_time, task_priority, taskId]
    );

    res.json({ message: "일정이 성공적으로 수정되었습니다." });
  } catch (error) {
    console.error("❌ 일정 수정 오류:", error);
    res.status(500).json({ error: "서버 오류" });
  }
});

// 🔹 일정 삭제 (사용자 권한 체크 포함)
router.delete("/:taskId", authenticateToken, async (req, res) => {
  try {
    const { taskId } = req.params;
    const { id, role } = req.user;

    // ✅ 일정이 존재하는지 확인
    const [existing] = await pool.execute("SELECT * FROM tasks WHERE id = ?", [taskId]);
    if (existing.length === 0) {
      return res.status(404).json({ error: "해당 일정이 존재하지 않습니다." });
    }

    // ✅ 권한 확인 (admin은 모든 일정 삭제 가능, user는 본인이 작성한 일정만 삭제 가능)
    if (role !== "admin" && existing[0].created_by !== id) {
      return res.status(403).json({ error: "해당 일정을 삭제할 권한이 없습니다." });
    }

    // ✅ 일정 삭제
    await pool.execute("DELETE FROM tasks WHERE id = ?", [taskId]);

    res.json({ message: "일정이 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.error("❌ 일정 삭제 오류:", error);
    res.status(500).json({ error: "서버 오류" });
  }
});

module.exports = router;
