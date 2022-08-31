import { BACKEND_ADDRESS } from "../../constant/ADDRESS";
import axios from "axios";

function editBoardApi(
  title,
  content,
  area,
  dayOfWeek,
  year,
  month,
  day,
  hour,
  minute,
  pay,
  boardId,
  accessToken,
  navigate
) {
  const config = {
    headers: {
      "X-AUTH-TOKEN": accessToken,
    },
  };
  const body = {
    title: title,
    content: content,
    area: area,
    dayOfWeek: dayOfWeek,
    date: [year, month, day, hour, minute],
    pay: pay,
  };
  return axios
    .put(BACKEND_ADDRESS + "/boards/" + boardId, body, config)
    .then((response) => {
      if (response.status === 200) {
        alert("수정이 완료되었습니다");
        navigate("/");
      }
    })
    .catch((error) => {
      alert(error.response.data.message);
    });
}

export default editBoardApi;
