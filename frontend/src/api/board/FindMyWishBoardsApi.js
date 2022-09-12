import axios from "axios";
import { BACKEND_ADDRESS } from "./../../constant/ADDRESS";

function findMyWishBoardApi(accesstoken) {
  const config = {
    headers: {
      "X-AUTH-TOKEN": accesstoken,
    },
  };
  return axios
    .get(BACKEND_ADDRESS + "/wish/list", config)
    .then((response) => response.data)
    .catch((error) => {
      if (error.response.status === 404) {
        return null;
      }
    });
}

export default findMyWishBoardApi;
