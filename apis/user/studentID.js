import { apiAuthInstance } from "../instance";

export const postRegisterPhoto = async (formData) => {
  const { data } = await apiAuthInstance.post(
    "/user/upload/idPhoto",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return data;
};

export const postRegisterBarCode = async (_barcode) => {
  const { data } = await apiAuthInstance.post("/user/register/barcode", {
    barcode: _barcode,
  });

  return data;
};
