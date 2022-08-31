import axios from "axios";
import { BACKEND_ADDRESS } from "./../../constant/ADDRESS";
import { ACCESS_TOKEN } from "./../../constant/LocalStorage";

function loginApi(email, password, navigate) {
  const body = {
    email: email,
    password: password,
  };

  axios
    .post(BACKEND_ADDRESS + "/login/", body)
    .then((response) => {
      if (response.status === 200) {
        alert("로그인이 완료되었습니다.");
        sessionStorage.setItem(ACCESS_TOKEN, response.data.data.token);
        navigate("/");
      }
    })
    .catch((error) => {
      alert(error.response.data.message);
    });
}

export default loginApi;
