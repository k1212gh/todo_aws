import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import Select from "../atoms/Select";

// 스타일 정의
const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  z-index: 999;
`;

const Container = styled.div`
  background-color: #ffffff;
  width: 350px;
  height: 320px;
  border-radius: 15px;
  padding: 20px;
  position: fixed;
  z-index: 1000;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16),
              0 3px 6px rgba(0, 0, 0, 0.23);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const InputModal = ({ visible, onClose, initTask, onConfirm }) => {
  const [task, setTask] = useState(initTask);

  useEffect(() => {
    setTask(initTask);
  }, [initTask]);

  if (!visible) return null;

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  // 확인 버튼 클릭 시 실행
  const handleConfirmClick = () => {
    if (!task.task || !task.task_date || !task.task_time || task.task_priority === "0") {
      alert("모든 필드를 입력해주세요.");
      return;
    }
    onConfirm(task);
  };

  return (
    <>
      <Backdrop onClick={onClose} />
      <Container>
        <h3>{task.id ? "일정 수정" : "일정 추가"}</h3>

        <Input type="text" name="task" placeholder="할 일을 입력하세요" value={task.task} onChange={handleChange} />
        <Input type="date" name="task_date" value={task.task_date} onChange={handleChange} />
        <Input type="time" name="task_time" value={task.task_time} onChange={handleChange} />

        <Select name="task_priority" value={task.task_priority} onChange={handleChange}>
          <option value="0">중요도 선택</option>
          <option value="4">매우 높음 🔥🔥🔥</option>
          <option value="3">높음 🔥</option>
          <option value="2">보통 ⚡</option>
          <option value="1">낮음 🌱</option>
        </Select>

        <ButtonContainer>
          <Button onClick={onClose}>취소</Button>
          <Button onClick={handleConfirmClick}>{task.id ? "수정하기" : "추가하기"}</Button>
        </ButtonContainer>
      </Container>
    </>
  );
};

export default InputModal;

