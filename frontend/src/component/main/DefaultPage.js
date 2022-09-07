import styled from "styled-components";
import Boards from "./Boards";
import { useNavigate } from "react-router";
import Numbers from "./Numbers";
import React, { useState, useEffect } from "react";
import MainHeader from "./MainHeader";
import searchBoardApi from "./../../api/board/SearchBoardApi";
import findLatestBoardAPi from "./../../api/board/FindLatestBoardApi";
import findBorldListApi from "./../../api/board/FindBorldListApi";
import findLocalBoardListApi from "./../../api/board/FIndLocalBoardListApi";
import { ACCESS_TOKEN, MYCITY } from "./../../constant/LocalStorage";

const Outside = styled.div`
  width: 1050px;
  margin: 10px auto;
  -ms-user-select: none;
  -moz-user-select: -moz-none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  user-select: none;
`;
const TitleLogo = styled.div`
  width: 1050px;
  height: 250px;
  background-color: rgb(168, 239, 246);
  margin-bottom: 10px;
  font-size: 50px;
  line-height: 250px;
  text-align: center;
  font-weight: 500;
`;
const EntireWork = styled.div`
  display: inline-block;
  width: 520px;
  margin-right: 10px;
  height: 250px;
  background-color: rgb(168, 239, 246);
  font-size: 50px;
  line-height: 250px;
  text-align: center;
  font-weight: 500;
`;
const LocalWork = styled.div`
  display: inline-block;
  width: 520px;
  height: 250px;
  background-color: rgb(168, 239, 246);
  font-size: 50px;
  line-height: 250px;
  text-align: center;
  font-weight: 500;
`;
const FindWork = styled.div`
  width: 1050px;
  margin-top: 10px;
  height: 250px;
  background-color: rgb(168, 239, 246);
  font-size: 50px;
  line-height: 250px;
  text-align: center;
  font-weight: 500;
`;

function DefaultPage() {
  const navigate = useNavigate();
  const [sword, setSword] = useState("");
  const [search, setSearch] = useState(false);
  const [citySearch, setCitySearch] = useState(false);
  const [num, setNum] = useState(0);
  const [boards, setBoards] = useState("");
  const [notDefault, setNotDefault] = useState(false);

  const accesstoken = sessionStorage.getItem(ACCESS_TOKEN);
  const city = sessionStorage.getItem(MYCITY);
  useEffect(() => {
    if (search) {
      searchBoardApi(sword, num).then((dataPromise) => {
        setBoards(dataPromise);
      });
    } else if (citySearch) {
      findLocalBoardListApi(city, accesstoken, num).then((dataPromise) => {
        setBoards(dataPromise);
      });
    } else if (num === 0) {
      findLatestBoardAPi().then((dataPromise) => {
        setBoards(dataPromise);
      });
    } else {
      findBorldListApi(num ? num : 1).then((dataPromise) => {
        setBoards(dataPromise);
      });
    }
  }, [num]);

  return (
    <>
      <MainHeader
        setBoards={setBoards}
        setSearch={setSearch}
        sword={sword}
        setSword={setSword}
        num={num}
        setNum={setNum}
        setNotDefault={setNotDefault}
      />
      <Outside>
        {notDefault === false ? (
          <React.Fragment>
            <TitleLogo>PocketMoney</TitleLogo>
            <EntireWork
              onClick={() => {
                setNum(1);
                setNotDefault(true);
              }}
            >
              전체 일자리
            </EntireWork>
            <LocalWork
              onClick={() => {
                if (!sessionStorage.getItem(ACCESS_TOKEN)) {
                  alert("로그인 후 이용이 가능합니다!");
                } else {
                  setNum(1);
                  setNotDefault(true);
                  setCitySearch(true);
                }
              }}
            >
              근처 일자리
            </LocalWork>
            <FindWork
              onClick={() => {
                navigate("/board/write");
              }}
            >
              일자리 구인
            </FindWork>
          </React.Fragment>
        ) : (
          ""
        )}
        <Boards boards={boards.boards} navigate={navigate} />
        <Numbers
          num={num}
          setNum={setNum}
          start={boards.start}
          end={boards.end}
          prev={boards.prev}
          next={boards.next}
        />
      </Outside>
    </>
  );
}

export default DefaultPage;
