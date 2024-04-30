import { apiAuthInstance } from "../instance";

export const postRegisterProfilePhoto = async (formData) => {
  const { data } = await apiAuthInstance.post(
    "/user/upload/profilePhoto",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return data;
};

export const deleteProfilePhoto = async () => {
  const { data } = await apiAuthInstance.post("/user/delete/profilePhoto");

  return data;
};

export const postEditUserProfile = async ({ name, desc }) => {
  const { data } = await apiAuthInstance.post("/user/editProfile", {
    name: name,
    desc: desc,
  });
  return data;
};
