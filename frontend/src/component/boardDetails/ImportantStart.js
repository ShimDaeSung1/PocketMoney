import React from "react";
import styled from "styled-components";

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
  const color = props.wish ? "#ffd400" : "#afafaf";

  return (
    <WishStart
      style={{
        color: color,
      }}
      // onClick={() => {
      //     changeBoardWishApi(props.wish, props.accesstoken)
      //   props.setWish(!wish)
      // }}
    >
      ★
    </WishStart>
  );
};

export default ImportantStart;
