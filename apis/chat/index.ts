import type { ChatMessage, ChatRoom, ChatUser } from "../../src/types/chat";

const ME: ChatUser = {
  id: "me",
  name: "나",
  role: "undergraduate",
  studentNumberMasked: "2학년 3반 12번",
};

const USERS: ChatUser[] = [
  {
    id: "u-jiwoo",
    name: "김지우",
    role: "undergraduate",
    studentNumberMasked: "2학년 1반 08번",
    profilePhoto: "https://i.pravatar.cc/120?img=11",
  },
  {
    id: "u-minseo",
    name: "이민서",
    role: "undergraduate",
    studentNumberMasked: "1학년 4반 21번",
    profilePhoto: "https://i.pravatar.cc/120?img=20",
  },
  {
    id: "u-hyun",
    name: "박서현",
    role: "undergraduate",
    studentNumberMasked: "3학년 2반 05번",
    profilePhoto: "https://i.pravatar.cc/120?img=32",
  },
  {
    id: "t-choi",
    name: "최민준 선생님",
    role: "teacher",
    studentNumberMasked: "교직원",
    profilePhoto: "https://i.pravatar.cc/120?img=56",
  },
];

let rooms: ChatRoom[] = [
  {
    id: "room-jiwoo",
    type: "dm",
    title: "김지우",
    participants: [ME, USERS[0]],
    lastMessage: {
      text: "오늘 동아리 회의 몇 시에 시작해?",
      createdAt: new Date(Date.now() - 1000 * 60 * 11).toISOString(),
      senderName: "김지우",
    },
    unreadCount: 2,
    updatedAt: new Date(Date.now() - 1000 * 60 * 11).toISOString(),
  },
  {
    id: "room-study",
    type: "group",
    title: "2학년 수행평가 스터디",
    participants: [ME, USERS[0], USERS[1], USERS[2]],
    lastMessage: {
      text: "자료 정리한 거 채팅방에 올려둘게",
      createdAt: new Date(Date.now() - 1000 * 60 * 54).toISOString(),
      senderName: "박서현",
    },
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 1000 * 60 * 54).toISOString(),
  },
  {
    id: "room-teacher",
    type: "dm",
    title: "최민준 선생님",
    participants: [ME, USERS[3]],
    lastMessage: {
      text: "확인했습니다. 내일 아침에 교무실로 오세요.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      senderName: "최민준 선생님",
    },
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
];

let messagesByRoom: Record<string, ChatMessage[]> = {
  "room-jiwoo": [
    {
      id: "m-1",
      roomId: "room-jiwoo",
      sender: USERS[0],
      type: "text",
      text: "오늘 동아리 회의 몇 시에 시작해?",
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      isMine: false,
    },
    {
      id: "m-2",
      roomId: "room-jiwoo",
      sender: ME,
      type: "text",
      text: "점심시간 끝나고 5교시 전에 모이면 될 것 같아.",
      createdAt: new Date(Date.now() - 1000 * 60 * 13).toISOString(),
      isMine: true,
      readBy: [{ userId: USERS[0].id, name: USERS[0].name, readAt: new Date().toISOString() }],
    },
    {
      id: "m-3",
      roomId: "room-jiwoo",
      sender: USERS[0],
      type: "text",
      text: "오케이. 준비물은 내가 챙겨갈게.",
      createdAt: new Date(Date.now() - 1000 * 60 * 11).toISOString(),
      isMine: false,
      replyTo: { id: "m-2", text: "점심시간 끝나고 5교시 전에 모이면 될 것 같아.", senderName: "나" },
    },
  ],
  "room-study": [
    {
      id: "m-4",
      roomId: "room-study",
      sender: USERS[1],
      type: "text",
      text: "수행평가 발표 순서 정해졌어?",
      createdAt: new Date(Date.now() - 1000 * 60 * 70).toISOString(),
      isMine: false,
    },
    {
      id: "m-5",
      roomId: "room-study",
      sender: USERS[2],
      type: "text",
      text: "자료 정리한 거 채팅방에 올려둘게",
      createdAt: new Date(Date.now() - 1000 * 60 * 54).toISOString(),
      isMine: false,
    },
  ],
  "room-teacher": [
    {
      id: "m-6",
      roomId: "room-teacher",
      sender: ME,
      type: "text",
      text: "선생님, 진로 상담 신청 가능할까요?",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      isMine: true,
    },
    {
      id: "m-7",
      roomId: "room-teacher",
      sender: USERS[3],
      type: "text",
      text: "확인했습니다. 내일 아침에 교무실로 오세요.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      isMine: false,
    },
  ],
};

const wait = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getChatRooms(): Promise<ChatRoom[]> {
  await wait();
  return [...rooms].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export async function getChatMessages(roomId: string): Promise<ChatMessage[]> {
  await wait();
  return messagesByRoom[roomId] ? [...messagesByRoom[roomId]] : [];
}

export async function getChatRoom(roomId: string): Promise<ChatRoom | null> {
  await wait();
  return rooms.find((room) => room.id === roomId) ?? null;
}

export async function searchChatUsers(query: string): Promise<ChatUser[]> {
  await wait(120);
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  return USERS.filter((user) => {
    const number = user.studentNumberMasked ?? "";
    return (
      user.name.toLowerCase().includes(normalized) ||
      number.toLowerCase().includes(normalized)
    );
  });
}

export async function createChatRoom(participantIds: string[]): Promise<ChatRoom> {
  await wait();
  const participants = [
    ME,
    ...USERS.filter((user) => participantIds.includes(user.id)),
  ];
  const type = participants.length > 2 ? "group" : "dm";
  const now = new Date().toISOString();
  const existingDm =
    type === "dm"
      ? rooms.find(
          (room) =>
            room.type === "dm" &&
            room.participants.some((user) => user.id === participantIds[0])
        )
      : undefined;

  if (existingDm) return existingDm;

  const room: ChatRoom = {
    id: `room-${Date.now()}`,
    type,
    title:
      type === "dm"
        ? participants.find((user) => user.id !== ME.id)?.name ?? "새 채팅"
        : participants
            .filter((user) => user.id !== ME.id)
            .map((user) => user.name.replace(" 선생님", ""))
            .join(", "),
    participants,
    unreadCount: 0,
    updatedAt: now,
  };

  rooms = [room, ...rooms];
  messagesByRoom[room.id] = [];
  return room;
}

export async function sendMessage({
  roomId,
  text,
  replyTo,
}: {
  roomId: string;
  text: string;
  replyTo?: ChatMessage["replyTo"];
}): Promise<ChatMessage> {
  await wait(80);
  const now = new Date().toISOString();
  const message: ChatMessage = {
    id: `m-${Date.now()}`,
    roomId,
    sender: ME,
    type: "text",
    text,
    createdAt: now,
    isMine: true,
    replyTo,
  };

  messagesByRoom[roomId] = [...(messagesByRoom[roomId] ?? []), message];
  rooms = rooms.map((room) =>
    room.id === roomId
      ? {
          ...room,
          lastMessage: { text, createdAt: now, senderName: ME.name },
          updatedAt: now,
        }
      : room
  );
  return message;
}
