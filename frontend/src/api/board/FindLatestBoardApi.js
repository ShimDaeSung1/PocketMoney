import axios from "axios";
import { BACKEND_ADDRESS } from "./../../constant/ADDRESS";

function findLatestBoardAPi() {
  return axios.get(BACKEND_ADDRESS + "/").then((response) => response.data);
}

export default findLatestBoardAPi;
