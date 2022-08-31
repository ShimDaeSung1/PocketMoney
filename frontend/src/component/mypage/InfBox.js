import React from "react";
import styled from "styled-components";
const Outside = styled.div`
  display: inline-block;
  width: 300px;
  height: 300px;
  padding-left: 100px;
`;
const Information = styled.div`
  width: 200px;
  height: 35px;
  margin: 10px;
  font-size: 28px;
  border: 2px solid blue;
  border-radius: 100px;
`;
function InfBox(props) {
  return (
    <Outside>
      <Information>
        이메일: {props.userInf ? props.userInf.nickName : ""}
      </Information>
      <Information>
        닉네임: {props.userInf ? props.userInf.nickName : ""}
      </Information>
      <Information>나이: {props.userInf ? props.userInf.age : ""}</Information>
      <Information>성별: {props.userInf ? props.userInf.sex : ""}</Information>
      <Information>도시: {props.userInf ? props.userInf.city : ""}</Information>
    </Outside>
  );
}

export default InfBox;
