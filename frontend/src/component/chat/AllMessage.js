/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState } from "react";
import styled from "styled-components";
import { ACCESS_TOKEN } from "./../../constant/LocalStorage";
import searchchatRoomApi from "./../../api/chat/SearchChatRoomApi";
import changeLikeApi from "./../../api/chat/ChangeLikeApi";

const Outside = styled.div`
  width: 350px;
  height: 500px;
  overflow: auto;
  border-right: 1px solid rgb(200, 200, 200);
`;
const Search = styled.div`
  width: 350px;
`;
const Searchinput = styled.input`
  width: 290px;
  height: 25px;
  border-radius: 18px;
  border: 2px solid gray;
  background: none;
`;
const Serachsubmit = styled.button`
  border: none;
  background: none;
`;
const Message = styled.div`
  margin: 5px;
  width: 340px;
  height: 100px;
  border-bottom: 1px solid rgb(200, 200, 200);
  background-color: rgb(168, 239, 246);
`;
const Title = styled.div`
  width: 300px;
  height: 40px;
  font-size: 30px;
`;
const User = styled.div`
  width: 300px;
  height: 30px;
  font-size: 20px;
  color: blue;
`;
const LatestDate = styled.div`
  display: inline-block;
  width: 200px;
  height: 20px;
  color: gray;
  font-size: 15px;
`;
const Like = styled.div`
  display: inline-block;
  margin-left: 95px;
  padding-left: 10px;
  margin-top: -20px;
  width: 30px;
  height: 35px;
  color: red;
  font-size: 40px;
  cursor: pointer;
`;

function AllMessage(props) {
  const accesstoken = sessionStorage.getItem(ACCESS_TOKEN);
  const [sword, setSword] = useState("");
  const search = () => {
    if (!sword.length) {
      alert("검색어를 입력해주세요");
    } else {
      searchchatRoomApi(sword, accesstoken).then((dataPromise) => {
        props.setRoomList(dataPromise);
      });

      setSword("");
    }
  };
  const enterKey = () => {
    if (window.event.keyCode === 13) {
      search();
    }
  };

  function selectOneChatRoom(id) {
    window.location.href = "/chat/" + id;
  }

  return (
    <Outside>
      <Search>
        <Searchinput
          type="text"
          value={sword}
          onChange={(e) => setSword(e.target.value.trim())}
          onKeyUp={enterKey}
        />
        <Serachsubmit>
          <img
            src="/search.png"
            alt="my image"
            style={{
              width: "20px",
              height: "20px",
              cursor: "pointer",
            }}
            onClick={search}
          />
        </Serachsubmit>
      </Search>
      {props.roomList
        ? props.roomList.map((room, idx) => {
            let date = new Date(room.regDate);

            return (
              <Message onClick={() => selectOneChatRoom(room.id)}>
                <Title>{room.name}</Title>
                <User>{room.nickName}</User>
                <LatestDate>
                  {date.getYear() + 1900}년 {date.getMonth()}월 {date.getDay()}
                  일 {date.getHours()}시 {date.getMinutes()}분
                </LatestDate>
                <Like
                  onClick={() => {
                    changeLikeApi(room.id, room.userId, true, accesstoken);
                    alert("gdgd");
                  }}
                >
                  {room.like === "true" ? "♥" : "♡"}
                </Like>
              </Message>
            );
          })
        : ""}
    </Outside>
  );
}

export default AllMessage;
