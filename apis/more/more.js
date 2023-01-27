import { apiAuthInstance } from "../api";

export const postModifyUserInfo = async (props) => {
  const { data } = await apiAuthInstance.post("/user/modify/userInfo", {
    grade: props.grade,
    class: props.class,
    number: props.number,
  });
  return data;
};

export const getCommunitiesWrittenByMe = async () => {
  const { data } = await apiAuthInstance.get("/community/mine");

  return data;
};
