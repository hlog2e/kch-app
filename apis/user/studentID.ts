import { apiAuthInstance } from "../instance";

export const postRegisterPhoto = async (formData: FormData) => {
  const { data } = await apiAuthInstance.post<unknown>(
    "/user/upload/idPhoto",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return data;
};

export const postRegisterBarCode = async (_barcode: string) => {
  const { data } = await apiAuthInstance.post<unknown>(
    "/user/register/barcode",
    {
      barcode: _barcode,
    }
  );

  return data;
};
