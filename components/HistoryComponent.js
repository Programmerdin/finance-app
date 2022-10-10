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
  const [quiz_type_array, set_quiz_type_array] = useState([]);
  const [quiz_total_questions_array, set_quiz_total_questions_array] = useState([]);
  const [quiz_time_and_date_array, set_quiz_time_and_date_array] = useState([]);
  const [quiz_time_took_to_complete_array, set_quiz_time_took_to_complete_array] = useState([]);

  //functions to run as soon as the app loads up
  useEffect(() => {
    //retrieve latest quiz number from storage
    retrieveLatestQuizNumber().then(async (value) => {
      let temp_quiz_type_array = [] 
      let temp_quiz_total_questions_array = []
      let temp_quiz_time_and_date_array = []
      let temp_quiz_time_took_to_complete_array = []

      //convert the retrieved value (it comes in string format) to a number format
      for (let i = 0; i < parseInt(value, 10); i++) {
        const retrieved_data = await retrievePastQuizData(i+1);
        console.log(retrieved_data);
        temp_quiz_type_array.push(retrieved_data.quiz_type);
        temp_quiz_total_questions_array.push(retrieved_data.quiz_total_questions);
        temp_quiz_time_and_date_array.push(retrieved_data.quiz_time_and_date);
        temp_quiz_time_took_to_complete_array.push(retrieved_data.quiz_time_took_to_complete);
      }

      set_quiz_type_array(temp_quiz_type_array);
      set_quiz_total_questions_array(temp_quiz_total_questions_array);
      set_quiz_time_and_date_array(temp_quiz_time_and_date_array);
      set_quiz_time_took_to_complete_array(temp_quiz_time_took_to_complete_array);
    });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={{ color: "white" }}>History Component</Text>
      <Text style={{ color: "white" }}>{quiz_time_took_to_complete_array}</Text>

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
