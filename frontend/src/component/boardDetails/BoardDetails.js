/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import styled from "styled-components";
import Comments from "./Comments";
import BoardBody from "./BoardBody";
import findBoardApi from "../../api/board/FindBoardApi";
import { ACCESS_TOKEN } from "./../../constant/LocalStorage";
import deleteBoardApi from "../../api/board/DeleteBoardApi";
import findCommentApi from "./../../api/comment/FindCommentApi";
import CommentWrite from "./CommentWrite";
import createRoomApi from "./../../api/chat/CreateRoomApi";
import ImportantStart from "./ImportantStart";
import MainHeader from "./MainHeader";

const Outside = styled.div`
  width: 1050px;
  margin: 30px auto;
`;
const ContentHeader = styled.div`
  margin-top: 10px;
  width: 1050px;
  height: 60px;
`;
const Title = styled.div`
  display: inline-block;
  width: 800px;
  height: 50px;
  padding-left: 30px;
  font-size: 30px;
  font-weight: 1000;
`;
const ConnectButton = styled.div`
  display: inline-block;
  width: 150px;
  height: 50px;
  margin-left: 30px;
  line-height: 50px;
  font-size: 20px;
  background-color: rgb(24, 191, 230);
  text-align: center;
  cursor: pointer;
`;
const DeleteButton = styled.div`
  display: inline-block;
  width: 75px;
  height: 50px;
  margin-left: 10px;
  line-height: 50px;
  font-size: 20px;
  background-color: rgb(24, 191, 230);
  text-align: center;
  cursor: pointer;
`;
const EditButton = styled.div`
  display: inline-block;
  width: 75px;
  height: 50px;
  margin-left: 30px;
  line-height: 50px;
  font-size: 20px;
  background-color: rgb(24, 191, 230);
  text-align: center;
  cursor: pointer;
`;
const ContentImg = styled.div`
  margin: 0 auto;
  width: 1000px;
  height: 400px;
  border: 1px solid rgb(200, 200, 200);
`;

const BoardDetails = () => {
  const navigate = useNavigate();
  const accesstoken = sessionStorage.getItem(ACCESS_TOKEN);

  const params = useParams();
  const boardId = params.boardId;
  const [data, setData] = useState();
  const [wish, setWish] = useState(false);

  const [commentPage, setCommentPage] = useState(1);
  const [comments, setComments] = useState();

  const imgurl =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  const match = () => {
    createRoomApi(boardId, data.title, accesstoken).then((resp) => {
      if (!resp) {
        navigate("/chat");
      }
    });
  };

  useEffect(() => {
    findBoardApi(accesstoken, boardId, navigate).then((dataPromise) => {
      if (dataPromise === null) {
        alert("존재하지 않는 구인 글 입니다!!!!");
        navigate("/");
      }
      setData(dataPromise);
      setWish(dataPromise.wish);
      //setWish(dataPromise.wish)
    });
  }, []);

  useEffect(() => {
    findCommentApi(accesstoken, boardId, commentPage).then((dataPromise) => {
      setComments(dataPromise);
    });
  }, [commentPage]);

  const onDeleteButtonClicked = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      deleteBoardApi(boardId, accesstoken, navigate);
    }
  };

  return (
    <>
      <MainHeader />
      <Outside>
        <ContentHeader>
          <Title>{data ? data.title : ""}</Title>
          {data ? (
            data.isUser === "USER" ? (
              <>
                <ImportantStart
                  data={data}
                  accesstoken={accesstoken}
                  wish={wish}
                  setWish={setWish}
                />
                <EditButton
                  onClick={() => {
                    navigate("/board/write/modify/" + boardId, {
                      state: data,
                    });
                  }}
                >
                  수정
                </EditButton>
                <DeleteButton onClick={onDeleteButtonClicked}>
                  삭제
                </DeleteButton>
              </>
            ) : data.isUser === "NOTUSER" ? (
              <React.Fragment>
                <ImportantStart
                  data={data}
                  accesstoken={accesstoken}
                  wish={wish}
                  setWish={setWish}
                />
                <ConnectButton onClick={match}>연락하기</ConnectButton>
              </React.Fragment>
            ) : (
              ""
            )
          ) : (
            ""
          )}
        </ContentHeader>
        <ContentImg>
          <img
            src={data ? (data.filePath ? data.filePath : imgurl) : ""}
            alt="my image"
            style={{
              width: "1000px",
              height: "400px",
            }}
          />
        </ContentImg>
        <BoardBody data={data} />
        {data ? (
          data.isUser === "NOLOGIN" ? (
            ""
          ) : (
            <CommentWrite
              edit={false}
              editContent={null}
              boardId={boardId}
              setComments={setComments}
              commentId={null}
            />
          )
        ) : (
          ""
        )}
        <Comments
          boardId={boardId}
          comments={comments ? comments : ""}
          commentPage={commentPage}
          setCommentPage={setCommentPage}
          setComments={setComments}
        />
      </Outside>
    </>
  );
};

export default BoardDetails;
