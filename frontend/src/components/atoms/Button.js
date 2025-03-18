// src/components/atoms/Button.tsx
import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  background-color: transparent;
  border: rgba(77, 158, 195, 0.5) solid 1px;
  border-radius: 8px;
  margin: 8px;
  width: fit-content;
  height: fit-content;
  padding: 4px 12px;
  cursor: pointer;
  color: white;
`;



const Button= ({ onClick, children }) => {
  return <StyledButton onClick={onClick}>{children}</StyledButton>;
};

export default Button;
