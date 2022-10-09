import { BACKEND_ADDRESS } from "../../constant/ADDRESS";
import axios from "axios";

function deleteChatRoomApi(roomId, accesstoken) {
  if (!accesstoken) {
    alert("로그인이 필요한 서비스입니다.");
    return Promise.reject("토큰이 없음");
  }
  const config = {
    headers: {
      "X-AUTH-TOKEN": accesstoken,
    },
  };
  axios
    .delete(BACKEND_ADDRESS + "/room/" + roomId, config)
    .then((response) => {
      if (response.status === 204) {
        alert("채팅방이 삭제되었습니다 :)");
        window.location.href = "/chat";
      }
    })
    .catch((error) => {
      alert(error.response.data.message);
      return Promise.reject();
    });
}

export default deleteChatRoomApi;
