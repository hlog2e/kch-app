import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CommunityScreen from "../../../screens/main/Community/Community";
import AccessDeniedScreen from "../../../screens/main/Community/AccessDeniedScreen";
import { useContext } from "react";
import { UserContext } from "../../../../context/UserContext";

const Stack = createNativeStackNavigator();

export default function CommunityStack() {
  const { user } = useContext(UserContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user.type === "undergraduate" ? (
        <Stack.Screen name="CommunityScreen" component={CommunityScreen} />
      ) : (
        <Stack.Screen
          name="AccessDeniedScreen"
          component={AccessDeniedScreen}
        />
      )}
    </Stack.Navigator>
  );
}
