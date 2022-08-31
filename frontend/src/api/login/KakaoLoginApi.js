import axios from "axios";
import { BACKEND_ADDRESS } from "./../../constant/ADDRESS";
import { ACCESS_TOKEN } from "./../../constant/LocalStorage";

function kakaoLoginApi(code, navigate) {
  axios.post(BACKEND_ADDRESS + "/login/kakao?code=" + code).then((response) => {
    if (response.status === 200) {
      sessionStorage.setItem(ACCESS_TOKEN, response.data.jwtToken);
      if (response.data.isNew === true) {
        alert("기타 정보를 수정해주세요!");
        navigate("/mypage/edit");
      } else {
        navigate("/");
      }
    }
  });
}

export default kakaoLoginApi;
