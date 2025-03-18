import React from "react";
import styled from "styled-components";

const StyledInput = styled.input`
  padding: 8px;
  border: 1px solid #000000;
  border-radius: 5px;
  font-size: 16px;
  color: #000000;
  width: ${(props) => (props.fullWidth ? "100%" : "auto")};
`;

const Input = ({ fullWidth = false, ...props }) => {
  return <StyledInput fullWidth={fullWidth} {...props} />;
};

export default Input;
