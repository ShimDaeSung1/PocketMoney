/* eslint-disable jsx-a11y/img-redundant-alt */
import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router";
import { ACCESS_TOKEN } from "./../../constant/LocalStorage";

const Header = styled.div`
  min-width: 1050px;
  height: 50px;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 2;
`;
const HeaderInside = styled.div`
  position: absolute;
  display: flex;
  width: 1050px;
  height: 50px;
  top: 0;
  left: 50%;
  transform: translate(-50%, 0%);
`;
const Logo = styled.div`
  margin-right: auto;
  color: rgb(24, 191, 230);
  height: 40px;
  width: 300px;
  text-align: center;
  font-size: 30px;
  font-weight: bold;
  cursor: pointer;
`;
const RightHeader = styled.div`
  margin-top: 5px;
  width: 50%;
  text-align: right;
  font-size: 20px;
  height: 30px;
`;
const Login = styled.div`
  display: inline-block;
  margin-left: 5px;
  width: 100px;
  cursor: pointer;
  text-align: center;
  border: 1px solid rgb(200, 200, 200);
`;
const SignUp = styled.div`
  display: inline-block;
  width: 100px;
  cursor: pointer;
  text-align: center;
  border: 1px solid rgb(200, 200, 200);
`;
const Mypage = styled.div`
  display: inline-block;
  width: 100px;
  cursor: pointer;
  text-align: center;
  border: 1px solid rgb(200, 200, 200);
`;
const Logout = styled.div`
  display: inline-block;
  margin-left: 5px;
  width: 100px;
  cursor: pointer;
  text-align: center;
  border: 1px solid rgb(200, 200, 200);
`;

function MainHeader() {
  const navigate = useNavigate();
  const token = sessionStorage.getItem(ACCESS_TOKEN);

  return (
    <Header>
      <HeaderInside>
        <Logo
          onClick={() => {
            window.location.href = "/";
          }}
        >
          PocketMoney
        </Logo>
        <RightHeader>
          {token === null ? (
            <>
              <SignUp
                onClick={() => {
                  navigate("/signup");
                }}
              >
                회원가입
              </SignUp>
              <Login
                onClick={() => {
                  navigate("/login");
                }}
              >
                로그인
              </Login>
            </>
          ) : (
            <>
              <Mypage
                onClick={() => {
                  navigate("/mypage");
                }}
              >
                마이페이지
              </Mypage>
              <Logout
                onClick={() => {
                  sessionStorage.removeItem(ACCESS_TOKEN);
                  alert("로그아웃 되었습니다.");
                  navigate("/");
                }}
              >
                로그아웃
              </Logout>
            </>
          )}
        </RightHeader>
      </HeaderInside>
    </Header>
  );
}

export default MainHeader;
