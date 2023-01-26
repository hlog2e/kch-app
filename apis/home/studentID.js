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

export const postRegisterBarCode = async (_barcode) => {
  const { data } = await apiAuthInstance.post("/user/register/barcode", {
    barcode: _barcode,
  });

  return data;
};
