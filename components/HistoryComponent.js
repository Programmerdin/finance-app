import { StatusBar } from "expo-status-bar";
import { Alert, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import { TextInput, Dimensions, Image } from "react-native";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";
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

  const [formatted_quiz_time_and_date_array, set_formatted_quiz_time_and_date_array] = useState([]);

  //functions to run as soon as the app loads up
  useEffect(() => {
    //retrieve latest quiz number from storage
    retrieveLatestQuizNumber().then(async (value) => {
      let temp_quiz_type_array = [];
      let temp_quiz_total_questions_array = [];
      let temp_quiz_time_and_date_array = [];
      let temp_quiz_time_took_to_complete_array = [];

      //convert the retrieved value (it comes in string format) to a number format
      for (let i = 0; i < parseInt(value, 10); i++) {
        const retrieved_data = await retrievePastQuizData(i + 1);
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

      //format the time and date array
      let temp_formatted_quiz_time_and_date_array = [];
      for (let i = 0; i < temp_quiz_time_and_date_array.length; i++) {
        temp_formatted_quiz_time_and_date_array.push(temp_quiz_time_and_date_array[i].slice(5, 7));
      }
      set_formatted_quiz_time_and_date_array(temp_formatted_quiz_time_and_date_array);
      console.log(temp_formatted_quiz_time_and_date_array);
    });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* a TouchableOpacity titled quit */}
      <TouchableOpacity
        onPress={() => {
          //navigate to MainScreen
          navigation.navigate("MainPage");
        }}
      >
        <Image style={styles.home_icon} source={require("../assets/home_icon.png")} />
      </TouchableOpacity>

      <Text style={styles.chart_title}>Completion Time</Text>
      <LineChart
        data={{
          labels: formatted_quiz_time_and_date_array,
          datasets: [
            {
              data: quiz_time_took_to_complete_array,
            },
          ],
          // legend: ["time to complete"] // optional
        }}
        //starts the graph from 0 for y axis
        fromZero={true}
        yLabelsOffset={10}
        segments={10}
        width={Dimensions.get("window").width} // from react-native
        // width={340}
        height={500}
        // yAxisLabel="seconds "
        yAxisSuffix="s"
        yAxisInterval={10} // optional, defaults to 1
        chartConfig={{
          backgroundColor: "#121212",
          backgroundGradientFrom: "#121212",
          backgroundGradientTo: "#121212",
          decimalPlaces: 0, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "3",
            strokeWidth: "0",
            stroke: "#121212",
          },
        }}
        //bezier makes graphy lines curvy
        bezier
        style={{
          marginVertical: 8,
          marginRight: 20,
          // borderRadius: 16,
        }}
      />
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
  chart_title:{
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    marginTop:20,
    marginBottom: 20,

  },
  home_icon: {
    width: 40,
    height: 40,
  },
});
