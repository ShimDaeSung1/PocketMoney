/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState } from "react";
import styled from "styled-components";
import findChttingRoomApi from "./../../api/chat/FindChttingRoomApi";
import { ACCESS_TOKEN } from "./../../constant/LocalStorage";

const Outside = styled.div`
  width: 350px;
  height: 400px;
  overflow: auto;
  border-right: 5px solid blue;
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
  width: 350px;
  height: 100px;
  border-bottom: 5px solid blue;
  background-color: lightBlue;
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
  width: 200px;
  height: 20px;
  color: gray;
  font-size: 15px;
`;
function AllMessage(props) {
  const accesstoken = sessionStorage.getItem(ACCESS_TOKEN);
  const [sword, setSword] = useState("");
  const search = () => {
    if (!sword.length) {
      alert("검색어를 입력해주세요");
    } else {
      alert(sword);
      setSword("");
    }
  };
  const enterKey = () => {
    if (window.event.keyCode === 13) {
      search();
    }
  };

  function selectOneChatRoom(id) {
    findChttingRoomApi(id, accesstoken).then((resp) => {
      props.setChatInf(resp);
    });
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
        ? props.roomList.map((room) => {
            return (
              <Message onClick={() => selectOneChatRoom(room.id)}>
                <Title>{room.name}</Title>
                <User>{room.nickName}</User>
                <LatestDate>{room.regDate}</LatestDate>
              </Message>
            );
          })
        : ""}
    </Outside>
  );
}

export default AllMessage;
