import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { registerUser } from "../services/api";

const AdminRegister = () => {
  const { user } = useContext(AuthContext);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [role, setRole] = useState("user"); // ✅ 올바르게 상태 정의
  const [team, setTeam] = useState("");
  const [error, setError] = useState(""); // ✅ 에러 메시지 상태 추가

  const handleRegister = async () => {
    try {
      // 🚨 팀이 선택되지 않았을 경우 에러 메시지 출력
      if (!newUsername || !newPassword || !team) {
        setError("❌ 모든 필드를 입력해주세요.");
        return;
      }
      setError(""); // 에러 초기화

      await registerUser(user.username, newUsername, newPassword, role, team);
      alert(`${newUsername} (${role}) 계정이 생성되었습니다.`);
      setNewUsername("");
      setNewPassword("");
      setRole("user");
      setTeam("");
    } catch (error) {
      console.error("❌ 관리자 계정 생성 오류:", error);
      setError(error.message || "❌ 관리자 계정 생성 실패");
    }
  };

  return (
    <div>
      <h2>🔐 계정 생성</h2>
      {error && <p style={{ color: "red" }}>{error}</p>} {/* ✅ 에러 메시지 표시 */}

      <input
        type="text"
        placeholder="새로운 user ID"
        value={newUsername}
        onChange={(e) => setNewUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      {/* ✅ 역할 선택 */}
      <select name="role" value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="user">일반 사용자</option>
        <option value="admin">관리자</option>
      </select>

      {/* ✅ 팀 선택 */}
      <select name="team" value={team} onChange={(e) => setTeam(e.target.value)}>
        <option value="">-- 팀을 선택하세요 --</option>
        <option value="Engineering">Engineering</option>
        <option value="HRD">Human Resources Department</option>
        <option value="Marketing">Marketing</option>
      </select>

      <button onClick={handleRegister}>계정 생성</button>
    </div>
  );
};

export default AdminRegister;
