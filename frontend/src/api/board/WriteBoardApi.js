import { BACKEND_ADDRESS } from "../../constant/ADDRESS";
import axios from "axios";

function writeBoardApi(
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
  accessToken,
  navigate,
  bodyFormData
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

  bodyFormData.append(
    "board",
    new Blob([JSON.stringify(body)], {
      type: "application/json",
    })
  );
  return axios
    .post(BACKEND_ADDRESS + "/boards/", bodyFormData, config)
    .then((response) => {
      if (response.status === 200) {
        alert("작성이 완료되었습니다");
        navigate("/");
      }
    })
    .catch((error) => {
      alert(error.response.data.message);
    });
}

export default writeBoardApi;
