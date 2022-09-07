import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { ACCESS_TOKEN } from "./../../../constant/LocalStorage";
import styled from "styled-components";
import CancelButton from "../../CancelButton";
import edidUserApi from "./../../../api/user/edidUserApi";

const EditButton = styled.a`
  display: block;
  margin: 15px auto;
  height: 45px;
  font-size: 20px;
  padding-top: 13px;
  border: 2px solid black;
  max-width: 500px;
  text-decoration: none;
  color: black;
  &:hover {
    color: #00a0c6;
    text-decoration: none;
    cursor: pointer;
  }
`;
const StyledInput = styled.input`
  display: block;
  font-size: 17px;
  margin: 10px auto;
  max-width: 480px;
  width: 80%;
  padding: 10px;
  height: 35px;
  border: 1px solid gray;
  cursor: pointer;
  &:focus {
    outline: 2px solid rgb(90, 155, 213);
    border: 1px solid rgb(90, 155, 213);
  }
`;
const EditBox = styled.div`
  margin: 10px auto;
  width: 800px;
  text-align: center;
  border: 1px solid rgb(200, 200, 200);
`;

function EditMyInfo() {
  const { state } = useLocation();
  const [nickName, setNickName] = useState(state ? state.nickName : "");
  const [age, setAge] = useState(state ? state.age : "");
  const [sex, setSex] = useState(state ? state.sex : "");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordComp, setPasswordComp] = useState("");
  const accesstoken = sessionStorage.getItem(ACCESS_TOKEN);
  if (!accesstoken) {
    alert("로그인이 필요한 서비스입니다!!!");
    window.location.href = "/login";
  }
  const navigate = useNavigate();

  const checkOnlyOne = (checkThis) => {
    const checkboxes = document.getElementsByName("sex");
    for (let i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i] !== checkThis) {
        checkboxes[i].checked = false;
      } else {
        setSex(checkThis.value);
      }
    }
  };

  return (
    <EditBox>
      <CancelButton navigate={navigate} />
      <StyledInput
        value={nickName}
        onChange={(e) => setNickName(e.target.value)}
        placeholder={"닉네임"}
      />
      <StyledInput
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={"현재 비밀번호"}
      />
      <StyledInput
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder={"새 비밀번호"}
      />
      <StyledInput
        type="password"
        value={passwordComp}
        onChange={(e) => setPasswordComp(e.target.value)}
        placeholder={"새 비밀번호 확인"}
      />
      <StyledInput
        value={age}
        onChange={(e) => setAge(e.target.value)}
        placeholder={"나이"}
      />
      <StyledInput
        type="text"
        id="pInput"
        readOnly={true}
        placeholder={"도시"}
        onClick={() => {
          window.name = "parentForm";
          window.open(
            "/signup/city",
            "childForm",
            "top=10, left=10, width=650, height=600, status=no, menubar=no, toolbar=no, resizable=no"
          );
        }}
      />
      <div
        style={{
          display: "inline-block",
          width: "60px",
          fontSize: "20px",
          marginLeft: "-40px",
        }}
      >
        성별:
      </div>
      <input
        type="checkbox"
        name="sex"
        value={"남성"}
        onChange={(e) => checkOnlyOne(e.target)}
        style={{ display: "inline-block", width: "100px", height: "20px" }}
      />{" "}
      <div
        style={{
          display: "inline-block",
          width: "40px",
          fontSize: "20px",
          marginLeft: "-40px",
        }}
      >
        남
      </div>
      <input
        type="checkbox"
        name="sex"
        value={"여성"}
        onChange={(e) => checkOnlyOne(e.target)}
        style={{ display: "inline-block", width: "100px", height: "20px" }}
      />{" "}
      <div
        style={{
          display: "inline-block",
          width: "40px",
          fontSize: "20px",
          marginLeft: "-40px",
        }}
      >
        여
      </div>
      <EditButton
        onClick={() => {
          if (
            nickName.length &&
            age.length &&
            sex.length &&
            document.getElementById("pInput").value &&
            password.length &&
            newPassword.length &&
            passwordComp.length
          ) {
            if (newPassword === passwordComp) {
              edidUserApi(
                nickName,
                age,
                sex,
                document.getElementById("pInput").value,
                password,
                newPassword,
                navigate,
                accesstoken
              );
            } else {
              alert("새 비밀번호 확인이 일치하지 않습니다.");
            }
          } else {
            alert("빈칸을 다 채워주세요");
          }
        }}
      >
        수정하기
      </EditButton>
    </EditBox>
  );
}

export default EditMyInfo;
