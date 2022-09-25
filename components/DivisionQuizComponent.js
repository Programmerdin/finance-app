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
import { TextInput, FlatList } from "react-native";

export default function DivisionQuizComponent({ navigation, route }) {
  const [randomNumber1, setRandomNumber1] = useState();
  const [randomNumber2, setRandomNumber2] = useState();
  const [answer, setAnswer] = useState();
  const [userInput, setUserInput] = useState("");
  const [answerString, setAnswerString] = useState();
  const [answerStringInPercent, SetAnswerStringInPercent] = useState();
  const [userInputString, setUserInputString] = useState();
  const [answerWhereRelevantDigitHappens, setanswerWhereRelevantDigitHappens] =
    useState();
  const [scoreArray, setScoreArray] = useState([]);
  const [modalCorrectAnsVisible, setModalCorrectAnsVisible] = useState(false);
  const [modalIncorrectAnsVisible, setModalIncorrectAnsVisible] =
    useState(false);
  const [TryCount, setTryCount] = useState(0);
  const [
    NumbersFromCalculationStepsArray,
    setNumbersFromCalculationsStepsArray,
  ] = useState([]);
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
      //Only get the next number from calculation steps if the last number from the calculation step is not 0
      if (
        temp_numbers_from_calculation_steps_Array[
          temp_numbers_from_calculation_steps_Array.length - 1
        ] != 0
      ) {
        let tempNumber5 = parseInt(tempAnswer2Array[i], 10) * tempNumber1;
        temp_numbers_from_calculation_steps_Array.push(tempNumber5);

        //Only get the next number from calculation steps if the last number from the calculation step is not 0
        if (
          temp_numbers_from_calculation_steps_Array[
            temp_numbers_from_calculation_steps_Array.length - 1
          ] != 0
        ) {
          let tempNumber6 =
            temp_numbers_from_calculation_steps_Array[
              temp_numbers_from_calculation_steps_Array.length - 2
            ] *
              10 -
            tempNumber5;
          temp_numbers_from_calculation_steps_Array.push(tempNumber6);
        }
      }
    }

    //push the numbers from calculation step to the state
    setNumbersFromCalculationsStepsArray(
      temp_numbers_from_calculation_steps_Array
    );
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
    let columnsNeeded =
      randomNumber1Length +
      randomnumber2Length +
      answerStringInPercent.length -
      1;
    //number of rows required
    let rowsNeeded = answerString.length;

    //create a 2D array named tempGrid by using 2 for loops
    for (let i = 0; i < rowsNeeded; i++) {
      tempGrid[i] = [];
      for (let j = 0; j < columnsNeeded && j < 11; j++) {
        tempGrid[i][j] = "";
      }
    }

    //fill in the 2D array with the numbers from calculation steps
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

    //fill in the answerString on the top
    //remove decimal point from answerString
    let tempAnswerStringArray = answerString.filter((number) => number != ".");
    //replace empty grid cells with the decimal answer
    for (
      let i = 0;
      i < tempAnswerStringArray.length &&
      i < 11 - randomNumber1Length - randomnumber2Length + 1;
      i++
    ) {
      let replacer = tempAnswerStringArray[i];
      tempGrid[0][randomNumber1Length + randomnumber2Length + i - 1] = replacer;
    }

    //number3 from calculation steps
    //fill up the grid from left to right
    let tempNumberfromCalcStep3Array = NumbersFromCalculationStepsArray[2]
      .toString()
      .split("")
      .reverse();
    for (let i = 0; i < tempNumberfromCalcStep3Array.length; i++) {
      let replacer = tempNumberfromCalcStep3Array[i];
      tempGrid[2][randomNumber1Length + randomnumber2Length - i] = replacer;
    }

    //number4 from calcultion steps
    //fill up the grid from left to right
    let tempNumberfromCalcStep4Array = NumbersFromCalculationStepsArray[3]
      .toString()
      .split("")
      .reverse();
    for (let i = 0; i < tempNumberfromCalcStep4Array.length; i++) {
      let replacer = tempNumberfromCalcStep4Array[i];
      tempGrid[3][randomNumber1Length + randomnumber2Length - i] = replacer;
    }

    //number5 from calcultion steps
    //fill up the grid from left to right
    let tempNumberfromCalcStep5Array = NumbersFromCalculationStepsArray[4]
      .toString()
      .split("")
      .reverse();
    for (let i = 0; i < tempNumberfromCalcStep5Array.length; i++) {
      let replacer = tempNumberfromCalcStep5Array[i];
      tempGrid[4][randomNumber1Length + randomnumber2Length + 1 - i] = replacer;
    }

    //number6 from calculation steps
    //fill up the grid from left to right
    // let tempNumberfromCalcStep6Array = NumbersFromCalculationStepsArray[5]
    //   .toString()
    //   .split("")
    //   .reverse();
    // for (let i = 0; i < tempNumberfromCalcStep6Array.length; i++) {
    //   let replacer = tempNumberfromCalcStep6Array[i];
    //   tempGrid[5][randomNumber1Length + randomnumber2Length + 1 - i] = replacer;
    // }

    //number7 from calculation steps
    //fill up the grid from left to right
    // let tempNumberfromCalcStep7Array = NumbersFromCalculationStepsArray[6]
    //   .toString()
    //   .split("")
    //   .reverse();
    // for (let i = 0; i < tempNumberfromCalcStep7Array.length; i++) {
    //   let replacer = tempNumberfromCalcStep7Array[i];
    //   tempGrid[6][randomNumber1Length + randomnumber2Length + 2 - i] = replacer;
    // }

    // //number8 from calculation steps
    // //fill up the grid from left to right
    // let tempNumberfromCalcStep8Array = NumbersFromCalculationStepsArray[7]
    //   .toString()
    //   .split("")
    //   .reverse();
    // for (let i = 0; i < tempNumberfromCalcStep8Array.length; i++) {
    //   let replacer = tempNumberfromCalcStep8Array[i];
    //   tempGrid[7][randomNumber1Length + randomnumber2Length + 2 - i] = replacer;
    // }

    // //number9 from calculation steps
    // //fill up the grid from left to right
    // let tempNumberfromCalcStep9Array = NumbersFromCalculationStepsArray[8]
    //   .toString()
    //   .split("")
    //   .reverse();
    // for (let i = 0; i < tempNumberfromCalcStep9Array.length; i++) {
    //   let replacer = tempNumberfromCalcStep9Array[i];
    //   tempGrid[8][randomNumber1Length + randomnumber2Length + 3 - i] = replacer;
    // }

    // //number10 from calculation steps
    // //fill up the grid from left to right
    // let tempNumberfromCalcStep10Array = NumbersFromCalculationStepsArray[9]
    //   .toString()
    //   .split("")
    //   .reverse();
    // for (let i = 0; i < tempNumberfromCalcStep10Array.length; i++) {
    //   let replacer = tempNumberfromCalcStep10Array[i];
    //   tempGrid[9][randomNumber1Length + randomnumber2Length + 3 - i] = replacer;
    // }

    //figure out how to display the grid that is now filled with numbers
    //display tempGrid
    console.log(tempGrid);
  };

  //function that displays the grid
  const displayGrid = () => {
    console.log(tempGrid)
    let finalTempArray = [];

    for (let i = 0; i < 8; i++) {
      let veryTempArray = [];
      for (let j = 0; j < tempGrid.length; j++) {
        veryTempArray.push(
          <View style={{ width: 15, height: 15 }}>
            <Text>{tempGrid[i][j]}</Text>
          </View>
        );
      }
      finalTempArray.push(<View style={{flexDirection: "row"}}>{veryTempArray}</View>);
    }

    setTempArray(finalTempArray)
    console.log(finalTempArray)
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
      <Text>Score:{scoreArray.slice(-10)}</Text>
      <Text>Number 1: {randomNumber1}</Text>
      <Text>Number 2: {randomNumber2}</Text>

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
           displayGrid();
          //renders the tempgrid 2d array in a 2d manner

          //if tempUserInputString is empty then alert field is empty
          if (tempUserInputString.length == 0) {
            alert("Field is empty");
          } else {
            //if userInputString is not empty (meaning user has entered something)
            for (let i = 0; i < 9; i++) {
              if (answerStringInPercent[i] != "0") {
                let tempAnswerWhereRelevantDigitHappens = i;
                setanswerWhereRelevantDigitHappens(
                  tempAnswerWhereRelevantDigitHappens
                );
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
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalCorrectAnsVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Numbers from calculation steps:
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
              }}
            >
              <Text style={styles.button_text}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* display modal that contains a touchableOpacity that says next whenever Incorrect alert appears */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalIncorrectAnsVisible}
      >
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

  //from here and below is for

  // `gridRow${i}`], styles[`gridCell${i}${j}`
  modalGridContainer: {
    borderColor: "red",
    width: 100,
    height: 100,
    borderWidth: 1,
  },
  gridCellsAll: {},
  0: {
    color: "black",
  },
  1: {
    color: "black",
  },
  2: {
    color: "purple",
  },
  3: {
    color: "black",
  },
  4: {
    color: "#30349c",
  },
  5: {
    color: "black",
  },
  6: {
    color: "green",
  },
  7: {
    color: "black",
  },
  8: {
    color: "#cc6627",
  },
  9: {
    color: "black",
  },

  gridCelly0x0: {
    position: "absolute",
    left: 0,
    top: 0,
  },
  gridCelly0x1: {
    position: "absolute",
    left: 10,
    top: 0,
  },
  gridCelly0x2: {
    position: "absolute",
    left: 20,
    top: 0,
  },
  gridCelly0x3: {
    position: "absolute",
    left: 30,
    top: 0,
  },
  gridCelly0x4: {
    position: "absolute",
    left: 40,
    top: 0,
  },
  gridCelly0x5: {
    position: "absolute",
    left: 50,
    top: 0,
  },
  gridCelly0x6: {
    position: "absolute",
    left: 60,
    top: 0,
  },
  gridCelly0x7: {
    position: "absolute",
    left: 70,
    top: 0,
  },
  gridCelly0x8: {
    position: "absolute",
    left: 80,
    top: 0,
  },
  gridCelly0x9: {
    position: "absolute",
    left: 90,
    top: 0,
  },
  gridCelly0x10: {
    position: "absolute",
    left: 100,
    top: 0,
  },
  gridCelly0x11: {
    position: "absolute",
    left: 110,
    top: 0,
  },
  gridCelly0x12: {
    position: "absolute",
    left: 120,
    top: 0,
  },
  gridCelly0x13: {
    position: "absolute",
    left: 130,
    top: 0,
  },
  gridCelly0x14: {
    position: "absolute",
    left: 140,
    top: 0,
  },
  gridCelly0x15: {
    position: "absolute",
    left: 150,
    top: 0,
  },
  gridCelly1x0: {
    position: "absolute",
    left: 0,
    top: 10,
  },
  gridCelly1x1: {
    position: "absolute",
    left: 10,
    top: 10,
  },
  gridCelly1x2: {
    position: "absolute",
    left: 20,
    top: 10,
  },
  gridCelly1x3: {
    position: "absolute",
    left: 30,
    top: 10,
  },
  gridCelly1x4: {
    position: "absolute",
    left: 40,
    top: 10,
  },
  gridCelly1x5: {
    position: "absolute",
    left: 50,
    top: 10,
  },
  gridCelly1x6: {
    position: "absolute",
    left: 60,
    top: 10,
  },
  gridCelly1x7: {
    position: "absolute",
    left: 70,
    top: 10,
  },
  gridCelly1x8: {
    position: "absolute",
    left: 80,
    top: 10,
  },
  gridCelly1x9: {
    position: "absolute",
    left: 90,
    top: 10,
  },
  gridCelly1x10: {
    position: "absolute",
    left: 100,
    top: 10,
  },
  gridCelly1x11: {
    position: "absolute",
    left: 110,
    top: 10,
  },
  gridCelly1x12: {
    position: "absolute",
    left: 120,
    top: 10,
  },
  gridCelly1x13: {
    position: "absolute",
    left: 130,
    top: 10,
  },
  gridCelly1x14: {
    position: "absolute",
    left: 140,
    top: 10,
  },
  gridCelly1x15: {
    position: "absolute",
    left: 150,
    top: 10,
  },
  gridCelly2x0: {
    position: "absolute",
    left: 0,
    top: 20,
  },
  gridCelly2x1: {
    position: "absolute",
    left: 10,
    top: 20,
  },
  gridCelly2x2: {
    position: "absolute",
    left: 20,
    top: 20,
  },
  gridCelly2x3: {
    position: "absolute",
    left: 30,
    top: 20,
  },
  gridCelly2x4: {
    position: "absolute",
    left: 40,
    top: 20,
  },
  gridCelly2x5: {
    position: "absolute",
    left: 50,
    top: 20,
  },
  gridCelly2x6: {
    position: "absolute",
    left: 60,
    top: 20,
  },
  gridCelly2x7: {
    position: "absolute",
    left: 70,
    top: 20,
  },
  gridCelly2x8: {
    position: "absolute",
    left: 80,
    top: 20,
  },
  gridCelly2x9: {
    position: "absolute",
    left: 90,
    top: 20,
  },
  gridCelly2x10: {
    position: "absolute",
    left: 100,
    top: 20,
  },
  gridCelly2x11: {
    position: "absolute",
    left: 110,
    top: 20,
  },
  gridCelly2x12: {
    position: "absolute",
    left: 120,
    top: 20,
  },
  gridCelly2x13: {
    position: "absolute",
    left: 130,
    top: 20,
  },
  gridCelly2x14: {
    position: "absolute",
    left: 140,
    top: 20,
  },
  gridCelly2x15: {
    position: "absolute",
    left: 150,
    top: 20,
  },
  gridCelly3x0: {
    position: "absolute",
    left: 0,
    top: 30,
  },
  gridCelly3x1: {
    position: "absolute",
    left: 10,
    top: 30,
  },
  gridCelly3x2: {
    position: "absolute",
    left: 20,
    top: 30,
  },
  gridCelly3x3: {
    position: "absolute",
    left: 30,
    top: 30,
  },
  gridCelly3x4: {
    position: "absolute",
    left: 40,
    top: 30,
  },
  gridCelly3x5: {
    position: "absolute",
    left: 50,
    top: 30,
  },
  gridCelly3x6: {
    position: "absolute",
    left: 60,
    top: 30,
  },
  gridCelly3x7: {
    position: "absolute",
    left: 70,
    top: 30,
  },
  gridCelly3x8: {
    position: "absolute",
    left: 80,
    top: 30,
  },
  gridCelly3x9: {
    position: "absolute",
    left: 90,
    top: 30,
  },
  gridCelly3x10: {
    position: "absolute",
    left: 100,
    top: 30,
  },
  gridCelly3x11: {
    position: "absolute",
    left: 110,
    top: 30,
  },
  gridCelly3x12: {
    position: "absolute",
    left: 120,
    top: 30,
  },
  gridCelly3x13: {
    position: "absolute",
    left: 130,
    top: 30,
  },
  gridCelly3x14: {
    position: "absolute",
    left: 140,
    top: 30,
  },
  gridCelly3x15: {
    position: "absolute",
    left: 150,
    top: 30,
  },
  gridCelly4x0: {
    position: "absolute",
    left: 0,
    top: 40,
  },
  gridCelly4x1: {
    position: "absolute",
    left: 10,
    top: 40,
  },
  gridCelly4x2: {
    position: "absolute",
    left: 20,
    top: 40,
  },
  gridCelly4x3: {
    position: "absolute",
    left: 30,
    top: 40,
  },
  gridCelly4x4: {
    position: "absolute",
    left: 40,
    top: 40,
  },
  gridCelly4x5: {
    position: "absolute",
    left: 50,
    top: 40,
  },
  gridCelly4x6: {
    position: "absolute",
    left: 60,
    top: 40,
  },
  gridCelly4x7: {
    position: "absolute",
    left: 70,
    top: 40,
  },
  gridCelly4x8: {
    position: "absolute",
    left: 80,
    top: 40,
  },
  gridCelly4x9: {
    position: "absolute",
    left: 90,
    top: 40,
  },
  gridCelly4x10: {
    position: "absolute",
    left: 100,
    top: 40,
  },
  gridCelly4x11: {
    position: "absolute",
    left: 110,
    top: 40,
  },
  gridCelly4x12: {
    position: "absolute",
    left: 120,
    top: 40,
  },
  gridCelly4x13: {
    position: "absolute",
    left: 130,
    top: 40,
  },
  gridCelly4x14: {
    position: "absolute",
    left: 140,
    top: 40,
  },
  gridCelly4x15: {
    position: "absolute",
    left: 150,
    top: 40,
  },
  gridCelly5x0: {
    position: "absolute",
    left: 0,
    top: 50,
  },
  gridCelly5x1: {
    position: "absolute",
    left: 10,
    top: 50,
  },
  gridCelly5x2: {
    position: "absolute",
    left: 20,
    top: 50,
  },
  gridCelly5x3: {
    position: "absolute",
    left: 30,
    top: 50,
  },
  gridCelly5x4: {
    position: "absolute",
    left: 40,
    top: 50,
  },
  gridCelly5x5: {
    position: "absolute",
    left: 50,
    top: 50,
  },
  gridCelly5x6: {
    position: "absolute",
    left: 60,
    top: 50,
  },
  gridCelly5x7: {
    position: "absolute",
    left: 70,
    top: 50,
  },
  gridCelly5x8: {
    position: "absolute",
    left: 80,
    top: 50,
  },
  gridCelly5x9: {
    position: "absolute",
    left: 90,
    top: 50,
  },
  gridCelly5x10: {
    position: "absolute",
    left: 100,
    top: 50,
  },
  gridCelly5x11: {
    position: "absolute",
    left: 110,
    top: 50,
  },
  gridCelly5x12: {
    position: "absolute",
    left: 120,
    top: 50,
  },
  gridCelly5x13: {
    position: "absolute",
    left: 130,
    top: 50,
  },
  gridCelly5x14: {
    position: "absolute",
    left: 140,
    top: 50,
  },
  gridCelly5x15: {
    position: "absolute",
    left: 150,
    top: 50,
  },
  gridCelly6x0: {
    position: "absolute",
    left: 0,
    top: 60,
  },
  gridCelly6x1: {
    position: "absolute",
    left: 10,
    top: 60,
  },
  gridCelly6x2: {
    position: "absolute",
    left: 20,
    top: 60,
  },
  gridCelly6x3: {
    position: "absolute",
    left: 30,
    top: 60,
  },
  gridCelly6x4: {
    position: "absolute",
    left: 40,
    top: 60,
  },
  gridCelly6x5: {
    position: "absolute",
    left: 50,
    top: 60,
  },
  gridCelly6x6: {
    position: "absolute",
    left: 60,
    top: 60,
  },
  gridCelly6x7: {
    position: "absolute",
    left: 70,
    top: 60,
  },
  gridCelly6x8: {
    position: "absolute",
    left: 80,
    top: 60,
  },
  gridCelly6x9: {
    position: "absolute",
    left: 90,
    top: 60,
  },
  gridCelly6x10: {
    position: "absolute",
    left: 100,
    top: 60,
  },
  gridCelly6x11: {
    position: "absolute",
    left: 110,
    top: 60,
  },
  gridCelly6x12: {
    position: "absolute",
    left: 120,
    top: 60,
  },
  gridCelly6x13: {
    position: "absolute",
    left: 130,
    top: 60,
  },
  gridCelly6x14: {
    position: "absolute",
    left: 140,
    top: 60,
  },
  gridCelly6x15: {
    position: "absolute",
    left: 150,
    top: 60,
  },
  gridCelly7x0: {
    position: "absolute",
    left: 0,
    top: 70,
  },
  gridCelly7x1: {
    position: "absolute",
    left: 10,
    top: 70,
  },
  gridCelly7x2: {
    position: "absolute",
    left: 20,
    top: 70,
  },
  gridCelly7x3: {
    position: "absolute",
    left: 30,
    top: 70,
  },
  gridCelly7x4: {
    position: "absolute",
    left: 40,
    top: 70,
  },
  gridCelly7x5: {
    position: "absolute",
    left: 50,
    top: 70,
  },
  gridCelly7x6: {
    position: "absolute",
    left: 60,
    top: 70,
  },
  gridCelly7x7: {
    position: "absolute",
    left: 70,
    top: 70,
  },
  gridCelly7x8: {
    position: "absolute",
    left: 80,
    top: 70,
  },
  gridCelly7x9: {
    position: "absolute",
    left: 90,
    top: 70,
  },
  gridCelly7x10: {
    position: "absolute",
    left: 100,
    top: 70,
  },
  gridCelly7x11: {
    position: "absolute",
    left: 110,
    top: 70,
  },
  gridCelly7x12: {
    position: "absolute",
    left: 120,
    top: 70,
  },
  gridCelly7x13: {
    position: "absolute",
    left: 130,
    top: 70,
  },
  gridCelly7x14: {
    position: "absolute",
    left: 140,
    top: 70,
  },
  gridCelly7x15: {
    position: "absolute",
    left: 150,
    top: 70,
  },
  gridCelly8x0: {
    position: "absolute",
    left: 0,
    top: 80,
  },
  gridCelly8x1: {
    position: "absolute",
    left: 10,
    top: 80,
  },
  gridCelly8x2: {
    position: "absolute",
    left: 20,
    top: 80,
  },
  gridCelly8x3: {
    position: "absolute",
    left: 30,
    top: 80,
  },
  gridCelly8x4: {
    position: "absolute",
    left: 40,
    top: 80,
  },
  gridCelly8x5: {
    position: "absolute",
    left: 50,
    top: 80,
  },
  gridCelly8x6: {
    position: "absolute",
    left: 60,
    top: 80,
  },
  gridCelly8x7: {
    position: "absolute",
    left: 70,
    top: 80,
  },
  gridCelly8x8: {
    position: "absolute",
    left: 80,
    top: 80,
  },
  gridCelly8x9: {
    position: "absolute",
    left: 90,
    top: 80,
  },
  gridCelly8x10: {
    position: "absolute",
    left: 100,
    top: 80,
  },
  gridCelly8x11: {
    position: "absolute",
    left: 110,
    top: 80,
  },
  gridCelly8x12: {
    position: "absolute",
    left: 120,
    top: 80,
  },
  gridCelly8x13: {
    position: "absolute",
    left: 130,
    top: 80,
  },
  gridCelly8x14: {
    position: "absolute",
    left: 140,
    top: 80,
  },
  gridCelly8x15: {
    position: "absolute",
    left: 150,
    top: 80,
  },
  gridCelly9x0: {
    position: "absolute",
    left: 0,
    top: 90,
  },
  gridCelly9x1: {
    position: "absolute",
    left: 10,
    top: 90,
  },
  gridCelly9x2: {
    position: "absolute",
    left: 20,
    top: 90,
  },
  gridCelly9x3: {
    position: "absolute",
    left: 30,
    top: 90,
  },
  gridCelly9x4: {
    position: "absolute",
    left: 40,
    top: 90,
  },
  gridCelly9x5: {
    position: "absolute",
    left: 50,
    top: 90,
  },
  gridCelly9x6: {
    position: "absolute",
    left: 60,
    top: 90,
  },
  gridCelly9x7: {
    position: "absolute",
    left: 70,
    top: 90,
  },
  gridCelly9x8: {
    position: "absolute",
    left: 80,
    top: 90,
  },
  gridCelly9x9: {
    position: "absolute",
    left: 90,
    top: 90,
  },
  gridCelly9x10: {
    position: "absolute",
    left: 100,
    top: 90,
  },
  gridCelly9x11: {
    position: "absolute",
    left: 110,
    top: 90,
  },
  gridCelly9x12: {
    position: "absolute",
    left: 120,
    top: 90,
  },
  gridCelly9x13: {
    position: "absolute",
    left: 130,
    top: 90,
  },
  gridCelly9x14: {
    position: "absolute",
    left: 140,
    top: 90,
  },
  gridCelly9x15: {
    position: "absolute",
    left: 150,
    top: 90,
  },
  gridCelly10x0: {
    position: "absolute",
    left: 0,
    top: 100,
  },
  gridCelly10x1: {
    position: "absolute",
    left: 10,
    top: 100,
  },
  gridCelly10x2: {
    position: "absolute",
    left: 20,
    top: 100,
  },
  gridCelly10x3: {
    position: "absolute",
    left: 30,
    top: 100,
  },
  gridCelly10x4: {
    position: "absolute",
    left: 40,
    top: 100,
  },
  gridCelly10x5: {
    position: "absolute",
    left: 50,
    top: 100,
  },
  gridCelly10x6: {
    position: "absolute",
    left: 60,
    top: 100,
  },
  gridCelly10x7: {
    position: "absolute",
    left: 70,
    top: 100,
  },
  gridCelly10x8: {
    position: "absolute",
    left: 80,
    top: 100,
  },
  gridCelly10x9: {
    position: "absolute",
    left: 90,
    top: 100,
  },
  gridCelly10x10: {
    position: "absolute",
    left: 100,
    top: 100,
  },
  gridCelly10x11: {
    position: "absolute",
    left: 110,
    top: 100,
  },
  gridCelly10x12: {
    position: "absolute",
    left: 120,
    top: 100,
  },
  gridCelly10x13: {
    position: "absolute",
    left: 130,
    top: 100,
  },
  gridCelly10x14: {
    position: "absolute",
    left: 140,
    top: 100,
  },
  gridCelly10x15: {
    position: "absolute",
    left: 150,
    top: 100,
  },

  gridCelly11x1: {
    position: "absolute",
    left: 10,
    top: 110,
  },
  gridCelly11x2: {
    position: "absolute",
    left: 20,
    top: 110,
  },
  gridCelly11x3: {
    position: "absolute",
    left: 30,
    top: 110,
  },
  gridCelly11x4: {
    position: "absolute",
    left: 40,
    top: 110,
  },
  gridCelly11x5: {
    position: "absolute",
    left: 50,
    top: 110,
  },
  gridCelly11x6: {
    position: "absolute",
    left: 60,
    top: 110,
  },
  gridCelly11x7: {
    position: "absolute",
    left: 70,
    top: 110,
  },
  gridCelly11x8: {
    position: "absolute",
    left: 80,
    top: 110,
  },
  gridCelly11x9: {
    position: "absolute",
    left: 90,
    top: 110,
  },
  gridCelly11x10: {
    position: "absolute",
    left: 100,
    top: 110,
  },
  gridCelly11x11: {
    position: "absolute",
    left: 110,
    top: 110,
  },
  gridCelly11x12: {
    position: "absolute",
    left: 120,
    top: 110,
  },
  gridCelly11x13: {
    position: "absolute",
    left: 130,
    top: 110,
  },
  gridCelly11x14: {
    position: "absolute",
    left: 140,
    top: 110,
  },
  gridCelly11x15: {
    position: "absolute",
    left: 150,
    top: 110,
  },

  gridCelly12x1: {
    position: "absolute",
    left: 10,
    top: 120,
  },
  gridCelly12x2: {
    position: "absolute",
    left: 20,
    top: 120,
  },
  gridCelly12x3: {
    position: "absolute",
    left: 30,
    top: 120,
  },
  gridCelly12x4: {
    position: "absolute",
    left: 40,
    top: 120,
  },
  gridCelly12x5: {
    position: "absolute",
    left: 50,
    top: 120,
  },
  gridCelly12x6: {
    position: "absolute",
    left: 60,
    top: 120,
  },
  gridCelly12x7: {
    position: "absolute",
    left: 70,
    top: 120,
  },
  gridCelly12x8: {
    position: "absolute",
    left: 80,
    top: 120,
  },
  gridCelly12x9: {
    position: "absolute",
    left: 90,
    top: 120,
  },
  gridCelly12x10: {
    position: "absolute",
    left: 100,
    top: 120,
  },
  gridCelly12x11: {
    position: "absolute",
    left: 110,
    top: 120,
  },
  gridCelly12x12: {
    position: "absolute",
    left: 120,
    top: 120,
  },
  gridCelly12x13: {
    position: "absolute",
    left: 130,
    top: 120,
  },
  gridCelly12x14: {
    position: "absolute",
    left: 140,
    top: 120,
  },
  gridCelly12x15: {
    position: "absolute",
    left: 150,
    top: 120,
  },

  gridCelly13x1: {
    position: "absolute",
    left: 10,
    top: 130,
  },
  gridCelly13x2: {
    position: "absolute",
    left: 20,
    top: 130,
  },
  gridCelly13x3: {
    position: "absolute",
    left: 30,
    top: 130,
  },
  gridCelly13x4: {
    position: "absolute",
    left: 40,
    top: 130,
  },
  gridCelly13x5: {
    position: "absolute",
    left: 50,
    top: 130,
  },
  gridCelly13x6: {
    position: "absolute",
    left: 60,
    top: 130,
  },
  gridCelly13x7: {
    position: "absolute",
    left: 70,
    top: 130,
  },
  gridCelly13x8: {
    position: "absolute",
    left: 80,
    top: 130,
  },
  gridCelly13x9: {
    position: "absolute",
    left: 90,
    top: 130,
  },
  gridCelly13x10: {
    position: "absolute",
    left: 100,
    top: 130,
  },
  gridCelly13x11: {
    position: "absolute",
    left: 110,
    top: 130,
  },
  gridCelly13x12: {
    position: "absolute",
    left: 120,
    top: 130,
  },
  gridCelly13x13: {
    position: "absolute",
    left: 130,
    top: 130,
  },
  gridCelly13x14: {
    position: "absolute",
    left: 140,
    top: 130,
  },
  gridCelly13x15: {
    position: "absolute",
    left: 150,
    top: 130,
  },

  gridCelly14x1: {
    position: "absolute",
    left: 10,
    top: 140,
  },
  gridCelly14x2: {
    position: "absolute",
    left: 20,
    top: 140,
  },
  gridCelly14x3: {
    position: "absolute",
    left: 30,
    top: 140,
  },
  gridCelly14x4: {
    position: "absolute",
    left: 40,
    top: 140,
  },
  gridCelly14x5: {
    position: "absolute",
    left: 50,
    top: 140,
  },
  gridCelly14x6: {
    position: "absolute",
    left: 60,
    top: 140,
  },
  gridCelly14x7: {
    position: "absolute",
    left: 70,
    top: 140,
  },
  gridCelly14x8: {
    position: "absolute",
    left: 80,
    top: 140,
  },
  gridCelly14x9: {
    position: "absolute",
    left: 90,
    top: 140,
  },
  gridCelly14x10: {
    position: "absolute",
    left: 100,
    top: 140,
  },
  gridCelly14x11: {
    position: "absolute",
    left: 110,
    top: 140,
  },
  gridCelly14x12: {
    position: "absolute",
    left: 120,
    top: 140,
  },
  gridCelly14x13: {
    position: "absolute",
    left: 130,
    top: 140,
  },
  gridCelly14x14: {
    position: "absolute",
    left: 140,
    top: 140,
  },
  gridCelly14x15: {
    position: "absolute",
    left: 150,
    top: 140,
  },

  gridCelly15x1: {
    position: "absolute",
    left: 10,
    top: 150,
  },
  gridCelly15x2: {
    position: "absolute",
    left: 20,
    top: 150,
  },
  gridCelly15x3: {
    position: "absolute",
    left: 30,
    top: 150,
  },
  gridCelly15x4: {
    position: "absolute",
    left: 40,
    top: 150,
  },
  gridCelly15x5: {
    position: "absolute",
    left: 50,
    top: 150,
  },
  gridCelly15x6: {
    position: "absolute",
    left: 60,
    top: 150,
  },
  gridCelly15x7: {
    position: "absolute",
    left: 70,
    top: 150,
  },
  gridCelly15x8: {
    position: "absolute",
    left: 80,
    top: 150,
  },
  gridCelly15x9: {
    position: "absolute",
    left: 90,
    top: 150,
  },
  gridCelly15x10: {
    position: "absolute",
    left: 100,
    top: 150,
  },
  gridCelly15x11: {
    position: "absolute",
    left: 110,
    top: 150,
  },
  gridCelly15x12: {
    position: "absolute",
    left: 120,
    top: 150,
  },
  gridCelly15x13: {
    position: "absolute",
    left: 130,
    top: 150,
  },
  gridCelly15x14: {
    position: "absolute",
    left: 140,
    top: 150,
  },
  gridCelly15x15: {
    position: "absolute",
    left: 150,
    top: 150,
  },
});
