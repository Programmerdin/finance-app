import { StatusBar } from "expo-status-bar";
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import { TextInput } from "react-native";

//save quiz type
export const storeQuizType = async (Quiz_Type, Quiz_Number_Stringified) => {
  try {
    await AsyncStorage.setItem(Quiz_Number_Stringified + "_Quiz_Type", Quiz_Type);
  } catch (e) {
    // saving error
    console.log("Error saving Quiz Type", e);
  }
};

//save quiz total questions
export const storeQuizTotalQuestions = async (Quiz_Total_Questions, Quiz_Number_Stringified) => {
  try {
    await AsyncStorage.setItem(Quiz_Number_Stringified + "_Quiz_Total_Questions", Quiz_Total_Questions);
  } catch (e) {
    // saving error
    console.log("Error saving Quiz Total Questions", e);
  }
};

//save quiz time and date
export const storeQuizTimeAndDate = async (Quiz_Time_And_Date, Quiz_Number_Stringified) => {
  try {
    await AsyncStorage.setItem(Quiz_Number_Stringified + "_Quiz_Time_And_Date", Quiz_Time_And_Date);
  } catch (e) {
    // saving error
    console.log("Error saving Quiz Time And Date", e);
  }
};

//save quiz time took to complete
export const storeQuizTimeTookToComplete = async (Quiz_Time_Took_To_Complete, Quiz_Number_Stringified) => {
  try {
    await AsyncStorage.setItem(Quiz_Number_Stringified + "_Quiz_Time_Took_To_Complete", Quiz_Time_Took_To_Complete);
  } catch (e) {
    // saving error
    console.log("Error saving Quiz Time Took To Complete", e);
  }
};

//save lastest quiz number that was saved
export const storeLatestQuizNumber = async (Quiz_Number_Stringified) => {
  try {
    await AsyncStorage.setItem("Last_Quiz_Number_Saved", Quiz_Number_Stringified);
  } catch (e) {
    // saving error
    console.log("Error saving last Quiz Number", e);
  }
};

export function storeQuizData_All(quiz_number, quiz_type, quiz_total_questions, quiz_time_n_date, time_took_to_complete) {
  let quiz_number_stringified = quiz_number.toString();

  //quiz type
  //1 = division quiz
  //2 = compounding quiz
  storeQuizType(quiz_type, quiz_number_stringified);
  storeQuizTotalQuestions(quiz_total_questions, quiz_number_stringified);
  storeQuizTimeAndDate(quiz_time_n_date, quiz_number_stringified);
  storeQuizTimeTookToComplete(time_took_to_complete, quiz_number_stringified);
  storeLatestQuizNumber(quiz_number_stringified);
}
