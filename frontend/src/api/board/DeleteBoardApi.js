import { BACKEND_ADDRESS } from "../../constant/ADDRESS";
import axios from "axios";

function deleteBoardApi(boardId, accessToken, navigate) {
  if (!accessToken) {
    alert("로그인이 필요한 서비스입니다.");
    navigate("/login");
    return Promise.reject("토큰이 없음");
  }
  const config = {
    headers: {
      "X-AUTH-TOKEN": accessToken,
    },
  };
  axios
    .delete(BACKEND_ADDRESS + "/boards/" + boardId, config)
    .then((response) => {
      if (response.status === 200) {
        alert("글이 삭제되었습니다 :)");
        navigate("/");
      }
    })
    .catch((error) => {
      alert(error.response.data.message);
      return Promise.reject();
    });
}

export default deleteBoardApi;
