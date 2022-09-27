import { StatusBar } from "expo-status-bar";
import { Alert, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import { TextInput, FlatList } from "react-native";

export default function DivisionQuizComponent({ navigation, route }) {
  const [randomNumber1, setRandomNumber1] = useState();
  const [randomNumber2, setRandomNumber2] = useState();
  const [answer, setAnswer] = useState();
  const [userInput, setUserInput] = useState("");
  const [answerString, setAnswerString] = useState();
  const [answerStringInPercent, SetAnswerStringInPercent] = useState();
  const [userInputString, setUserInputString] = useState();
  const [answerWhereRelevantDigitHappens, setanswerWhereRelevantDigitHappens] = useState();
  const [scoreArray, setScoreArray] = useState([]);
  const [modalCorrectAnsVisible, setModalCorrectAnsVisible] = useState(false);
  const [modalIncorrectAnsVisible, setModalIncorrectAnsVisible] = useState(false);
  const [TryCount, setTryCount] = useState(0);
  const [NumbersFromCalculationStepsArray, setNumbersFromCalculationsStepsArray] = useState([]);
  const [tempArray, setTempArray] = useState([]);

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

    //store the numbers from calculation steps into an array
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
    let view_style_width = 12;
    let view_style_height = 17;
    let view_style_borderBottomColor = "black";
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

    let text_style_combined = { textAlign: "center" };

    for (let i = 0; i < tempGrid.length; i++) {
      let veryTempArray = [];
      for (let j = 0; j < tempGrid[i].length; j++) {
        //color each number of answerString
        //first relevant number of answerString is colored purple
        if (i == 0 && j == randomNumber1.toString().length + randomNumber2.toString().length && tempGrid[i][j]) {
          veryTempArray.push(
            <View style={view_style_combined}>
              <Text style={{ color: "#b30086", textAlign: "center" }}>{tempGrid[i][j]}</Text>
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
              <Text style={{ color: "#2e2eb8", textAlign: "center" }}>{tempGrid[i][j]}</Text>
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
              <Text style={{ color: "#e65c00", textAlign: "center" }}>{tempGrid[i][j]}</Text>
            </View>
          );
          //fourth relevant number of answerString is colored green
        } else if (
          i == 0 &&
          j == randomNumber1.toString().length + randomNumber2.toString().length + 3 &&
          tempGrid[i][j]
        ) {
          veryTempArray.push(
            <View style={view_style_combined}>
              <Text style={{ color: "#00802b", textAlign: "center" }}>{tempGrid[i][j]}</Text>
            </View>
          );
          //fifth relevant number of answerString is colored brown
        } else if (
          i == 0 &&
          j == randomNumber1.toString().length + randomNumber2.toString().length + 4 &&
          tempGrid[i][j]
        ) {
          veryTempArray.push(
            <View style={view_style_combined}>
              <Text style={{ color: "#990000", textAlign: "center" }}>{tempGrid[i][j]}</Text>
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
              <Text style={{ color: "#cccc00", textAlign: "center" }}>{tempGrid[i][j]}</Text>
            </View>
          );

          //add bottom border to answer cells and cells before answer cells that are above randomNumber2
        } else if (i == 0 && j > randomNumber1.toString().length - 1) {
          veryTempArray.push(
            <View style={view_style_combined}>
              <Text style={{ color: "#000000", textAlign: "center" }}>{tempGrid[i][j]}</Text>
            </View>
          );
          //add a right border on the very right grid of randomNumber1
        } else if (i == 1 && j == 2) {
          veryTempArray.push(
            <View
              style={{
                width: view_style_width,
                height: view_style_height,
                borderRightColor: "black",
                borderRightWidth: 1,
                alignItems: view_style_alignItems,
                justifyContent: view_style_jusifyContent,
              }}
            >
              <Text style={{ color: "#000000", textAlign: "center" }}>{tempGrid[i][j]}</Text>
            </View>
          );
        } else if (i == 2 && j > 2 && (tempGrid[i - 1][j] || tempGrid[i][j])) {
          veryTempArray.push(
            <View style={view_style_combined}>
              <Text style={{ color: "#b30086", textAlign: "center" }}>{tempGrid[i][j]}</Text>
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
              <Text style={{ color: "#2e2eb8", textAlign: "center" }}>{tempGrid[i][j]}</Text>
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
              <Text style={{ color: "#e65c00", textAlign: "center" }}>{tempGrid[i][j]}</Text>
            </View>
          );
        } else if (i == 8 && (tempGrid[i - 1][j] || tempGrid[i][j])) {
          veryTempArray.push(
            <View style={view_style_combined}>
              <Text style={{ color: "#00802b", textAlign: "center" }}>{tempGrid[i][j]}</Text>
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
              <Text style={{ color: "#990000", textAlign: "center" }}>{tempGrid[i][j]}</Text>
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
              <Text style={{ color: "#cccc00", textAlign: "center" }}>{tempGrid[i][j]}</Text>
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
              <Text style={{ textAlign: "center" }}>{tempGrid[i][j]}</Text>
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
  }, []);

  return (
    <View style={styles.container}>
      {/* display last 10 items of scoreArray */}
      <Text style={styles.score_text}>Score:{scoreArray.slice(-10)}</Text>
      <Text style={styles.randomNumber_text}>
        {randomNumber2} / {randomNumber1} = ?
      </Text>

      {/* input field synced with userInput */}
      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        onChangeText={(text) => setUserInput(text)}
        placeholder="Enter your answer"
        value={userInput}
      />
      {/* a TouchableOpacity titled check */}
      <TouchableOpacity
        style={styles.check_button}
        onPress={() => {
          //convert userInput to string and then to array
          let tempUserInputString = userInput.toString().split("");
          setUserInputString(tempUserInputString);

          //run the grid function to put the calculation steps numbers into a grid
          generateGrid();
          //renders the tempgrid 2d array in a 2d manner
          displayGrid();

          //if tempUserInputString is empty then alert field is empty
          if (tempUserInputString.length == 0) {
            alert("Field is empty");
          } else {
            //if userInputString is not empty (meaning user has entered something)
            for (let i = 0; i < 9; i++) {
              if (answerStringInPercent[i] != "0") {
                let tempAnswerWhereRelevantDigitHappens = i;
                setanswerWhereRelevantDigitHappens(tempAnswerWhereRelevantDigitHappens);
                //Check if the user input is correct
                if (
                  answerStringInPercent[i] == tempUserInputString[i] &&
                  answerStringInPercent[i + 1] == tempUserInputString[i + 1]
                ) {
                  setTryCount(TryCount + 1);
                  //make modal visible
                  setModalCorrectAnsVisible(true);
                  //check if tryCount is 1
                  if (TryCount == 0) {
                    //push O to scoreArray whenver the user gets the answer correct
                    let tempScoreArray = [...scoreArray];
                    tempScoreArray.push("O");
                    setScoreArray(tempScoreArray);
                    //set tryCount to 0
                    setTryCount(0);
                  } else {
                    setTryCount(0);
                  }
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
                  }
                }
                break;
              }
            }
          }
        }}
      >
        <Text style={styles.button_text}>Check</Text>
      </TouchableOpacity>

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

      {/* display answer */}
      <Text>Answer: {(answer * 100).toFixed(5)}%</Text>
      {/* display tryCount */}
      <Text>Try Count: {TryCount}</Text>

      {/* display modal that contains a touchableOpacity that says next whenever Correct alert appears */}
      <Modal animationType="fade" transparent={true} visible={modalCorrectAnsVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Numbers from calculation steps:</Text>
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
              }}
            >
              <Text style={styles.button_text}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* display modal that contains a touchableOpacity that says next whenever Incorrect alert appears */}
      <Modal animationType="fade" transparent={true} visible={modalIncorrectAnsVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              {`
              Incorrect!
              Random Number 1: ${randomNumber1}
              Random Number 2: ${randomNumber2}`}
            </Text>
            <TouchableOpacity
              style={styles.try_again_button}
              onPress={() => {
                //make modal visible
                setModalIncorrectAnsVisible(!modalIncorrectAnsVisible);
              }}
            >
              <Text>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  next_button: {
    //a button that centers its children
    width: 100,
    height: 50,
    backgroundColor: "#d24dff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  try_again_button: {
    //a button that centers its children
    width: 100,
    height: 50,
    backgroundColor: "#d63349",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  check_button: {
    width: 100,
    height: 50,
    backgroundColor: "#1aa3ff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  quit_button: {
    width: 100,
    height: 50,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  button_text: {
    color: "white",
    fontSize: 16,
  },
  score_text: {
    color: "black",
    fontSize: 32,
  },
  randomNumber_text: {
    color: "black",
    fontSize: 32,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "#fff194",
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
  },

  //from here and below is for calculation steps
  modalGridContainer: {
    borderColor: "red",
    // width: 100,
    // height: 100,
    borderWidth: 1,
  },
});
