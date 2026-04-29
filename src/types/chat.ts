export type ChatRole = "undergraduate" | "teacher";

export type ChatRoomType = "dm" | "group";

export type ChatMessageType = "text" | "image" | "system";

export interface ChatUser {
  id: string;
  name: string;
  role: ChatRole;
  studentNumberMasked?: string;
  profilePhoto?: string;
}

export interface ChatMessagePreview {
  text: string;
  createdAt: string;
  senderName?: string;
}

export interface ChatRoom {
  id: string;
  type: ChatRoomType;
  title: string;
  participants: ChatUser[];
  lastMessage?: ChatMessagePreview;
  unreadCount: number;
  updatedAt: string;
}

export interface ChatReplyPreview {
  id: string;
  text: string;
  senderName: string;
}

export interface ChatReadReceipt {
  userId: string;
  name: string;
  profilePhoto?: string;
  readAt: string;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  sender: ChatUser;
  type: ChatMessageType;
  text: string;
  createdAt: string;
  isMine: boolean;
  replyTo?: ChatReplyPreview;
  readBy?: ChatReadReceipt[];
}
