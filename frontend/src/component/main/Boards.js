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
  const imgurl =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
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
                      src={board.filePath ? board.filePath : imgurl}
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
