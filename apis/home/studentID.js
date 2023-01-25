import { apiAuthInstance } from "../api";

export const getUserInfo = async (props) => {
  const { data } = await apiAuthInstance.get("/user/info");
  return data;
};

export const postRegisterPhoto = async (formData) => {
  const { data } = await apiAuthInstance.post("/user/upload/photo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data;
};
