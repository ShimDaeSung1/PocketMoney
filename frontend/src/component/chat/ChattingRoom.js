import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import AllMessage from "./AllMessage";
import DefaultRoom from "./DefaultRoom";
import SockJS from "sockjs-client";
import { BACKEND_ADDRESS } from "./../../constant/ADDRESS";
import { Stomp } from "stompjs/lib/stomp.js";

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

  const [chatInf, setChatInf] = useState(null);
  const msgRef = useRef();
  const sendRef = useRef();

  useEffect(() => {
    console.log(chatInf);
    document.getElementById("chatRoom").scrollTop =
      document.getElementById("chatRoom").scrollHeight;
    if (chatInf !== null) {
      //1. SockJS를 내부에 들고있는 stomp를 내어줌
      const sockJs = new SockJS(BACKEND_ADDRESS + "/stomp/chat");
      const stomp = Stomp.over(sockJs);

      let roomName = chatInf.name;
      var roomId = chatInf.id;
      var username = chatInf.nickName;

      console.log(roomName + ", " + roomId + ", " + username);

      //2. connection이 맺어지면 실행
      stomp.connect({}, function () {
        console.log("STOMP Connection");
        //4. subscribe(path, callback)으로 메세지를 받을 수 있음
        stomp.subscribe("/sub/chat/room/" + roomId, function (chat) {
          alert("pppppppppppppp");
          var content = JSON.parse(chat.body);

          console.log("zㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ");
          var writer = content.writer;
          var str = "";
          alert("pppppppppppppp");
          if (writer === username) {
            str = "<div class='col-6'>";
            str += "<div class='alert alert-secondary'>";
            str += "<b>" + writer + " : " + "하이하이" + "</b>";
            str += "</div></div>";
            alert("zzzzzzzzzzzzzzz");
            console.log("1-------------" + str);
            //  msgRef.current.value.append(str);
            //$("#msgArea").append(str);
          } else {
            str = "<div class='col-6'>";
            str += "<div class='alert alert-warning'>";
            str += "<b>" + writer + " : " + "하이하이222" + "</b>";
            str += "</div></div>";
            alert("eeeeeeeeeeeeeeeeee");
            console.log("2-------------" + str);
            //  msgRef.current.value.append(str);
            // $("#msgArea").append(str);
          }
          alert("qqqqqqqqqqqqqqq");
          console.log("3-------------" + str);
          //msgRef.current.value.append(str);
          //$("#msgArea").append(str);
        });

        //3. send(path, header, message)로 메세지를 보낼 수 있음
        stomp.send(
          "/pub/chat/enter",
          {},
          JSON.stringify({ roomId: roomId, writer: username })
        );
      });

      document.addEventListener("mousedown", function (event) {
        if (sendRef.current.contains(event.target)) {
          let msg = document.getElementById("msg");

          console.log(username + ":" + msg.value);
          stomp.send(
            "/pub/chat/message",
            {},
            JSON.stringify({
              roomId: roomId,
              message: msg.value,
              writer: username,
            })
          );
          msg.value = "";
        }
      });
    }
  }, [chatInf]);

  return (
    <Outside>
      <AllMessage roomList={props.roomList} setChatInf={setChatInf} />
      {/* <DefaultRoom /> */}
      <ChatBox>
        <ChatRoom id="chatRoom">
          {chatInf
            ? chatInf.messageDetailDtoList.map((inf) => {
                let date = new Date(inf.sendDate);
                if (chatInf.userId === inf.writerId) {
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
        <Write>
          <StyledTextarea
            ref={writingRef}
            id="msg"
            onChange={(e) => {
              handleResizeHeight();
            }}
          />
          <CommentWritingButton ref={sendRef}>{"등록"}</CommentWritingButton>
        </Write>
      </ChatBox>

      {/* <div>
        <div ref={msgRef} id="msgArea" class="col"></div>
      </div> */}
    </Outside>
  );
}

export default ChattingRoom;
