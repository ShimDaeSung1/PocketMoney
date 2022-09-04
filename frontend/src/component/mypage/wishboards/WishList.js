import React, { useEffect, useState } from "react";
import { Motion, spring } from "react-motion";
import { useNavigate } from "react-router";
import WishContent from "./WishContent";

const WishList = (props) => {
  const navigate = useNavigate();
  const [height, setHeight] = useState(0);

  useEffect(() => {
    setHeight(
      props.isOpened && props.wishBoards ? 70 * props.wishBoards.length : 0
    );
  }, [props]);

  const wishPresent = props.wishBoards
    ? props.wishBoards.map((wish) => (
        <WishContent wish={wish} navigate={navigate} />
      ))
    : "";

  const styles = {
    menu: {
      overflow: "hidden",
    },
  };

  return (
    <div className="App">
      <Motion style={{ height: spring(height) }}>
        {({ height }) => (
          <div style={Object.assign({}, styles.menu, { height })}>
            {wishPresent}
          </div>
        )}
      </Motion>
    </div>
  );
};

export default WishList;
