import axios from "axios";
import { BACKEND_ADDRESS } from "./../../constant/ADDRESS";

function findLocalBoardListApi(city, accesstoken, num) {
  const config = {
    headers: {
      "X-AUTH-TOKEN": accesstoken,
    },
  };
  console.log(city);
  return axios
    .get(BACKEND_ADDRESS + "/listCity/" + city + "/" + num)
    .then((response) => response.data)
    .catch((error) => {
      alert(error.response.data.message);
    });
}

export default findLocalBoardListApi;
