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

export default function App() {
  const [randomNumber1, setRandomNumber1] = useState();
  const [randomNumber2, setRandomNumber2] = useState();
  const [answer, setAnswer] = useState();
  const [userInput, setUserInput] = useState("");
  const [answerString, setAnswerString] = useState();
  const [userInputString, setUserInputString] = useState();
  const [answerWhereRelevantDigitHappens, setanswerWhereRelevantDigitHappens] = useState();
  const [scoreArray, setScoreArray] = useState([]);
  const [modalCorrectAnsVisible, setModalCorrectAnsVisible] = useState(false);
  const [modalIncorrectAnsVisible, setModalIncorrectAnsVisible] = useState(false);
  const [TryCount, setTryCount] = useState(0);
  const [NumbersFromCalculationStepsArray, setNumbersFromCalculationsStepsArray] = useState([]);

  //set up a function that generates two random numbers for Division questions
  const generateRandomNumberDivision = () => {
    let tempNumber1 = Math.floor(Math.random() * 900) + 100;
    setRandomNumber1(tempNumber1);
    // create a variable named tempNumber2 that is less than tempNumber1 and greater than 10
    let tempNumber2 = Math.floor(Math.random() * (tempNumber1 - 10)) + 10;
    setRandomNumber2(tempNumber2);

    let tempAnswer = (tempNumber2 / tempNumber1) * 100;
    setAnswer(tempNumber2 / tempNumber1);

    //convert tempAnswer to string and then to array
    let tempAnswerArray = tempAnswer.toString().split("");
    setAnswerString(tempAnswerArray);
    

    //store the numbers from calculation steps into an array
    let tempAnswer2 = tempNumber2 / tempNumber1;
    let tempAnswer2Array = tempAnswer2.toString().split("");
    console.log(tempAnswer2Array);

    let temp_numbers_from_calculation_steps_Array = [];
    //push randomNumber1 into the array
    temp_numbers_from_calculation_steps_Array.push(tempNumber1);
    //push randomNumber2 into the array
    temp_numbers_from_calculation_steps_Array.push(tempNumber2);


    let tempNumber3 = parseInt(tempAnswer2Array[2]) * tempNumber1
    temp_numbers_from_calculation_steps_Array.push(tempNumber3);

    let tempNumber4 = tempNumber2*10 - tempNumber3
    temp_numbers_from_calculation_steps_Array.push(tempNumber4);

    //get rest of the numbers from calculation steps
    for (let i = 3; i < 10; i++) {
      //Only get the next number from calculation steps if the last number from the calculation step is not 0
      if (temp_numbers_from_calculation_steps_Array[temp_numbers_from_calculation_steps_Array.length-1] != 0 ) {
        let tempNumber5 = parseInt(tempAnswer2Array[i], 10) * tempNumber1;
        temp_numbers_from_calculation_steps_Array.push(tempNumber5);
        
        //Only get the next number from calculation steps if the last number from the calculation step is not 0
        if (temp_numbers_from_calculation_steps_Array[temp_numbers_from_calculation_steps_Array.length-1] != 0 ) {
          let tempNumber6 = temp_numbers_from_calculation_steps_Array[temp_numbers_from_calculation_steps_Array.length-2] * 10 - tempNumber5;
          temp_numbers_from_calculation_steps_Array.push(tempNumber6);
        }
      }
    }

    //push the numbers from calculation step to the state
    setNumbersFromCalculationsStepsArray(temp_numbers_from_calculation_steps_Array);
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

          //if tempUserInputString is empty then alert field is empty
          if (tempUserInputString.length == 0) {
            alert("Field is empty");
          } else {
            //if userInputString is not empty (meaning user has entered something)
            for (let i = 0; i < 9; i++) {
              if (answerString[i] != "0") {
                let tempAnswerWhereRelevantDigitHappens = i;
                setanswerWhereRelevantDigitHappens(
                  tempAnswerWhereRelevantDigitHappens
                );
                //Check if the user input is correct
                if (
                  answerString[i] == tempUserInputString[i] &&
                  answerString[i + 1] == tempUserInputString[i + 1]
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
                } else { //If the user input is incorrect
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
              {/* display calculation steps */}
              {/* print numbersfromcalculationsteparray */}
              {NumbersFromCalculationStepsArray[0]}
              ,{NumbersFromCalculationStepsArray[1]}
              ,{NumbersFromCalculationStepsArray[2]}
              ,{NumbersFromCalculationStepsArray[3]}
              ,{NumbersFromCalculationStepsArray[4]}

                    
            </Text>

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
});
