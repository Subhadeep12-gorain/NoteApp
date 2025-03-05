import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import HomeScreen from "./screens/HomeScreen"
import CategoryScreen from "./screens/CategoryScreen";
import NoteScreen from "./screens/NoteScreen";
import AddNotesScreen from "./screens/AddNoteScreen";
import SignupScreen from "./screens/SignupScreen";
import LoginScreen from "./screens/LoginScreen";
// import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";


const Stack = createStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState("LoginScreen");

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedIn = await AsyncStorage.getItem("loggedIn");
      if (loggedIn === "true") {
        setInitialRoute("HomeScreen");
      }
    };
    checkLoginStatus();
  }, []);

  return (

    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SignupScreen" component={SignupScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CategoryScreen" component={CategoryScreen} />
        <Stack.Screen name="NoteScreen" component={NoteScreen} />
        <Stack.Screen name="AddNotesScreen" component={AddNotesScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
