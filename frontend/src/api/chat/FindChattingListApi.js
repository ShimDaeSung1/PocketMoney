import axios from "axios";
import { BACKEND_ADDRESS } from "../../constant/ADDRESS";

function findChattingListApi(accesstoken) {
  const config = {
    headers: {
      "X-AUTH-TOKEN": accesstoken,
    },
  };

  return axios
    .get(BACKEND_ADDRESS + "/room/list", config)
    .then((response) => {
      if (response.status === 200) {
        return response.data;
      }
    })
    .catch((error) => {
      alert(error.response.data.errorMessage);
      return Promise.reject();
    });
}

export default findChattingListApi;
