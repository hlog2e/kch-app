import { apiAuthInstance } from "../api";

export const getCommunities = async (offset) => {
  const limit = 5;

  const { data } = await apiAuthInstance.get("/community", {
    params: { limit, offset },
  });

  return data;
};

export const getBlockedUsers = async () => {
  const { data } = await apiAuthInstance.get("/community/blocked_users");

  return data;
};

export const postBlockUser = async (props) => {
  const { data } = await apiAuthInstance.post("/community/block_user", {
    blockUserId: props.blockUserId,
  });

  return data;
};

export const postReportCommunityItem = async (props) => {
  const { data } = await apiAuthInstance.post("/community/report", {
    postId: props.postId,
  });

  return data;
};

export const postReportComment = async (props) => {
  const { data } = await apiAuthInstance.post("/community/report/comment", {
    postId: props.postId,
    commentId: props.commentId,
  });

  return data;
};

export const postCommunity = async (formData) => {
  const { data } = await apiAuthInstance.post("/community", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data;
};

export const getCommunityDetail = async (_id) => {
  const { data } = await apiAuthInstance.get("/community/detail", {
    params: { id: _id },
  });

  return data;
};

export const postComment = async (props) => {
  const { data } = await apiAuthInstance.post("/community/comment", {
    comment: props.comment,
    communityId: props.communityId,
  });

  return data;
};

export const deleteComment = async (props) => {
  const { data } = await apiAuthInstance.delete("/community/comment", {
    data: {
      commentId: props.commentId,
      communityId: props.communityId,
    },
  });

  return data;
};

export const addLike = async (props) => {
  const { data } = await apiAuthInstance.post("/community/like", {
    communityId: props.communityId,
  });

  return data;
};

export const deleteLike = async (props) => {
  const { data } = await apiAuthInstance.delete("/community/like", {
    data: { communityId: props.communityId },
  });

  return data;
};

export const communityDelete = async (props) => {
  const { data } = await apiAuthInstance.delete("/community", {
    data: { communityId: props.communityId },
  });

  return data;
};
