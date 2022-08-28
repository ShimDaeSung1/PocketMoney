import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import AllMessage from "./AllMessage";
import DefaultRoom from "./DefaultRoom";
import SockJS from "sockjs-client";
import { BACKEND_ADDRESS } from "./../../constant/ADDRESS";
import { Stomp } from "stompjs/lib/stomp.js";
import findChttingRoomApi from "./../../api/chat/FindChttingRoomApi";
import { ACCESS_TOKEN } from "./../../constant/LocalStorage";

const Outside = styled.div`
  width: 1050px;
  height: 400px;
  border-bottom: 5px solid blue;
`;

const StyledInput = styled.input`
  display: block;
  font-size: 50px;
  width: 770px;
  background-color: #00000000;
  padding: 10px;
  height: 50px;
  border: none;
  &:focus {
    outline: none;
    border: none;
  }
`;

function ChattingRoom(props) {
  const accesstoken = sessionStorage.getItem(ACCESS_TOKEN);
  const [chatInf, setChatInf] = useState(null);
  const [chatInfDetails, setChatInfDetails] = useState(null);
  const msgRef = useRef();
  const sendRef = useRef();

  useEffect(() => {
    console.log(chatInfDetails);
  }, [chatInfDetails]);

  useEffect(() => {
    console.log(chatInf);
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
        setChatInfDetails(chatInf);
        //4. subscribe(path, callback)으로 메세지를 받을 수 있음
        stomp.subscribe(
          BACKEND_ADDRESS + "/sub/chat/room/" + roomId,
          function (chat) {
            alert("pppppppppppppp");
            var content = JSON.parse(chat.body);

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
          }
        );

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
          findChttingRoomApi(chatInf.id, accesstoken).then((resp) => {
            setChatInfDetails(resp);
          });
        }
      });
    }
  }, [chatInf]);

  return (
    <Outside>
      <AllMessage roomList={props.roomList} setChatInf={setChatInf} />
      <DefaultRoom />
      <div class="container">
        <div class="col-6">
          <h1>{chatInf ? chatInf.name : ""}</h1>
        </div>
        <div>
          <div ref={msgRef} id="msgArea" class="col"></div>
          <div class="col-6">
            <div class="input-group mb-3">
              <input type="text" id="msg" class="form-control" />
              <div class="input-group-append">
                <button
                  ref={sendRef}
                  class="btn btn-outline-secondary"
                  type="button"
                  id="button-send"
                >
                  전송
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="col-6"></div>
      </div>
    </Outside>
  );
}

export default ChattingRoom;
