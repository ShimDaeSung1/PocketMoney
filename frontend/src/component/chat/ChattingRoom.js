import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import AllMessage from "./AllMessage";
import DefaultRoom from "./DefaultRoom";
import $ from "jquery";
import SockJS from "sockjs-client";
import { BACKEND_ADDRESS } from "./../../constant/ADDRESS";
import { Stomp } from "stompjs/lib/stomp.js";
import { useNavigate } from "react-router";

const Outside = styled.div`
  display: flex;
  width: 1050px;
  border-bottom: 5px solid blue;
`;
const ChatBox = styled.div`
  width: 680px;
`;
const ChatRoom = styled.div`
  display: flex;
  flex-direction: column;
  width: 680px;
  height: 400px;
  overflow: auto;
`;
const Myself = styled.div`
  margin: 10px;
  border-radius: 15px;
  background-color: Yellow;
  padding-left: 10px;
  margin-left: auto;
`;
const Opponent = styled.div`
  margin: 10px;
  border-radius: 15px;
  padding-left: 10px;
  margin-right: auto;
  background-color: lightBlue;
`;
const Content = styled.div`
  min-width: 200px;
  max-width: 500px;
  min-height: 40px;
  font-size: 25px;
  white-space: pre-line;
`;
const SendDate = styled.div`
  font-size: 15px;
`;

const Write = styled.div`
  margin: 10px auto;
  width: 670px;
  padding: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const StyledTextarea = styled.textarea`
  font-family: "Gowun Dodum", sans-serif;
  font-size: 30px;
  background-color: #00000000;
  padding: 3px 10px 10px 10px;
  height: 40px;
  max-height: 120px;
  width: 100%;
  resize: none;
`;

const CommentWritingButton = styled.button`
  height: 50px;
  width: 60px;
  margin-left: 5px;
  padding: 7px;
  background: #333333;
  color: #cccccc;
  font-family: "Gowun Dodum", sans-serif;
  border-radius: 5px;
`;

function ChattingRoom(props) {
  const writingRef = useRef();

  const handleResizeHeight = useCallback(() => {
    if (writingRef === null || writingRef.current === null) return;
    if (writingRef.current.style.height === "20px") {
      writingRef.current.style.overflow = "hidden";
    } else {
      writingRef.current.style.overflow = "";
    }
    writingRef.current.style.height = "20px";
    writingRef.current.style.height =
      writingRef.current.scrollHeight - 18 + "px";
  }, []);

  const msgRef = useRef();
  const sendRef = useRef();
  const navigate = useNavigate();
  const [stomps, setStomps] = useState();

  useEffect(() => {
    //1. SockJS를 내부에 들고있는 stomp를 내어줌
    const sockJs = new SockJS(BACKEND_ADDRESS + "/stomp/chat");
    const stomp = Stomp.over(sockJs);

    //2. connection이 맺어지면 실행
    stomp.connect({}, function () {
      document.getElementById("chatRoom").scrollTop =
        document.getElementById("chatRoom").scrollHeight;

      console.log("STOMP Connection");
      //4. subscribe(path, callback)으로 메세지를 받을 수 있음
      stomp.subscribe("/sub/chat/room/" + props.roomId, function (chat) {
        let content = JSON.parse(chat.body);
        console.log(content);
        let writer = content.writer;
        let message = content.message;
        let str = "";
        let today = new Date();

        if (writer === props.username) {
          str +=
            '<div style="border-radius: 15px;margin: 10px;' +
            "background-color: Yellow;padding-left: 10px;margin-left:" +
            'auto;">' +
            '<div style="min-width: 200px;' +
            "max-width: 500px;" +
            "min-height: 40px;" +
            "font-size: 25px;" +
            'white-space: pre-line;">' +
            message +
            "</div>" +
            '<div style="font-size: 15px;">' +
            (today.getYear() + 1900) +
            "년" +
            today.getMonth() +
            "월" +
            today.getDay() +
            "일" +
            today.getHours() +
            "시" +
            today.getMinutes() +
            "분" +
            "</div>" +
            "</div>";
          $("#chatRoom").append(str);
        } else {
          str +=
            '<div style="border-radius: 15px;margin: 10px;' +
            "background-color: lightBlue;padding-left: 10px;margin-right:" +
            'auto;">' +
            '<div style="min-width: 200px;' +
            "max-width: 500px;" +
            "min-height: 40px;" +
            "font-size: 25px;" +
            'white-space: pre-line;">' +
            message +
            "</div>" +
            '<div style="font-size: 15px;">' +
            (today.getYear() + 1900) +
            "년" +
            today.getMonth() +
            "월" +
            today.getDay() +
            "일" +
            today.getHours() +
            "시" +
            today.getMinutes() +
            "분" +
            "</div>" +
            "</div>";
          $("#chatRoom").append(str);
        }
        document.getElementById("chatRoom").scrollTop =
          document.getElementById("chatRoom").scrollHeight;
      });

      //3. send(path, header, message)로 메세지를 보낼 수 있음
      stomp.send(
        "/pub/chat/enter",
        {},
        JSON.stringify({ roomId: props.roomId, writer: props.username })
      );
    });

    setStomps(stomp);
  }, [props.chatInf]);
  console.log(props.chatInf);

  return (
    <Outside>
      <AllMessage
        roomList={props.roomList}
        setChatInf={props.setChatInf}
        chatInf={props.chatInf}
        setMessages={props.setMessages}
        setRoomId={props.setRoomId}
        setUsername={props.setUsername}
        stomps={stomps}
      />
      {/* <DefaultRoom /> */}
      <ChatBox>
        <ChatRoom id="chatRoom">
          {props.chatInf
            ? props.messages.map((inf) => {
                let date = new Date(inf.sendDate);
                if (props.chatInf.userId === inf.writerId) {
                  return (
                    <Myself>
                      <Content>{inf.message}</Content>
                      <SendDate>
                        {" "}
                        {date.getYear() + 1900}년 {date.getMonth()}월{" "}
                        {date.getDay()}일 {date.getHours()}시{" "}
                        {date.getMinutes()}분
                      </SendDate>
                    </Myself>
                  );
                } else {
                  return (
                    <Opponent>
                      <Content>{inf.message}</Content>
                      <SendDate>
                        {" "}
                        {date.getYear() + 1900}년 {date.getMonth()}월{" "}
                        {date.getDay()}일 {date.getHours()}시{" "}
                        {date.getMinutes()}분
                      </SendDate>
                    </Opponent>
                  );
                }
              })
            : ""}
        </ChatRoom>
        <React.Fragment>
          <div ref={msgRef}></div>
        </React.Fragment>
        <Write>
          <StyledTextarea
            ref={writingRef}
            id="msg"
            onChange={(e) => {
              handleResizeHeight();
            }}
          />
          <CommentWritingButton
            ref={sendRef}
            onClick={() => {
              let msg = document.getElementById("msg");
              stomps.send(
                "/pub/chat/message",
                {},
                JSON.stringify({
                  roomId: props.roomId,
                  message: msg.value,
                  writer: props.username,
                })
              );
              msg.value = "";
            }}
          >
            등록
          </CommentWritingButton>
        </Write>
      </ChatBox>
    </Outside>
  );
}

export default ChattingRoom;
