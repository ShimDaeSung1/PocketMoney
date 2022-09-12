import { BACKEND_ADDRESS } from "../../constant/ADDRESS";
import axios from "axios";

function addBoardWishApi(accesstoken, boardId) {
  if (!accesstoken) {
    alert("로그인이 필요한 서비스입니다.");
    return Promise.reject("토큰이 없음");
  }
  const body = {
    boardId: boardId,
  };
  const config = {
    headers: {
      "X-AUTH-TOKEN": accesstoken,
    },
  };
  axios
    .post(BACKEND_ADDRESS + "/wish", body, config)
    .then((response) => {
      if (response.status === 204) {
        return response.status;
      }
    })
    .catch((error) => {
      alert(error.response.data.message);
      return Promise.reject();
    });
}

export default addBoardWishApi;
