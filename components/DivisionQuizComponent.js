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
    // let tempNumber1 = Math.floor(Math.random() * 900) + 100;
    let tempNumber1 = 400;
    setRandomNumber1(tempNumber1);
    // create a variable named tempNumber2 that is less than tempNumber1 and greater than 10
    // let tempNumber2 = Math.floor(Math.random() * (tempNumber1 - 10)) + 10;
    let tempNumber2 = 100;
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

    // //get rest of the numbers from calculation steps
    // for (let i = 3; i < 20; i++) {
    //   //Only get the next number from calculation steps if the last number from the calculation step is not 0
    //   if (temp_numbers_from_calculation_steps_Array[temp_numbers_from_calculation_steps_Array.length - 1]) {
    //     let tempNumber5 = parseInt(tempAnswer2Array[i], 10) * tempNumber1;
    //     temp_numbers_from_calculation_steps_Array.push(tempNumber5);

    //     //Only get the next number from calculation steps if the last number from the calculation step is not 0
    //     if (temp_numbers_from_calculation_steps_Array[temp_numbers_from_calculation_steps_Array.length - 1] != 0) {
    //       let tempNumber6 =
    //         temp_numbers_from_calculation_steps_Array[temp_numbers_from_calculation_steps_Array.length - 2] * 10 -
    //         tempNumber5;
    //       temp_numbers_from_calculation_steps_Array.push(tempNumber6);
    //     }
    //   }
    // }

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
    console.log("Numbers From Calculation Steps Array" + NumbersFromCalculationStepsArray);

    //setting up useful variable to use within this function
    let randomNumber1Length = randomNumber1.toString().length;
    let randomnumber2Length = randomNumber2.toString().length;
    let randomNumber1Array = randomNumber1.toString().split("");
    let randomNumber2Array = randomNumber2.toString().split("");

    //figure out how many rows and columns are needed
    //number of columns required -1 to account for the decimal point
    let columnsNeeded = randomNumber1Length + randomnumber2Length + answerStringInPercent.length - 1;
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
    for (let i = 0; i < tempAnswerStringArray.length && i < 11 - randomNumber1Length - randomnumber2Length + 1; i++) {
      let replacer = tempAnswerStringArray[i];
      tempGrid[0][randomNumber1Length + randomnumber2Length + i - 1] = replacer;
    }

    //number3 from calculation steps
    //fill up the grid from left to right
    //if NumbersFromCalculationStepsArray[2] is empty then do nothing
    if (NumbersFromCalculationStepsArray[2] && NumbersFromCalculationStepsArray[2] != "" && tempGrid[2]) {
      let tempNumberfromCalcStep3Array = NumbersFromCalculationStepsArray[2].toString().split("").reverse();
      for (let i = 0; i < tempNumberfromCalcStep3Array.length; i++) {
        let replacer = tempNumberfromCalcStep3Array[i];
        tempGrid[2][randomNumber1Length + randomnumber2Length - i] = replacer;
      }
    }

    //number4 from calcultion steps
    //fill up the grid from left to right
    //if NumbersFromCalculationStepsArray[3] is empty then do nothing
    if (NumbersFromCalculationStepsArray[3] && NumbersFromCalculationStepsArray[3] != "" && tempGrid[3]) {
      let tempNumberfromCalcStep4Array = NumbersFromCalculationStepsArray[3].toString().split("").reverse();
      for (let i = 0; i < tempNumberfromCalcStep4Array.length; i++) {
        let replacer = tempNumberfromCalcStep4Array[i];
        tempGrid[3][randomNumber1Length + randomnumber2Length - i] = replacer;
      }
    }

    //number5 from calcultion steps
    //fill up the grid from left to right
    //if NumbersFromCalculationStepsArray[4] is empty then do nothing
    if (NumbersFromCalculationStepsArray[4] && NumbersFromCalculationStepsArray[4] != "" && tempGrid[4]) {
      let tempNumberfromCalcStep5Array = NumbersFromCalculationStepsArray[4].toString().split("").reverse();  
      for (let i = 0; i < tempNumberfromCalcStep5Array.length; i++) {
        let replacer = tempNumberfromCalcStep5Array[i];
        tempGrid[4][randomNumber1Length + randomnumber2Length + 1 - i] = replacer;
      }
      console.log("number 4: " + NumbersFromCalculationStepsArray[4]);
    }

    //number6 from calculation steps
    //fill up the grid from left to right
    //if NumbersFromCalculationStepsArray[5] is empty then do nothing
    if (NumbersFromCalculationStepsArray[5] && NumbersFromCalculationStepsArray[5] != "" && tempGrid[5]) {
      let tempNumberfromCalcStep6Array = NumbersFromCalculationStepsArray[5].toString().split("").reverse();
      for (let i = 0; i < tempNumberfromCalcStep6Array.length; i++) {
        let replacer = tempNumberfromCalcStep6Array[i];
        tempGrid[5][randomNumber1Length + randomnumber2Length + 1 - i] = replacer;
      }
      console.log("number 5: " + NumbersFromCalculationStepsArray[5]);
    }

    //number7 from calculation steps
    //fill up the grid from left to right
    //if NumbersFromCalculationStepsArray[6] is empty then do nothing
    if (NumbersFromCalculationStepsArray[6] && NumbersFromCalculationStepsArray[6] != "" && tempGrid[6]) {
      let tempNumberfromCalcStep7Array = NumbersFromCalculationStepsArray[6].toString().split("").reverse();

      for (let i = 0; i < tempNumberfromCalcStep7Array.length; i++) {
        let replacer = tempNumberfromCalcStep7Array[i];
        tempGrid[6][randomNumber1Length + randomnumber2Length + 2 - i] = replacer;
      }
      console.log("number 6: " + NumbersFromCalculationStepsArray[6]);
    }

    //number8 from calculation steps
    //fill up the grid from left to right
    //if NumbersFromCalculationStepsArray[7] is empty then do nothing
    if (NumbersFromCalculationStepsArray[7] && NumbersFromCalculationStepsArray[7] != "" && tempGrid[7]) {
      let tempNumberfromCalcStep8Array = NumbersFromCalculationStepsArray[7].toString().split("").reverse();

      for (let i = 0; i < tempNumberfromCalcStep8Array.length; i++) {
        let replacer = tempNumberfromCalcStep8Array[i];
        tempGrid[7][randomNumber1Length + randomnumber2Length + 2 - i] = replacer;
      }

      console.log("number 7: " + NumbersFromCalculationStepsArray[7]);
    }

    //number9 from calculation steps
    //fill up the grid from left to right
    //if NumbersFromCalculationStepsArray[8] is empty then do nothing
    if (NumbersFromCalculationStepsArray[8] && NumbersFromCalculationStepsArray[8] != "" && tempGrid[8]) {
      let tempNumberfromCalcStep9Array = NumbersFromCalculationStepsArray[8].toString().split("").reverse();
      for (let i = 0; i < tempNumberfromCalcStep9Array.length; i++) {
        let replacer = tempNumberfromCalcStep9Array[i];
        tempGrid[8][randomNumber1Length + randomnumber2Length + 3 - i] = replacer;
      }
      console.log("number 8: " + NumbersFromCalculationStepsArray[8]);
    }

    //number10 from calculation steps
    //fill up the grid from left to right
    //if NumbersFromCalculationStepsArray[9] is empty then do nothing
    if (NumbersFromCalculationStepsArray[9] && NumbersFromCalculationStepsArray[9] != "" && tempGrid[9]) {
      let tempNumberfromCalcStep10Array = NumbersFromCalculationStepsArray[9].toString().split("").reverse();
      for (let i = 0; i < tempNumberfromCalcStep10Array.length; i++) {
        let replacer = tempNumberfromCalcStep10Array[i];
        tempGrid[9][randomNumber1Length + randomnumber2Length + 3 - i] = replacer;
      }
      console.log("number 9: " + NumbersFromCalculationStepsArray[9]);
    }


    //number11 from calculation steps
    //fill up the grid from left to right
    //if NumbersFromCalculationStepsArray[10] is empty then do nothing
    if (NumbersFromCalculationStepsArray[10] && NumbersFromCalculationStepsArray[10] != "" && tempGrid[10]) {
      let tempNumberfromCalcStep11Array = NumbersFromCalculationStepsArray[10].toString().split("").reverse();
      for (let i = 0; i < tempNumberfromCalcStep11Array.length; i++) {
        let replacer = tempNumberfromCalcStep11Array[i];
        tempGrid[10][randomNumber1Length + randomnumber2Length + 4 - i] = replacer;
      }
    console.log("number 10: " + NumbersFromCalculationStepsArray[10]);
    }

    //number12 from calculation steps
    //fill up the grid from left to right
    //if NumbersFromCalculationStepsArray[11] is empty then do nothing
    if (NumbersFromCalculationStepsArray[11] && NumbersFromCalculationStepsArray[11] != "" && tempGrid[11]) {
      let tempNumberfromCalcStep12Array = NumbersFromCalculationStepsArray[11].toString().split("").reverse();
      for (let i = 0; i < tempNumberfromCalcStep12Array.length; i++) {
        let replacer = tempNumberfromCalcStep12Array[i];
        tempGrid[11][randomNumber1Length + randomnumber2Length + 4 - i] = replacer;
      }
    console.log("number 11: " + NumbersFromCalculationStepsArray[11]);
    }
  };

  //figure out how to display the grid that is now filled with numbers
  //display tempGrid
  //function that displays the grid
  const displayGrid = () => {
    let finalTempArray = [];
    console.log("tempGrid", tempGrid);

    for (let i = 0; i < tempGrid.length; i++) {
      let veryTempArray = [];
      for (let j = 0; j < tempGrid[i].length; j++) {
        veryTempArray.push(
          <View style={{ width: 9, height: 13 }}>
            <Text>{tempGrid[i][j]}</Text>
          </View>
        );
      }
      finalTempArray.push(<View style={{ flexDirection: "row" }}>{veryTempArray}</View>);
    }

    setTempArray(finalTempArray);
    console.log(finalTempArray);
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
    width: 100,
    height: 100,
    borderWidth: 1,
  },
});
