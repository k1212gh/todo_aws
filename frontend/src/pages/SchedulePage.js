import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { fetchTasks, addTask, updateTask } from "../services/api"; // 서버 API 호출
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
      const data = await fetchTasks();
      setTasks(data);
    } catch (error) {
      console.error("❌ 일정 로딩 오류:", error);
    }
  };

  // ✅ 일정 추가 버튼 클릭 시 모달 열기
  const handleAddTask = () => {
    setSelectedTask({
      id: null,
      task: "",
      task_date: "",
      task_time: "",
      task_priority: "0",
    });
    setModalVisible(true);
  };

  // ✅ 일정 추가 및 수정 처리 함수
  const handleConfirm = async (newTask) => {
    try {
        // ✅ 기존 일정 목록 가져와서 중복 체크
        const existingTasks = await fetchTasks();
        const isDuplicate = existingTasks.some(
            (t) =>
                t.task === newTask.task &&
                t.task_datetime === newTask.task_datetime &&
                t.task_priority === newTask.task_priority &&
                t.id !== newTask.id
        );

        if (isDuplicate) {
            alert("이미 같은 일정이 존재합니다!");
            return;
        }

        // ✅ 날짜와 시간 합치기
        const task_datetime = `${newTask.task_date} ${newTask.task_time}:00`;

        // ✅ 수정 모드
        if (newTask.id) {
            await updateTask(newTask.id, newTask.task, task_datetime, newTask.task_priority);
            setTasks((prevTasks) =>
                prevTasks.map((t) => (t.id === newTask.id ? { ...t, task_datetime } : t))
            );
        } 
        // ✅ 추가 모드
        else {
            const createdTask = await addTask(newTask.task, task_datetime, newTask.task_priority);
            setTasks((prevTasks) => [...prevTasks, createdTask]);
        }

        // ✅ 모달 종료
        setModalVisible(false);
        setSelectedTask(null);
    } catch (error) {
        console.error("❌ 일정 추가/수정 오류:", error);
        alert("일정을 저장하는 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <h2>📅 {user.team} 팀 일정</h2>
      <p>유저: {user.username} ({user.role})</p>
      <button onClick={() => setUser(null)}>로그아웃</button>
      {<button onClick={handleAddTask}>➕ 일정 추가</button>}
      {user.role === "admin" && <button onClick={() => navigate("/users")}>👤 사용자 관리</button>}

      <h3>🌍 General 일정</h3>
      <ul>
        {tasks.filter(task => task.team === "General").map(task => (
          <li key={task.id}>
            {task.task} - {task.task_datetime} (우선순위: {task.task_priority})
            <span> ✍ {task.created_by}</span>
          </li>
        ))}
      </ul>

      <h3>👥 {user.team} 팀 일정</h3>
      <ul>
        {tasks.filter(task => task.team === user.team).map(task => (
          <li key={task.id}>
            {task.task} - {task.task_datetime} (우선순위: {task.task_priority})
            <span> ✍ {task.created_by}</span>
          </li>
        ))}
      </ul>

      {modalVisible && (
        <InputModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          initTask={selectedTask}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
};

export default SchedulePage;
