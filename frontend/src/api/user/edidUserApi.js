import axios from "axios";
import { BACKEND_ADDRESS } from "./../../constant/ADDRESS";

function edidUserApi(
  nickName,
  age,
  sex,
  city,
  password,
  newPassword,
  navigate,
  accesstoken
) {
  const config = {
    headers: {
      "X-AUTH-TOKEN": accesstoken,
    },
  };
  const body = {
    age: age,
    city: city,
    nickName: nickName,
    sex: sex,
    password: password,
    newPassword: newPassword,
  };

  axios
    .put(BACKEND_ADDRESS + "/user", body, config)
    .then((response) => {
      if (response.status === 204) {
        alert("내 정보가 수정되었습니다.");
        navigate("/");
      }
    })
    .catch((error) => {
      alert(error.response.data.message);
      return Promise.reject();
    });
}

export default edidUserApi;
