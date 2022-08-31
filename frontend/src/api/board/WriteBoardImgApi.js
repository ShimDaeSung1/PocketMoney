import { BACKEND_ADDRESS } from "../../constant/ADDRESS";
import axios from "axios";

function writeBoardImgApi(formData, accesstoken) {
  const config = {
    headers: {
      "X-AUTH-TOKEN": accesstoken,
    },
  };

  return axios
    .post(BACKEND_ADDRESS + "/image", formData, config)
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

export default writeBoardImgApi;
