import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { fetchTasks, addTask } from "../services/api";
import InputModal from "../components/organisms/InputModal";

const SchedulePage = () => {
  const { user, setUser } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) loadTasks();
  }, [user]);

  const loadTasks = async () => {
    try {
      const data = await fetchTasks(user.username);
      setTasks(data);
    } catch (error) {
      console.error("❌ 일정 로딩 오류:", error);
    }
  };

  const handleAddTask = () => {
    setSelectedTask({
      task: "",
      task_date: "",
      task_time: "",
      task_priority: "0",
    });
    setModalVisible(true);
  };

  const handleConfirmTask = async (newTask) => {
    try {
      await addTask(user.username, newTask.task, newTask.task_date, newTask.task_time, newTask.task_priority);
      setModalVisible(false);
      loadTasks();
    } catch (error) {
      console.error("❌ 일정 추가 오류:", error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };

  return (
    <div>
      <h2>📅 {user.team} 팀 일정</h2>
      <p>로그인: {user.username} ({user.role})</p>
      <button onClick={handleLogout}>로그아웃</button>
      {user.role === "admin" && <button onClick={handleAddTask}>➕ 일정 추가</button>}
      {user.role === "admin" && <button onClick={() => navigate("/users")}>👤 사용자 관리</button>}

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.task} - {task.task_date} {task.task_time} (우선순위: {task.task_priority})
            <span> ✍ {task.created_by}</span>
          </li>
        ))}
      </ul>

      {modalVisible && (
        <InputModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          initTask={selectedTask}
          onConfirm={handleConfirmTask}
        />
      )}
    </div>
  );
};

export default SchedulePage;
