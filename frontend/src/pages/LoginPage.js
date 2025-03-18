import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { login } from "../services/api";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate(); // ✅ 라우터 네비게이션 추가

  const handleLogin = async () => {
    try {
      const data = await login(username, password);
      if (data) {
        setUser({ id: data.id, username: data.username, role: data.role, team: data.team });
        navigate("/"); // ✅ 로그인 성공 시 메인 페이지로 이동
      } else {
        alert("로그인 실패");
      }
    } catch (error) {
      console.error("❌ 로그인 오류:", error);
    }
  };

  return (
    <div>
      <h2>로그인</h2>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="아이디 입력" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호 입력" />
      <button onClick={handleLogin}>로그인</button>
    </div>
  );
};

export default LoginPage;
