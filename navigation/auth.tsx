import React from "react";
import "react-native-gesture-handler";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/AuthScreens/Login";
import Signup from "../screens/AuthScreens/SignUp";
import ResetPassword from "../screens/AuthScreens/ResetPassword";
import { theme } from "../theme/core/theme";
//import OnboardComponent from "../screens/auth/onboarding/OnboardComponent";

const Stack = createNativeStackNavigator();
const Auth = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { 
          backgroundColor: theme.colors.background,
        },
        headerTintColor: "#000",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      {/* <Stack.Screen
        name="Onboarding"
        component={OnboardComponent}
        options={{
          headerShown: false,
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      /> */}
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      />
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{
          headerShown: false,
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={{
          headerShown: false,
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      />
      {/*    <Stack.Screen
                name="Splash"
                component={Splash}
                options={{ headerShown: false }}
            /> */}
    </Stack.Navigator>
  );
};

export default Auth;
