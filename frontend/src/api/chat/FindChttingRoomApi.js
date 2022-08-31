import axios from "axios";
import { BACKEND_ADDRESS } from "../../constant/ADDRESS";

function findChttingRoomApi(roomId, accesstoken) {
  const config = {
    headers: {
      "X-AUTH-TOKEN": accesstoken,
    },
  };

  return axios
    .get(BACKEND_ADDRESS + "/room/" + roomId, config)
    .then((response) => {
      if (response.status === 200) {
        return response.data;
      }
    })
    .catch((error) => {
      alert(error.response.data.message);
      return Promise.reject();
    });
}

export default findChttingRoomApi;
