import { apiAuthInstance } from "../instance";

// -------- Types ---------
export interface BoardIdPayload {
  boardId: string;
}

export interface PaginationParams {
  offset: number;
  category?: string;
}

export interface BlockUserPayload {
  blockUserId: string;
}

export interface ReportPayload {
  postId: string;
}

export interface ReportCommentPayload {
  commentId: string;
}

export interface PostCommentPayload {
  comment: string;
  communityId: string;
  isAnonymous?: boolean;
}

export interface DeleteCommentPayload {
  commentId: string;
  communityId: string;
}

export interface CommunityLikePayload {
  communityId: string;
}

export interface CommunityDeletePayload {
  communityId: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  color: string;
}

export interface CategoriesResponse {
  status: number;
  message: string;
  categories: CategoryItem[];
}

// // ------- API calls -------
// export const getCommunityBoards = async () => {
//   const { data } = await apiAuthInstance.get<unknown>("/community/board");
//   return data;
// };

// export const getCommunityBoardFixeds = async () => {
//   const { data } = await apiAuthInstance.get<unknown>("/community/board/fixed");
//   return data;
// };

// export const postCommunityBoardFix = async ({ boardId }: BoardIdPayload) => {
//   const { data } = await apiAuthInstance.post<unknown>("/community/board/fix", {
//     boardId,
//   });
//   return data;
// };

// export const postCommunityBoardUnFix = async ({ boardId }: BoardIdPayload) => {
//   const { data } = await apiAuthInstance.post<unknown>(
//     "/community/board/unFix",
//     {
//       boardId,
//     }
//   );
//   return data;
// };

export const getCommunities = async ({
  offset,
  category,
}: PaginationParams) => {
  const limit = 5;

  const { data } = await apiAuthInstance.get<unknown>("/v2/community", {
    params: { limit, offset, category },
  });

  return data;
};

export const getBlockedUsers = async () => {
  const { data } = await apiAuthInstance.get<unknown>(
    "/v2/community/blockedUsers"
  );
  return data;
};

export const postBlockUser = async ({ blockUserId }: BlockUserPayload) => {
  const { data } = await apiAuthInstance.post<unknown>(
    "/v2/community/block_user",
    {
      blockUserId,
    }
  );
  return data;
};

export const postReportCommunityItem = async ({ postId }: ReportPayload) => {
  const { data } = await apiAuthInstance.post<unknown>("/v2/community/report", {
    postId,
  });
  return data;
};

export const postReportComment = async ({
  commentId,
}: ReportCommentPayload) => {
  const { data } = await apiAuthInstance.post<unknown>(
    "/v2/community/report/comment",
    {
      commentId,
    }
  );
  return data;
};

export const postCommunity = async (formData: FormData) => {
  const { data } = await apiAuthInstance.post<unknown>(
    "/v2/community",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return data;
};

export const getCommunityDetail = async (_id: string) => {
  const { data } = await apiAuthInstance.get<unknown>("/v2/community/detail", {
    params: { id: _id },
  });
  return data;
};

export const postComment = async ({
  comment,
  communityId,
  isAnonymous,
}: PostCommentPayload) => {
  const { data } = await apiAuthInstance.post<unknown>(
    "/v2/community/comment",
    {
      comment,
      communityId,
      isAnonymous,
    }
  );
  return data;
};

export const deleteComment = async ({
  commentId,
  communityId,
}: DeleteCommentPayload) => {
  const { data } = await apiAuthInstance.delete<unknown>(
    "/v2/community/comment",
    {
      data: { commentId, communityId },
    }
  );
  return data;
};

export const addLike = async ({ communityId }: CommunityLikePayload) => {
  const { data } = await apiAuthInstance.post<unknown>("/v2/community/like", {
    communityId,
  });
  return data;
};

export const deleteLike = async ({ communityId }: CommunityLikePayload) => {
  const { data } = await apiAuthInstance.delete<unknown>("/v2/community/like", {
    data: { communityId },
  });
  return data;
};

export const communityDelete = async ({
  communityId,
}: CommunityDeletePayload) => {
  const { data } = await apiAuthInstance.delete<unknown>("/v2/community", {
    data: { communityId },
  });
  return data;
};

export const getCommunityCategories = async (): Promise<CategoriesResponse> => {
  const { data } = await apiAuthInstance.get<CategoriesResponse>(
    "/v2/community/categories"
  );
  return data;
};
