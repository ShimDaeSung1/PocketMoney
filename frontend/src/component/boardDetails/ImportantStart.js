import React from "react";
import styled from "styled-components";
import addBoardWishApi from "./../../api/board/AddBoardWishApi";
import deleteBoardWishApi from "./../../api/board/DeleteBoardWishApi";

const WishStart = styled.div`
  display: inline-block;
  width: 30px;
  height: 30px;
  margin-left: -40px;

  line-height: 20px;
  font-size: 37px;
  text-align: center;
  cursor: pointer;
`;
const ImportantStart = (props) => {
  let color = props.wish ? "#ffd400" : "#afafaf";

  const changeWish = () => {
    if (!props.wish) {
      addBoardWishApi(props.accesstoken, props.boardId);
      props.setWish(!props.wish);
      color = "#ffd400";
    } else {
      deleteBoardWishApi(props.accesstoken, props.boardId);
      props.setWish(!props.wish);
      color = "#afafaf";
    }
  };
  return (
    <WishStart
      style={{
        color: color,
      }}
      onClick={() => changeWish()}
    >
      ★
    </WishStart>
  );
};

export default ImportantStart;
