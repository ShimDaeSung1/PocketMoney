import React, { useEffect, useState } from "react";
import styled from "styled-components";
import CancelButton from "../CancelButton";
import ChattingRoom from "./ChattingRoom";
import { useNavigate, useParams } from "react-router";
import findChattingListApi from "./../../api/chat/FindChattingListApi";
import { ACCESS_TOKEN } from "./../../constant/LocalStorage";
import findChttingRoomApi from "./../../api/chat/FindChttingRoomApi";

const Outside = styled.div`
  width: 1050px;
  margin: 10px auto;
  border-top: 1px solid rgb(200, 200, 200);
  border-left: 1px solid rgb(200, 200, 200);
  border-right: 1px solid rgb(200, 200, 200);
`;
const Block = styled.div`
  width: 1050px;
  height: 50px;
  border-bottom: 1px solid rgb(200, 200, 200);
`;

function ChatPage() {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id;
  const [roomList, setRoomList] = useState();
  const accesstoken = sessionStorage.getItem(ACCESS_TOKEN);

  const [chatInf, setChatInf] = useState(null);
  const [messages, setMessages] = useState([]);
  const [roomId, setRoomId] = useState();
  const [username, setUsername] = useState();

  useEffect(() => {
    findChattingListApi(accesstoken).then((resp) => {
      setRoomList(resp);
    });
    if (id) {
      findChttingRoomApi(id, accesstoken).then((resp) => {
        setChatInf(resp);
        setRoomId(resp.id);
        setUsername(resp.nickName);
        setMessages(resp.messageDetailDtoList);
      });
    }
  }, []);

  return (
    <Outside>
      <CancelButton navigate={navigate} />
      <Block></Block>
      <ChattingRoom
        roomList={roomList}
        chatInf={chatInf}
        messages={messages}
        roomId={roomId}
        username={username}
        setRoomList={setRoomList}
      />
    </Outside>
  );
}

export default ChatPage;
