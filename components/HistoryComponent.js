import { StatusBar } from "expo-status-bar";
import { Alert, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import { TextInput } from "react-native";
import {
  storeQuizType,
  storeQuizTotalQuestions,
  storeQuizTimeAndDate,
  storeQuizTimeTookToComplete,
  storeLatestQuizNumber,
  storeQuizData_All,
  retrieveLatestQuizNumber,
  retrievePastQuizData,
} from "./StorageFunctions";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HistoryComponent({ navigation, route }) {
  const [latestQuizNumber, setLatestQuizNumber] = useState("0");

  const quiz_number_array = [];
  const quiz_type_array = [];
  const quiz_total_questions_array = [];
  const quiz_time_n_date_array = [];
  const quiz_time_took_to_complete_array = [];

  //functions to run as soon as the app loads up
  useEffect(() => {
    //retrieve latest quiz number from storage
    retrieveLatestQuizNumber().then(async (value) => {
      //set the State from the retrieved value
      //convert the retrieved value (it comes in string format) to a number format
      setLatestQuizNumber(parseInt(value, 10));

      for (let i = 0; i < parseInt(value, 10); i++) {
        const hi = await retrievePastQuizData(parseInt(value, 10));
        console.log(hi);
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={{ color: "white" }}>History Component</Text>

      {/* a TouchableOpacity titled quit */}
      <TouchableOpacity
        style={styles.quit_button}
        onPress={() => {
          //navigate to MainScreen
          navigation.navigate("MainPage");
        }}
      >
        <Text style={styles.button_text}>Quit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "center",
  },
  quit_button: {
    width: 100,
    height: 50,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
});
