import axios from "axios";
import { BACKEND_ADDRESS } from "./../../constant/ADDRESS";

function signUpApi(
  email,
  password,
  nickName,
  age,
  sex,
  city,
  userName,
  navigate
) {
  const body = {
    age: age,
    city: city,
    email: email,
    nickName: nickName,
    password: password,
    sex: sex,
    userName: userName,
  };

  axios
    .post(BACKEND_ADDRESS + "/login/signup", body)
    .then((response) => {
      if (response.status === 200) {
        alert("회원가입이 완료되었습니다");
        navigate("/login");
      }
    })
    .catch((error) => {
      alert(error.response.data.message);
      return Promise.reject();
    });
}

export default signUpApi;
