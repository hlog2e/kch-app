import { apiInstance } from "../api";

export const getNotices = async ({ skip }) => {
  const { data } = await apiInstance.get("/notice", {
    params: { limit: 10, skip: skip },
  });

  return data;
};

export const getNoticeDetail = async ({ noticeId }) => {
  const { data } = await apiInstance.get("/notice/detail", {
    params: { noticeId: noticeId },
  });
  return data;
};
