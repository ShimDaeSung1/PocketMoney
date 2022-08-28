import axios from "axios";
import { BACKEND_ADDRESS } from "../../constant/ADDRESS";

function createRoomApi(boardId, name, accesstoken) {
  const config = {
    headers: {
      "X-AUTH-TOKEN": accesstoken,
    },
  };
  const body = {
    boardId: boardId,
    name: name,
  };
  return axios
    .post(BACKEND_ADDRESS + "/room/", body, config)
    .then((response) => {
      if (response.status === 204) {
        alert("채팅방이 생성되었습니다.");
        return response.data;
      }
    })
    .catch((error) => {
      alert(error.response.data.message);
      return Promise.reject();
    });
}

export default createRoomApi;
