import React from "react";
import styled from "styled-components";

const WishContentStyle = styled.div`
  display: flex;
  justify: center;
  height: 50px;
  margin-bottom: 6px;
  margin-left: 10px;
  font-size: 40px;
  border-bottom: 2px solid rgb(200, 200, 200);
  cursor: pointer;
`;

const WishContent = (props) => {
  return (
    <WishContentStyle
      onClick={() => {
        props.navigate("/board/" + props.wish.boardId);
      }}
    >
      {props.wish.title}
    </WishContentStyle>
  );
};

export default WishContent;
