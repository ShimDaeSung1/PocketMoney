import React from "react";
import styled from "styled-components";
import AllMessage from "./AllMessage";
import DefaultRoom from "./DefaultRoom";

const Outside = styled.div`
  width: 1050px;
  height: 400px;
  border-bottom: 5px solid blue;
`;

function ChattingRoom(props) {
  return (
    <Outside>
      <AllMessage roomList={props.roomList} />
      <DefaultRoom />
    </Outside>
  );
}

export default ChattingRoom;
