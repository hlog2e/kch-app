import { apiAuthInstance } from "../api";

export const getCommunities = async (offset) => {
  const limit = 5;

  const { data } = await apiAuthInstance.get("/community", {
    params: { limit, offset },
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
