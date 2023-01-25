import { apiAuthInstance } from "../api";

export const postModifyUserInfo = async (props) => {
  const { data } = await apiAuthInstance.post("/auth/modify/userInfo", {
    grade: props.grade,
    class: props.class,
    number: props.number,
  });
  return data;
};
