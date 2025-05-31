import { apiAuthInstance } from "../instance";

export const postRegisterProfilePhoto = async (formData: FormData) => {
  const { data } = await apiAuthInstance.post<unknown>(
    "/user/upload/profilePhoto",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return data;
};

export const deleteProfilePhoto = async () => {
  const { data } = await apiAuthInstance.post<unknown>(
    "/user/delete/profilePhoto"
  );

  return data;
};

export const postEditUserProfile = async ({
  name,
  desc,
}: {
  name: string;
  desc: string;
}) => {
  const { data } = await apiAuthInstance.post<unknown>("/user/editProfile", {
    name,
    desc,
  });
  return data;
};
