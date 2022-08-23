import axios from "axios";
import { BACKEND_ADDRESS } from "../../constant/ADDRESS";

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
        navigate("/");
      }
    })
    .catch((error) => {
      alert(error.response.data.errorMessage);
      return Promise.reject();
    });
}

export default deleteUserApi;
