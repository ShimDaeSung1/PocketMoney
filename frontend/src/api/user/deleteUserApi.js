import axios from "axios";
import { BACKEND_ADDRESS } from "../../constant/ADDRESS";
import { ACCESS_TOKEN } from "./../../constant/LocalStorage";

function deleteUserApi(accesstoken, navigate) {
  const config = {
    headers: {
      "X-AUTH-TOKEN": accesstoken,
    },
  };

  return axios
    .delete(BACKEND_ADDRESS + "/user", config)
    .then((response) => {
      if (response.status === 204) {
        alert("회원탈퇴가 완료되었습니다 :)");
        sessionStorage.removeItem(ACCESS_TOKEN);
        navigate("/");
      }
    })
    .catch((error) => {
      alert(error.response.data.message);
      return Promise.reject();
    });
}

export default deleteUserApi;
