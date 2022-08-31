import axios from "axios";
import { BACKEND_ADDRESS } from "./../../constant/ADDRESS";

function findLocalBoardListApi(search, accesstoken, num) {
  const config = {
    headers: {
      "X-AUTH-TOKEN": accesstoken,
    },
  };
  return axios
    .get(BACKEND_ADDRESS + "/listCity/" + search + "/" + num)
    .then((response) => response.data)
    .catch((error) => {
      alert(error.response.data.message);
    });
}

export default findLocalBoardListApi;
