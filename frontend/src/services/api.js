const API_URL = process.env.REACT_APP_API_URL;

// ✅ JWT 토큰을 포함하는 요청 헤더 생성
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` } : { "Content-Type": "application/json" };
};

// ✅ 로그인
export const login = async (username, password) => {
  const response = await fetch(`${API_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) throw new Error("로그인 실패");
  const data = await response.json();
  localStorage.setItem("token", data.token); // ✅ JWT 토큰 저장
  return data;
};

// ✅ 사용자 목록 조회 (관리자만 가능)
export const fetchUsers = async () => {
  const response = await fetch(`${API_URL}/api/users`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) throw new Error("사용자 목록 불러오기 실패");
  return response.json();
};

// ✅ 사용자 등록 (관리자만 가능)
export const registerUser = async (newUsername, newPassword, role, team) => {
  const response = await fetch(`${API_URL}/api/register`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ newUsername, newPassword, role, team }),
  });

  if (!response.ok) throw new Error("사용자 등록 실패");
  return response.json();
};
// ✅ 사용자 삭제
export const deleteUser = async (userId) => {
  const response = await fetch(`${API_URL}/api/users/${userId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) throw new Error("사용자 삭제 실패");
  return response.json();
};

// ✅ 일정 목록 조회 (JWT 인증 필수)
export const fetchTasks = async () => {
  const response = await fetch(`${API_URL}/api/tasks`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) throw new Error("일정 불러오기 실패");
  return response.json();
};

// ✅ 일정 추가
export const addTask = async (task, task_datetime, task_priority,) => {
  const response = await fetch(`${API_URL}/api/tasks`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ task, task_datetime, task_priority }),
  });

  if (!response.ok) throw new Error("일정 추가 실패");
  return response.json();
};

// ✅ 일정 수정
export const updateTask = async (taskId, task, task_datetime, task_priority) => {
  const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ task, task_datetime, task_priority }),
  });

  if (!response.ok) throw new Error("일정 수정 실패");
  return response.json();
};

// ✅ 일정 삭제
export const deleteTask = async (taskId) => {
  const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) throw new Error("일정 삭제 실패");
  return response.json();
};
