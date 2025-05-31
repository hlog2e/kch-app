import { NavigatorScreenParams } from "@react-navigation/native";

export type RootStackParamList = {
  Main: NavigatorScreenParams<MainTabParamList>;
  Auth: undefined;
  CommunityDetailScreen: { id: string };
  CommunityPOSTScreen: undefined;
  FeedPOSTScreen: undefined;
};

export type MainTabParamList = {
  HomeStack: NavigatorScreenParams<HomeStackParamList>;
  FeedStack: NavigatorScreenParams<FeedStackParamList>;
  CommunityStack: NavigatorScreenParams<CommunityStackParamList>;
  MoreStack: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  MealScreen: undefined;
  TimetableScreen: undefined;
  NewCalendarScreen: undefined;
  NoticeScreen: undefined;
  PhotoDetailScreen: { id: string };
  NoticeDetailScreen: { id: string };
  StudentID: undefined;
};

export type FeedStackParamList = {
  FeedScreen: undefined;
};

export type CommunityStackParamList = {
  CommunityScreen: undefined;
  BoardListScreen: { id: string };
  ListScreen: { id: string };
  AccessDeniedScreen: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Join: undefined;
  FirstRequestCode: undefined;
  SecondVerifyCode: undefined;
  FirstType: undefined;
  SecondNameAndYearInput: undefined;
  ThirdVerifyUndergraduate: undefined;
  ThridVerifyTeacher: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
