import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { fetchUsers, registerUser, deleteUser } from "../services/api";
import { useNavigate } from "react-router-dom";

const UserManagement = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/"); // ✅ 비관리자는 접근 금지
    } else {
      loadUsers();
    }
  }, [user]);

  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error("❌ 사용자 목록 로딩 오류:", error);
    }
  };

  return (
    <div>
      <h2>👤 사용자 관리</h2>
      <button onClick={() => navigate("/")}>⬅ 일정 페이지로 이동</button>
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.username} ({u.role}) - {u.team}
            {user.role === "admin" && <button onClick={() => deleteUser(user.username, u.id)}>🗑 삭제</button>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManagement;
