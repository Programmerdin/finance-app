import { StatusBar } from "expo-status-bar";
import { Alert, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import { TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

//save latest quiz number that was saved
export const storeLatestQuizNumber = async (Quiz_Number_Stringified) => {
  try {
    await AsyncStorage.setItem("Last_Quiz_Number_Saved", Quiz_Number_Stringified);
  } catch (e) {
    // saving error
    console.log("Error saving last Quiz Number", e);
  }
};

export function storeQuizData_All(
  quiz_number,
  quiz_type,
  quiz_total_questions,
  quiz_time_n_date,
  time_took_to_complete
) {
  let quiz_number_stringified = quiz_number.toString();

  //quiz type
  //1 = division quiz
  //2 = compounding quiz
  storeQuizType(quiz_type, quiz_number_stringified);
  storeQuizTotalQuestions(quiz_total_questions, quiz_number_stringified);
  storeQuizTimeAndDate(quiz_time_n_date, quiz_number_stringified);
  storeQuizTimeTookToComplete(time_took_to_complete, quiz_number_stringified);
  storeLatestQuizNumber(quiz_number_stringified);
  console.log("function ran");
}

//retreieve latest quiz number that was saved
export const retrieveLatestQuizNumber = async () => {
  try {
    const latest_quiz_number = await AsyncStorage.getItem("Last_Quiz_Number_Saved");
    if (latest_quiz_number !== null) {
      // value previously stored
      console.log("Last Quiz Number Saved: ", latest_quiz_number);
      return latest_quiz_number;
      //return 0 if latest quiz number is null (meaning no quiz has been saved before)
    } else {
      return 0;
    }
  } catch (e) {
    // error reading value
    console.log("Error reading last quiz number saved", e);
  }
};

//retreieve all the data from past quizes
export const retrieveAllQuizData = async (Last_Quiz_Number_In_Number_Format) => {
  try {
    const quiz_number_array = [];
    const quiz_type_array = [];
    const quiz_total_questions_array = [];
    const quiz_time_n_date_array = [];
    const quiz_time_took_to_complete_array = [];

    
    //create all the necessary cells in the array so i can push the data into them without having to worry about async await
    for (let i = 0; i < Last_Quiz_Number_In_Number_Format; i++) {
      quiz_number_array.push("filler");
      quiz_type_array.push("filler");
      quiz_total_questions_array.push("filler");
      quiz_time_n_date_array.push("filler");
      quiz_time_took_to_complete_array.push("filler");
    }

  } catch (e) {}
};
