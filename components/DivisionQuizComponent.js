import { StatusBar } from "expo-status-bar";
import { Alert, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import { TextInput, FlatList } from "react-native";
import {
  storeQuizType,
  storeQuizTotalQuestions,
  storeQuizTimeAndDate,
  storeQuizTimeTookToComplete,
  storeLatestQuizNumber,
  storeQuizData_All,
  retrieveLatestQuizNumber,
} from "./StorageFunctions";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DivisionQuizComponent({ navigation, route }) {
  const [randomNumber1, setRandomNumber1] = useState();
  const [randomNumber2, setRandomNumber2] = useState();
  const [answer, setAnswer] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [answerString, setAnswerString] = useState();
  const [answerStringInPercent, SetAnswerStringInPercent] = useState();
  const [userInputString, setUserInputString] = useState();
  const [cleanedUserInputString, setCleanedUserInputString] = useState();
  const [scoreArray, setScoreArray] = useState([]);
  const [scoreArrayImage, setScoreArrayImage] = useState([]);
  const [modalCorrectAnsVisible, setModalCorrectAnsVisible] = useState(false);
  const [modalIncorrectAnsVisible, setModalIncorrectAnsVisible] = useState(false);
  const [modalQuizCompleteVisible, setModalQuizCompleteVisible] = useState(false);
  const [TryCount, setTryCount] = useState(0);
  const [QuizComplete, setQuizComplete] = useState(false);
  const [NumbersFromCalculationStepsArray, setNumbersFromCalculationsStepsArray] = useState([]);
  const [tempArray, setTempArray] = useState([]);

  const [textInputBorderColor, setTextInputBorderColor] = useState("#FFFFFF00");

  const [time, setTime] = useState(0);
  const [timerOn, setTimerOn] = useState(true); //default is true so that timer runs as soon as the quiz starts
  const [timeRecordArray, setTimeRecordArray] = useState([]);

  const [latestQuizNumber, setLatestQuizNumber] = useState("0");

  //number of questions to get right in a row to complete the quiz
  let numberOfQuestionsToGetRightInARowToCompleteQuiz = 5;
  
  let tempGrid = [];

  //set up a function that generates two random numbers for Division questions
  const generateRandomNumberDivision = () => {
    let tempNumber1 = Math.floor(Math.random() * 900) + 100;
    setRandomNumber1(tempNumber1);
    // create a variable named tempNumber2 that is less than tempNumber1 and greater than 10
    let tempNumber2 = Math.floor(Math.random() * (tempNumber1 - 10)) + 10;
    setRandomNumber2(tempNumber2);

    let tempAnswerInPercent = (tempNumber2 / tempNumber1) * 100;
    let tempAnswer = tempNumber2 / tempNumber1;
    setAnswer(tempAnswer);

    //convert tempAnswer and tempAnswerInPercent to string and then to array
    let tempAnswerInPercentArray = tempAnswerInPercent.toString().split("");
    let tempAnswerArray = tempAnswer.toString().split("");
    SetAnswerStringInPercent(tempAnswerInPercentArray);
    setAnswerString(tempAnswerArray);

    //store the numbers from calculation steps into an arrayanswer
    let tempAnswer2 = tempNumber2 / tempNumber1;
    let tempAnswer2Array = tempAnswer2.toString().split("");

    let temp_numbers_from_calculation_steps_Array = [];
    //push randomNumber1 into the array
    temp_numbers_from_calculation_steps_Array.push(tempNumber1);
    //push randomNumber2 into the array
    temp_numbers_from_calculation_steps_Array.push(tempNumber2);

    let tempNumber3 = parseInt(tempAnswer2Array[2]) * tempNumber1;
    temp_numbers_from_calculation_steps_Array.push(tempNumber3);

    let tempNumber4 = tempNumber2 * 10 - tempNumber3;
    temp_numbers_from_calculation_steps_Array.push(tempNumber4);

    //get rest of the numbers from calculation steps
    for (let i = 3; i < 20; i++) {
      //check if the i th digit of the decimal answer actually exists
      if (tempAnswer2Array[i]) {
        //parseInt turns string into an integer
        //times the i th digit of the decimal answer by randomNumber1
        //push the result into the array
        let tempNumberFiller = parseInt(tempAnswer2Array[i], 10) * tempNumber1;
        temp_numbers_from_calculation_steps_Array.push(tempNumberFiller);

        //previous number from the calculation array x 10 then subtract tempNumberFiller
        //push the result into the array
        let tempNumberFiller2 =
          temp_numbers_from_calculation_steps_Array[temp_numbers_from_calculation_steps_Array.length - 2] * 10 -
          tempNumberFiller;
        temp_numbers_from_calculation_steps_Array.push(tempNumberFiller2);
      }
    }

    //push the numbers from calculation step to the state
    setNumbersFromCalculationsStepsArray(temp_numbers_from_calculation_steps_Array);
  };

  //set up a function that generates a grid
  const generateGrid = () => {
    //setting up useful variable to use within this function
    let randomNumber1Length = randomNumber1.toString().length;
    let randomnumber2Length = randomNumber2.toString().length;
    let randomNumber1Array = randomNumber1.toString().split("");
    let randomNumber2Array = randomNumber2.toString().split("");

    //figure out how many rows and columns are needed
    //number of columns required -1 to account for the decimal point
    let columnsNeeded = randomNumber1Length + randomnumber2Length + answerStringInPercent.length - 1;
    //number of rows required
    //set it as 0 first so that the variable exists
    let rowsNeeded = 0;
    //check if randomNumber1Length + randomNumberLength2 is 6
    if (randomNumber1Length + randomnumber2Length == 6) {
      //then limit the number of rows to 12 at most
      rowsNeeded = Math.min(2 + (answerString.length - 2) * 2, 12);
    } else {
      //if randomNumber1Length + randomNumberLength2 is not 6, then limit the number of rows to 14 at most
      rowsNeeded = Math.min(2 + (answerString.length - 2) * 2, 14);
    }

    //create a 2D array named tempGrid by using 2 for loops
    for (let i = 0; i < rowsNeeded; i++) {
      tempGrid[i] = [];
      for (let j = 0; j < columnsNeeded && j < 11; j++) {
        tempGrid[i][j] = "";
      }
    }

    //fill in the 2D array with the numbers from calculation steps
    //fill in the answerString on the top
    //remove decimal point from answerString
    let tempAnswerStringArray = answerString.filter((number) => number != ".");
    //replace empty grid cells with the decimal answer
    for (let i = 0; i < tempAnswerStringArray.length && i < 11 - randomNumber1Length - randomnumber2Length + 1; i++) {
      let replacer = tempAnswerStringArray[i];
      tempGrid[0][randomNumber1Length + randomnumber2Length + i - 1] = replacer;
    }

    //fill in randomNumber 1 from [1,0] to [1,randomNumber1.length-1]
    for (let i = 0; i < randomNumber1Length; i++) {
      let replacer = randomNumber1Array[i];
      tempGrid[1][i] = replacer;
    }

    //fill in randomNumber 2 from [1,randomNumber1.length] to [1,randomNumber1.length+randomNumber2.length-1]
    for (let i = 0; i < randomnumber2Length; i++) {
      let replacer = randomNumber2Array[i];
      tempGrid[1][randomNumber1Length + i] = replacer;
    }

    //to place number[i] from calculation steps
    //loop to the length of tempGrid which is the number of Rows created
    //i starts at 2 beacuse the first 2 rows of tempGrid is already taken by answerString and randomNumber1&2
    for (let i = 2; i < tempGrid.length; i++) {
      //break down the number into string and each individual number into array and reverse the order of array
      //we reverse because we write from right of the grid to left
      let replacer = NumbersFromCalculationStepsArray[i].toString().split("").reverse();

      //run the loop for the length of the number[i] of the calculation step
      for (let j = 0; j < replacer.length; j++) {
        //i[2&3] need +0spaces, i[4&5] need +1spaces, i[6&7] need +2spaces, spaces meaning left indent spaces
        //math.floor to round down (i/2) to whole number
        //(i/2)-1 to get the correct number of spaces needed

        //if randomNumber3 is 3 digits then needs 6 spaces then can write from right to left
        //if randomNumber2 is 2 digits then needs 5 spaces then can write from right to left
        //above two statements represented by randomNumber2Length+3

        //subtract j because we writing from right to left
        tempGrid[i][randomnumber2Length + 3 + (Math.floor(i / 2) - 1) - j] = replacer[j];
      }
    }
  };

  //figure out how to display the grid that is now filled with numbers
  //display tempGrid
  //function that displays the grid
  const displayGrid = () => {
    let finalTempArray = [];
    let view_style_width = 14;
    let view_style_height = 23;
    let view_style_borderBottomColor = "white";
    let view_style_borderBottomWidth = 1;
    let view_style_alignItems = "center";
    let view_style_jusifyContent = "center";

    let view_style_combined = {
      width: view_style_width,
      height: view_style_height,
      borderBottomColor: view_style_borderBottomColor,
      borderBottomWidth: view_style_borderBottomWidth,
      alignItems: view_style_alignItems,
      justifyContent: view_style_jusifyContent,
    };

    let font_size = 20;

    let text_style_combined = { textAlign: "center" };

    for (let i = 0; i < tempGrid.length; i++) {
      let veryTempArray = [];
      for (let j = 0; j < tempGrid[i].length; j++) {
        //color each number of answerString
        //first relevant number of answerString is colored green
        if (i == 0 && j == randomNumber1.toString().length + randomNumber2.toString().length && tempGrid[i][j]) {
          veryTempArray.push(
            <View style={view_style_combined}>
              <Text style={{ color: "#17CB49", textAlign: "center", fontSize: font_size }}>{tempGrid[i][j]}</Text>
            </View>
          );
          //second relevant number of answerString is colored blue
        } else if (
          i == 0 &&
          j == randomNumber1.toString().length + randomNumber2.toString().length + 1 &&
          tempGrid[i][j]
        ) {
          veryTempArray.push(
            <View style={view_style_combined}>
              <Text style={{ color: "#168FFF", textAlign: "center", fontSize: font_size, borderWidth: 1, borderColor: "red" }}>{tempGrid[i][j]}</Text>
            </View>
          );
          //third relevant number of answerString is colored orange
        } else if (
          i == 0 &&
          j == randomNumber1.toString().length + randomNumber2.toString().length + 2 &&
          tempGrid[i][j]
        ) {
          veryTempArray.push(
            <View style={view_style_combined}>
              <Text style={{ color: "#FF9F2D", textAlign: "center", fontSize: font_size }}>{tempGrid[i][j]}</Text>
            </View>
          );
          //fourth relevant number of answerString is colored purple
        } else if (
          i == 0 &&
          j == randomNumber1.toString().length + randomNumber2.toString().length + 3 &&
          tempGrid[i][j]
        ) {
          veryTempArray.push(
            <View style={view_style_combined}>
              <Text style={{ color: "#BB86FC", textAlign: "center", fontSize: font_size }}>{tempGrid[i][j]}</Text>
            </View>
          );
          //fifth relevant number of answerString is colored red
        } else if (
          i == 0 &&
          j == randomNumber1.toString().length + randomNumber2.toString().length + 4 &&
          tempGrid[i][j]
        ) {
          veryTempArray.push(
            <View style={view_style_combined}>
              <Text style={{ color: "#F74141", textAlign: "center", fontSize: font_size }}>{tempGrid[i][j]}</Text>
            </View>
          );
          //sixth relevant number of answerString is colored lime
        } else if (
          i == 0 &&
          j == randomNumber1.toString().length + randomNumber2.toString().length + 5 &&
          tempGrid[i][j]
        ) {
          veryTempArray.push(
            <View style={view_style_combined}>
              <Text style={{ color: "#cccc00", textAlign: "center", fontSize: font_size }}>{tempGrid[i][j]}</Text>
            </View>
          );

          //add bottom border to answer cells and cells before answer cells that are above randomNumber2
        } else if (i == 0 && j > randomNumber1.toString().length - 1) {
          veryTempArray.push(
            <View style={view_style_combined}>
              <Text style={{ color: "#ffffff", textAlign: "center", fontSize: font_size }}>{tempGrid[i][j]}</Text>
            </View>
          );
          //add a right border on the very right grid of randomNumber1
        } else if (i == 1 && j == 2) {
          veryTempArray.push(
            <View
              style={{
                width: view_style_width,
                height: view_style_height,
                borderRightColor: "white",
                borderRightWidth: 1,
                alignItems: view_style_alignItems,
                justifyContent: view_style_jusifyContent,
              }}
            >
              <Text style={{ color: "#ffffff", textAlign: "center", fontSize: font_size }}>{tempGrid[i][j]}</Text>
            </View>
          );
        } else if (i == 2 && j > 2 && (tempGrid[i - 1][j] || tempGrid[i][j])) {
          veryTempArray.push(
            <View style={view_style_combined}>
              <Text style={{ color: "#17CB49", textAlign: "center", fontSize: font_size }}>{tempGrid[i][j]}</Text>
            </View>
          );
        } else if (i == 4 && (tempGrid[i - 1][j] || tempGrid[i][j])) {
          veryTempArray.push(
            <View
              style={{
                width: view_style_width,
                height: view_style_height,
                borderBottomColor: view_style_borderBottomColor,
                borderBottomWidth: view_style_borderBottomWidth,
                alignItems: view_style_alignItems,
                justifyContent: view_style_jusifyContent,
              }}
            >
              <Text style={{ color: "#168FFF", textAlign: "center", fontSize: font_size }}>{tempGrid[i][j]}</Text>
            </View>
          );
        } else if (i == 6 && (tempGrid[i - 1][j] || tempGrid[i][j])) {
          veryTempArray.push(
            <View
              style={{
                width: view_style_width,
                height: view_style_height,
                borderBottomColor: view_style_borderBottomColor,
                borderBottomWidth: view_style_borderBottomWidth,
                alignItems: view_style_alignItems,
                justifyContent: view_style_jusifyContent,
              }}
            >
              <Text style={{ color: "#FF9F2D", textAlign: "center", fontSize: font_size }}>{tempGrid[i][j]}</Text>
            </View>
          );
        } else if (i == 8 && (tempGrid[i - 1][j] || tempGrid[i][j])) {
          veryTempArray.push(
            <View style={view_style_combined}>
              <Text style={{ color: "#BB86FC", textAlign: "center", fontSize: font_size }}>{tempGrid[i][j]}</Text>
            </View>
          );
        } else if (i == 10 && (tempGrid[i - 1][j] || tempGrid[i][j])) {
          veryTempArray.push(
            <View
              style={{
                width: view_style_width,
                height: view_style_height,
                borderBottomColor: view_style_borderBottomColor,
                borderBottomWidth: view_style_borderBottomWidth,
                alignItems: view_style_alignItems,
                justifyContent: view_style_jusifyContent,
              }}
            >
              <Text style={{ color: "#F74141", textAlign: "center", fontSize: font_size }}>{tempGrid[i][j]}</Text>
            </View>
          );
        } else if (i == 12 && (tempGrid[i - 1][j] || tempGrid[i][j])) {
          veryTempArray.push(
            <View
              style={{
                width: view_style_width,
                height: view_style_height,
                borderBottomColor: view_style_borderBottomColor,
                borderBottomWidth: view_style_borderBottomWidth,
                alignItems: view_style_alignItems,
                justifyContent: view_style_jusifyContent,
              }}
            >
              <Text style={{ color: "#cccc00", textAlign: "center", fontSize: font_size }}>{tempGrid[i][j]}</Text>
            </View>
          );
        } else {
          veryTempArray.push(
            <View
              style={{
                width: view_style_width,
                height: view_style_height,
                alignItems: view_style_alignItems,
                justifyContent: view_style_jusifyContent,
              }}
            >
              <Text style={{ color: "white", textAlign: "center", fontSize: font_size }}>{tempGrid[i][j]}</Text>
            </View>
          );
        }
      }
      finalTempArray.push(<View style={{ flexDirection: "row" }}>{veryTempArray}</View>);
    }

    setTempArray(finalTempArray);
    return finalTempArray;
  };

  //functions to run as soon as the app loads up
  useEffect(() => {
    //generate random numbers for division
    generateRandomNumberDivision();

    //retrieve latest quiz number from storage
    retrieveLatestQuizNumber().then((value) => {
      //set the State from the retrieved value
      //convert the retrieved value (it comes in string format) to a number format
      setLatestQuizNumber(parseInt(value, 10));
    });
  }, []);

  //start timer on as soon as quiz starts
  //timer pauses once user gets question correct until does not run until they press on the next question button
  //record in an array the time it took to get the question correct for every question (like a lap feature on a stopwatch)
  //timer resumes when user presses on the next question button
  //timer pauses when user gets 10 questions in a row

  useEffect(() => {
    let interval = null;
    if (timerOn) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 100);
      }, 100); // 1000 = 1 second, 100 = 0.1 second
    } else if (!timerOn) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerOn]);

  return (
    <View style={styles.container}>
      {/* a view to give space for statusBar */}
      <View style={{paddingTop: 20}}></View>
      <StatusBar style="light" />
      <View style={styles.score_container}>
        {/* display last 10 items of scoreArray */}
        {scoreArrayImage.slice(-10)}
      </View>

      {/* a TouchableOpacity titled quit */}
      <View style={styles.home_button_container}>
        <TouchableOpacity
          style={styles.home_button}
          onPress={() => {
            //navigate to MainScreen
            navigation.navigate("MainPage");
          }}
        >
          <Image style={styles.home_icon} source={require("../assets/home_icon.png")} />
        </TouchableOpacity>
      </View>

      <View style={styles.quiz_container}>
        <View style={styles.question_container}>
          <Text style={styles.randomNumber_text}>
            {randomNumber2} / {randomNumber1} = ?
          </Text>
        </View>
        <View style={styles.answer_field_container}>
          <TextInput
            style={{
              height: 60,
              width: 150,
              textAlign: "center",
              borderRadius: 5,
              color: "white",
              margin: 10,
              fontSize: 28,
              borderWidth: 3,
              borderBottomColor: "white",
              borderBottomWidth: 3,
              borderTopColor: textInputBorderColor,
              borderTopWidth: 3,
              borderLeftColor: textInputBorderColor,
              borderLeftWidth: 3,
              borderRightColor: textInputBorderColor,
              borderRightWidth: 3,
              //outline none gets rid of default styling of TextInput onFocus
              outline: "none",
              // outlineColor: "red",
            }}
            onChangeText={(text) => setUserInput(text)}
            placeholder="....."
            placeholderTextColor={"#525252"}
            value={userInput}
            keyboardType="number-pad"
            onBlur={() => setTextInputBorderColor("#FFFFFF00")}
            onFocus={() => setTextInputBorderColor("white")}
            //caretHidden hides blinking cursor
            caretHidden={true}
          />
          {/* a TouchableOpacity titled check */}
          <TouchableOpacity
            style={styles.check_button}
            onPress={() => {
              //convert userInput to string and then to array
              let tempUserInputString = userInput.toString().split("");

              //clean up userInput to a uniform format
              let cleanTempUserInputString = [];
              setUserInputString(tempUserInputString);
              //if first element is . followed by a number (meaning that the user skipped out on inputting the first 0)
              //ex) .38 instead of 0.38
              //then add a 0 to the beginning of the stringArray
              if (tempUserInputString[0] == "." && tempUserInputString[1]) {
                cleanTempUserInputString = ["0", ...tempUserInputString];
              } else {
                cleanTempUserInputString = tempUserInputString;
              }

              //run the grid function to put the calculation steps numbers into a grid
              generateGrid();
              //renders the tempgrid 2d array in a 2d manner
              displayGrid();

              //set up a variable for the purpose of if the correct answer has been entered or not
              let did_correct_ans_happened = false;
              //set up a variable for the purpose of checking if the first non-zero digit in the decimal answer happened or not
              let did_relevant_digit_happened = false;
              let relevant_digit_index = 0;
              //adjust the below variable if you want the users to get more or less than 2 digits after relevant digit
              let requried_correct_relevant_digit_count = 2;
              let requried_correct_count_prior_to_relevant_digit = 0;
              let requried_correct_relevant_digit_counter = requried_correct_relevant_digit_count;

              //if tempUserInputString is empty then show alert that field is empty
              if (cleanTempUserInputString.length == 0) {
                alert("Field is empty");

                //if userInputString is not empty (meaning user has entered something)
              } else {
                //add 1 to the try count everytime the check button is pressed
                //but try count is only updated on the next frame render so it will still be treated as 0 for the first run through of the code and only be updated to 1 next frame
                setTryCount(TryCount + 1);

                //set up a loop to go through the decimal answer and compare it to cleaned user input
                for (let i = 0; i < 9; i++) {
                  //check if the current digit is a non-zero or non-"." digit
                  if (answerString[i] != 0 && answerString[i] != ".") {
                    //if it is a non-zero or non-"." digit then set did_relevant_digit_happened to true
                    did_relevant_digit_happened = true;
                    relevant_digit_index = i;
                    requried_correct_count_prior_to_relevant_digit = i;
                    break;
                  }
                }

                //check through digits previous to relevant digit and make sure they are correct
                for (let i = 0; i < relevant_digit_index; i++) {
                  if (answerString[i] == cleanTempUserInputString[i]) {
                    //the count will hit 0 if user enters correct answer digits before relevant digit
                    requried_correct_count_prior_to_relevant_digit = requried_correct_count_prior_to_relevant_digit - 1;
                  }
                }

                //check through digits after (and including) relevant digit and make sure they are correct
                for (let i = 0; i < requried_correct_relevant_digit_count; i++) {
                  //check if the current digit after and including the relevant digit exist in the user input
                  if (cleanTempUserInputString[relevant_digit_index + i]) {
                    //if it does exist then check if it is correct
                    if (answerString[relevant_digit_index + i] == cleanTempUserInputString[relevant_digit_index + i]) {
                      //if it is correct then decrease the counter by 1
                      requried_correct_relevant_digit_counter = requried_correct_relevant_digit_counter - 1;
                    } else {
                      //if userinput digit exists while the answerString digit does not exist (meaning the answer is a clean division)
                      if (!answerString[relevant_digit_index + i]) {
                        //decrease the counter by 1
                        requried_correct_relevant_digit_counter = requried_correct_relevant_digit_counter - 1;
                      }
                    }
                    //if the current digit after the relevant digit does not exist in the user input
                  } else {
                    //check if the current digit after the relevant digit is 0 or answerStringDigit is non existent (meaning the answer is a clean division)
                    if (answerString[relevant_digit_index + i] == 0 || !answerString[relevant_digit_index + i]) {
                      //if it is 0 then decrease the counter by 1
                      requried_correct_relevant_digit_counter = requried_correct_relevant_digit_counter - 1;
                    }
                  }
                }

                //once required correct relevant digit count is 0 then set did_correct_ans_happened to true
                if (
                  requried_correct_relevant_digit_counter == 0 &&
                  requried_correct_count_prior_to_relevant_digit == 0
                ) {
                  did_correct_ans_happened = true;
                }
                //if did_correct_ans_happened is true then show modal that the answer is correct
                if (did_correct_ans_happened) {
                  //reset the timer and push the current time to the time array and reset the timer
                  setTimerOn(false);
                  setTimeRecordArray([...timeRecordArray, time]);
                  setTime(0);

                  //check if the user has gotten 5 correct answers in the past 5 answers (meaning the user has gotten 5 correct answers in a row)
                  let score_correct_in_a_row = 0;
                  let reverse_last10_score_array = scoreArray.slice(-10).reverse();

                  for (let i = 0; i < numberOfQuestionsToGetRightInARowToCompleteQuiz-1; i++) {
                    if (reverse_last10_score_array[i] == "O") {
                      score_correct_in_a_row = score_correct_in_a_row + 1;
                    }
                  }
                  //make CorrectAnsModal visible if user has less than 5 Os in the scoreArray
                  if (score_correct_in_a_row < numberOfQuestionsToGetRightInARowToCompleteQuiz-1) {
                    //pause the timer and push the current time to the time array and reset the timer
                    setTimerOn(false);
                    setTimeRecordArray([...timeRecordArray, time]);
                    setModalCorrectAnsVisible(true);
                  } else {
                    //if user has 5 or more Os in the scoreArray then make the CompleteQuizmodal visible
                    setModalQuizCompleteVisible(true);
                    //then set QuizComplete state to true
                    setQuizComplete(true);

                    //upload all the data
                    //increase quiz number from the previous quiz number

                    setLatestQuizNumber(latestQuizNumber + 1);
                    console.log(latestQuizNumber);

                    //get current date and time
                    let date = new Date().toJSON();
                    let time_took_to_complete = timeRecordArray.reduce((partialSum, a) => partialSum + a, 0) / 1000;

                    storeQuizData_All(latestQuizNumber + 1, 1, scoreArray.length, date, time_took_to_complete);
                  }

                  //check if tryCount is 1
                  if (TryCount == 0) {
                    //push O to scoreArray whenver the user gets the answer correct
                    let tempScoreArray = [...scoreArray];
                    tempScoreArray.push("O");
                    setScoreArray(tempScoreArray);
                    //push correct.png to scoreArrayImage whenver the user gets the answer correct
                    let tempScoreArrayImage = [...scoreArrayImage];
                    tempScoreArrayImage.push(
                      <Image style={styles.score_image} source={require("../assets/correct.png")} />
                    );
                    setScoreArrayImage(tempScoreArrayImage);
                  }
                  //set tryCount to 0 once the user gets the answer correct regardless of how many tries it took
                  setTryCount(0);

                  //if the correct has not been entered then show the wrong answer modal
                } else {
                  //If the user input is incorrect
                  setTryCount(TryCount + 1);
                  //make modal visible
                  setModalIncorrectAnsVisible(true);
                  //check if tryCount is 1
                  //First Time Getting Wrong
                  if (TryCount == 0) {
                    //push X to scoreArray whenver the user gets the answer incorrect
                    let tempScoreArray = [...scoreArray];
                    tempScoreArray.push("X");
                    setScoreArray(tempScoreArray);
                    //push remove.png to scoreArrayImage whenver the user gets the answer incorrect
                    let tempScoreArrayImage = [...scoreArrayImage];
                    tempScoreArrayImage.push(
                      <Image style={styles.score_image} source={require("../assets/remove.png")} />
                    );
                    setScoreArrayImage(tempScoreArrayImage);
                  }
                }
              }
            }}
          >
            <Text style={styles.check_button_text}>Check</Text>
          </TouchableOpacity>
        </View>
      </View>


      {/* display modal that contains a touchableOpacity that says next whenever Correct alert appears */}
      <Modal animationType="fade" transparent={true} visible={modalCorrectAnsVisible}>
        <View style={styles.overlay}></View>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={[styles.modalText, { fontWeight: "bold", fontSize: 24 }]}>Correct!</Text>
            <Text style={styles.modalText}>
              {(Math.round((timeRecordArray.slice(-1) / 1000) * 10) / 10).toFixed(1)}s
            </Text>

            <View style={styles.modalGridContainer}>{tempArray}</View>

            {/*a TouchableOpacity that when you click on it, it will refresh randomnumber1 and randomnumber2 */}
            <TouchableOpacity
              style={styles.next_button}
              onPress={() => {
                //reset the random numbers
                generateRandomNumberDivision();
                //close the modal
                setModalCorrectAnsVisible(!modalCorrectAnsVisible);
                //empty the user input field
                setUserInput("");
                //restart the timer
                setTimerOn(true);
              }}
            >
              <Text style={[styles.button_text, { color: "#181818" }]}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* display modal that contains a touchableOpacity that says next whenever Incorrect alert appears */}
      <Modal animationType="fade" transparent={true} visible={modalIncorrectAnsVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={[styles.modalText, {fontWeight: "bold", fontSize: 24}]}>
              Incorrect!
            </Text>
            <TouchableOpacity
              style={styles.try_again_button}
              onPress={() => {
                //make modal visible
                setModalIncorrectAnsVisible(!modalIncorrectAnsVisible);
              }}
            >
              <Text style={[styles.button_text,{color: "#181818"}]}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* modal that appears when the user gets 5 questions correct in a row */}
      <Modal animationType="fade" transparent={true} visible={modalQuizCompleteVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={[styles.modalText, { fontWeight: "bold", fontSize: 24, margin: 10 }]}>Complete!</Text>
            <Text style={{fontSize:20, color: "white"}}>
              Time to complete: {timeRecordArray.reduce((partialSum, a) => partialSum + a, 0) / 1000}s
            </Text>

            {/* a button that closes modal and bring user to main page */}
            <TouchableOpacity
              style={styles.return_home_button}
              onPress={() => {
                //close the modal
                setModalCorrectAnsVisible(!modalQuizCompleteVisible);
                //navigate to MainScreen
                navigation.navigate("MainPage");
              }}
            >
              <Text style={styles.return_home_button_text}>Return Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* uncomment below to display timer for development purpose */}
      {/* <View style={styles.timer_view}>
        <Text style={styles.basic_text}>Timer Component</Text>
        <Text style={styles.basic_text}>Time: {time}</Text>
        <Text style={styles.basic_text}>This section should be invisible</Text>
      </View> */}

      
      {/* display answer */}
      <Text style={{ color: "white" }}>Answer: {answer.toFixed(6)}</Text>
      {/* display latest Quiz Number Retrieved */}
      {/* <Text style={{ color: "white" }}>latestQuizNumber: {latestQuizNumber}</Text> */}
      {/* display tryCount */}
      {/* <Text style={{ color: "white" }}>Try Count: {TryCount}</Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    
    // alignItems: "center",
    // justifyContent: "center",
  },
  score_container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // borderColor: "blue",
    // borderWidth: 1,
    height: 40,
  },
  score_image: {
    width: 30,
    height: 30,
    margin: 2,
  },
  home_button_container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  quiz_container: {
    justifyContent: "center",
    alignItems: "center",
  },
  question_container: {
    justifyContent: "center",
    alignItems: "center",
    // borderColor: "red",
    // borderWidth: 1,
    height: 100,
    marginTop: "35%",
  },
  answer_field_container: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    // borderColor: "green",
    // borderWidth: 1,
    padding: 10,
  },
  next_button: {
    //a button that centers its children
    width: 100,
    height: 50,
    backgroundColor: "#BB86FC",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    margin: 10,
  },
  try_again_button: {
    //a button that centers its children
    width: 120,
    height: 50,
    backgroundColor: "#F74141",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 25,
  },
  check_button: {
    width: 80,
    height: 55,
    margin: 10,
    backgroundColor: "#168FFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  home_button: {
    justifyContent: "center",
    alignItems: "center",
  },
  home_icon: {
    width: 40,
    height: 40,
  },
  button_text: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  check_button_text: {
    color: "#121212",
    fontSize: 18,
    fontWeight: "bold",
  },
  score_text: {
    color: "black",
    fontSize: 32,
    color: "white",
  },
  randomNumber_text: {
    fontSize: 48,
    color: "white",
  },
  return_home_button: {
    width: 100,
    height: 70,
    backgroundColor: "#168FFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 25,
  },
  return_home_button_text: {
    color: "#181818",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "#181818",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderColor: "#444444",
    borderWidth: 3,
  },
  modalText: {
    color: "white",
  },

  //from here and below is for calculation steps
  modalGridContainer: {
    // borderColor: "red",
    // borderWidth: 1,
    paddingTop: 25,
    paddingBottom: 25,
    paddingRight: 25,
    paddingLeft: 0,
  },

  //from here and below is for timer
  timer_view: {
    justifyContent: "center",
    alignItems: "center",
    borderColor: "red",
    borderWidth: 1,
    height: 80,
  },
  timer_button: {
    width: 100,
    height: 50,
    backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  basic_text: {
    color: "white",
    fontSize: 16,
  },
});
