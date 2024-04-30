import { apiAuthInstance } from "../instance";

export const getCommunityBoards = async () => {
  const { data } = await apiAuthInstance.get("/community/board");
  return data;
};

export const getCommunityBoardFixeds = async () => {
  const { data } = await apiAuthInstance.get("/community/board/fixed");
  return data;
};

export const postCommunityBoardFix = async ({ boardId }) => {
  const { data } = await apiAuthInstance.post("/community/board/fix", {
    boardId,
  });
};

export const postCommunityBoardUnFix = async ({ boardId }) => {
  const { data } = await apiAuthInstance.post("/community/board/unFix", {
    boardId,
  });
};

export const getCommunities = async ({ offset, boardId }) => {
  const limit = 5;

  const { data } = await apiAuthInstance.get("/community", {
    params: { limit, offset, boardId },
  });

  return data;
};

export const getBlockedUsers = async () => {
  const { data } = await apiAuthInstance.get("/community/blockedUsers");

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
    isAnonymous: props.isAnonymous,
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
