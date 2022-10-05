import axios from "axios";
import { BACKEND_ADDRESS } from "../../constant/ADDRESS";

function changeLikeApi(chatId, userId, like, accesstoken) {
  const config = {
    headers: {
      "X-AUTH-TOKEN": accesstoken,
    },
  };
  const body = {
    chatId: chatId,
    userId: userId,
    tf: like,
  };
  return axios
    .put(BACKEND_ADDRESS + "/user/kindscore", body, config)
    .then((response) => {
      if (response.status === 204) {
        return response.data;
      }
    })
    .catch((error) => {
      alert(error.response.data.message);
      return Promise.reject();
    });
}

export default changeLikeApi;
