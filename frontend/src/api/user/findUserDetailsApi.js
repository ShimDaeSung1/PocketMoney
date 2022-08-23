import axios from "axios";
import { BACKEND_ADDRESS } from "../../constant/ADDRESS";

function findUserDetailsApi(accesstoken) {
  const config = {
    headers: {
      "X-AUTH-TOKEN": accesstoken,
    },
  };

  return axios
    .get(BACKEND_ADDRESS + "/user", config)
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

export default findUserDetailsApi;
