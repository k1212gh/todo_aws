import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { registerUser } from "../services/api";

const RegisterPage = () => {
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [role, setRole] = useState("user");
  const [team, setTeam] = useState("General");
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  const handleRegister = async () => {
    try {
      const response = await registerUser(user.username, newUsername, newPassword, role, team);
      alert("✅ 사용자 등록 완료!");
      setNewUsername("");
      setNewPassword("");
    } catch (error) {
      console.error("❌ 사용자 등록 오류:", error);
      setError(error.message); // 에러 메시지를 상태에 저장
    }
  };

  return (
    <div>
      <h2>사용자 등록</h2>
      {error && <p style={{ color: "red" }}>{error}</p>} {/* 에러 메시지 표시 */}

      <input
        type="text"
        placeholder="새 사용자 이름"
        value={newUsername}
        onChange={(e) => setNewUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="user">일반 사용자</option>
        <option value="admin">관리자</option>
      </select>
      <select value={team} onChange={(e) => setTeam(e.target.value)}>
        <option value="General">General</option>
        <option value="Engineering">Engineering</option>
        <option value="Marketing">Marketing</option>
      </select>

      <button onClick={handleRegister}>사용자 등록</button>
    </div>
  );
};

export default RegisterPage;
