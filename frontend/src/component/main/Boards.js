/* eslint-disable jsx-a11y/img-redundant-alt */
import React from "react";
import styled from "styled-components";

const BoardList = styled.div`
  width: 1050px;
`;
const BoardBox = styled.div`
  display: inline-block;
  width: 300px;
  height: 410px;
  margin: 20px;
  cursor: pointer;
`;
const ImgBox = styled.div`
  margin: 0 auto;
  margin-top: 15px;
  width: 250px;
  height: 200px;
`;
const BoardTitle = styled.div`
  margin: 0 auto;
  margin-top: 3px;
  width: 250px;
  height: 30px;
`;
const Salary = styled.div`
  margin: 0 auto;
  margin-top: 3px;
  width: 250px;
  height: 30px;
  font-weight: bold;
`;
const Location = styled.div`
  margin: 0 auto;
  margin-top: 3px;
  width: 250px;
  height: 30px;
`;

function Boards(props) {
  return (
    <>
      <BoardList>
        {props.boards
          ? props.boards.map((board) => {
              let date = new Date(board.createTime);
              return (
                <BoardBox
                  onClick={() => {
                    props.navigate("/board/" + board.boardId);
                  }}
                >
                  <ImgBox>
                    <img
                      src="https://pocketdon.s3.ap-northeast-2.amazonaws.com/board/85e6dc2d-1666-43c4-94b0-1484cdd9ba2atestlogo.JPG"
                      alt="my image"
                      style={{
                        width: "250px",
                        height: "200px",
                      }}
                    />
                  </ImgBox>
                  <BoardTitle>{board.title}</BoardTitle>
                  <Salary>{board.pay} 원</Salary>
                  <Location>{board.city}</Location>
                  <Location>
                    {date.getYear() + 1900}년 {date.getMonth()}월{" "}
                    {date.getDay()}일 {date.getHours()}시 {date.getMinutes()}분
                  </Location>
                </BoardBox>
              );
            })
          : ""}
      </BoardList>
    </>
  );
}

export default Boards;
