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
}

//retreieve latest quiz number that was saved
export const retrieveLatestQuizNumber = async () => {
  try {
    const latest_quiz_number = await AsyncStorage.getItem("Last_Quiz_Number_Saved");
    if (latest_quiz_number !== null) {
      // value previously stored
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

//retrieve past quiz data
export const retrievePastQuizData = async (quiz_number) => {
  let quiz_number_stringified = quiz_number.toString();

  // let quiz_type = "filler"
  // let quiz_total_questions = "filler"
  // let quiz_time_and_date = "filler"
  // let quiz_time_took_to_complete = "filler"

  let quiz_data_object = {}


  //quiz type
  //1 = division quiz
  //2 = compounding quiz
  try {
    const quiz_type = await AsyncStorage.getItem(quiz_number_stringified + "_Quiz_Type");
    if (quiz_type !== null) {
      //convert from string to number
      // quiz_type = parseInt(quiz_type, 10);
      // value previously stored
      quiz_data_object.quiz_type = quiz_type
    }
  } catch (e) {
    // error reading value
    console.log("Error reading quiz type", e);
  }

  //quiz total questions
  try {
    const quiz_total_questions = await AsyncStorage.getItem(quiz_number_stringified + "_Quiz_Total_Questions");
    if (quiz_total_questions !== null) {
      //convert from string to number
      // quiz_total_questions = parseInt(quiz_total_questions, 10);
      // value previously stored
      quiz_data_object.quiz_total_questions = quiz_total_questions

    }
  } catch (e) {
    // error reading value
    console.log("Error reading quiz total questions", e);
  }

  //quiz time and date
  try {
    const quiz_time_and_date = await AsyncStorage.getItem(quiz_number_stringified + "_Quiz_Time_And_Date");
    if (quiz_time_and_date !== null) {
      //convert from string to number
      // quiz_time_and_date = parseInt(quiz_time_and_date, 10);
      // value previously stored
      quiz_data_object.quiz_time_and_date = quiz_time_and_date

    }
  } catch (e) {
    // error reading value
    console.log("Error reading quiz time and date", e);
  }

  //quiz time took to complete
  try {
    const quiz_time_took_to_complete = await AsyncStorage.getItem(
      quiz_number_stringified + "_Quiz_Time_Took_To_Complete"
    );
    if (quiz_time_took_to_complete !== null) {
      //convert from string to number
      // quiz_time_took_to_complete = parseInt(quiz_time_took_to_complete, 10);
      // value previously stored
      quiz_data_object.quiz_time_took_to_complete = quiz_time_took_to_complete
    }
  } catch (e) {
    // error reading value
    console.log("Error reading quiz time took to complete", e);
  }


  return quiz_data_object
};
