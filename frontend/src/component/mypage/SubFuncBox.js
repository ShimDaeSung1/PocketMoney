import React from "react";
import styled from "styled-components";
import deleteUserApi from "./../../api/user/deleteUserApi";
import { ACCESS_TOKEN } from "./../../constant/LocalStorage";

const Outside = styled.div`
  position: relative;
  display: inline-block;
  width: 300px;
  height: 300px;
`;
const ChatButton = styled.div`
  position: absolute;
  top: 40px;
  left: 90px;
  width: 120px;
  height: 50px;
  font-size: 35px;
  text-align: center;
  background-color: pink;
  border-radius: 100px;
  cursor: pointer;
  border: 5px solid red;
`;
const EditMyInfoButton = styled.div`
  position: absolute;
  top: 120px;
  left: 50px;
  width: 200px;
  height: 50px;
  font-size: 35px;
  text-align: center;
  background-color: pink;
  border-radius: 100px;
  cursor: pointer;
  border: 5px solid red;
`;

const KindScore = styled.div`
  position: absolute;
  top: 210px;
  left: 70px;
  width: 150px;
  height: 40px;
  font-size: 25px;
  text-align: center;
  background-color: lightYellow;
  border-radius: 100px;
  border: 5px solid yellow;
`;
const DeleteUser = styled.div`
  position: absolute;
  top: 280px;
  left: 110px;
  width: 80px;
  height: 30px;
  fint-size: 14px;
  text-align: center;
  color: gray;
  cursor: pointer;
`;
function SubFuncBox(props) {
  const onDeleteUserClicked = () => {
    if (window.confirm("정말 탈퇴하시겠습니까?")) {
      if (window.confirm("정말정말 탈퇴하시겠습니까?")) {
        deleteUserApi(sessionStorage.getItem(ACCESS_TOKEN), props.navigate);
      }
    }
  };

  return (
    <Outside>
      <ChatButton
        onClick={() => {
          props.navigate("/chat");
        }}
      >
        채팅방
      </ChatButton>
      <EditMyInfoButton
        onClick={() => {
          props.navigate("/mypage/edit", {
            state: props.userInf,
          });
        }}
      >
        내 정보 수정
      </EditMyInfoButton>
      <KindScore>
        친절도: {props.userInf ? props.userInf.kindScore : ""}
      </KindScore>
      <DeleteUser onClick={onDeleteUserClicked}>회원 탈퇴</DeleteUser>
    </Outside>
  );
}

export default SubFuncBox;
