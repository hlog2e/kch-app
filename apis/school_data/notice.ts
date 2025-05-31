import { apiInstance } from "../instance";

export const getNotices = async ({ skip }: { skip: number }) => {
  const { data } = await apiInstance.get<unknown>("/notice", {
    params: { limit: 10, skip },
  });

  return data;
};

export const getNoticeDetail = async ({ noticeId }: { noticeId: string }) => {
  const { data } = await apiInstance.get<unknown>("/notice/detail", {
    params: { noticeId },
  });
  return data;
};
