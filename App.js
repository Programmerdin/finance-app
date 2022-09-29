import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DivisionQuizScreen from './Screens/DivisionQuizScreen';
import MainPageScreen from './Screens/MainPageScreen';
import CompoundingQuizScreen from './Screens/CompoundingQuizScreen';


const Stack = createNativeStackNavigator();

const App =() => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        //below gets rid of stupid animation when switching screens
        screenOptions={{ animation: 'none', headerShown: false }}
      >
        <Stack.Screen name="MainPage" component={MainPageScreen} />
        <Stack.Screen name="DivisionQuiz" component={DivisionQuizScreen} />
        <Stack.Screen name="CompoundingQuiz" component={CompoundingQuizScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
