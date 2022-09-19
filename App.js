import { StatusBar } from 'expo-status-bar';
import { Alert, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from "react";
import { useState, useEffect } from "react";
import { TextInput } from 'react-native';

export default function App() {
  const [randomNumber1, setRandomNumber1] = useState();
  const [randomNumber2, setRandomNumber2] = useState();
  const [answer, setAnswer] = useState();
  const [userInput, setUserInput] = useState("");
  const [answerString, setAnswerString] = useState();
  const [userInputString, setUserInputString] = useState();
  const [answerWhereRelevantDigitHappens, setanswerWhereRelevantDigitHappens] = useState();
  const [scoreArray, setScoreArray] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  //set up a function
  const generateRandomNumber = () => {
    let tempNumber1 = Math.floor(Math.random() * 900) + 100
    setRandomNumber1(tempNumber1);
    // create a variable named tempNumber2 that is less than tempNumber1 and greater than 10
    let tempNumber2 = Math.floor(Math.random() * (tempNumber1 - 10)) + 10
    setRandomNumber2(tempNumber2);

    let tempAnswer = (tempNumber2 / tempNumber1)*100;
    setAnswer(tempNumber2 / tempNumber1);

    //convert tempAnswer to string and then to array
    let tempAnswerArray = tempAnswer.toString().split("");
    setAnswerString(tempAnswerArray);
  }


  return (
    <View style={styles.container}>
      {/* display scoreArray */}
      <Text>Score Array:{scoreArray}</Text>

      <Text>Random Number 1: {randomNumber1}</Text>
      <Text>Random Number 2: {randomNumber2}</Text>
      

      {/*a TouchableOpacity that when you click on it, it will refresh randomnumber1 and randomnumber2 */}
      <TouchableOpacity 
       style={styles.next_button}
        onPress={() => {generateRandomNumber();}}>
        <Text style={styles.button_text}>Next</Text>
      </TouchableOpacity>
      
      {/* input field synced with userInput */}
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
        onChangeText={text => setUserInput(text)}
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

        
        //if tempUserInputString is empty then alert incorrect
        if (tempUserInputString.length == 0) {
          alert("Field is empty");
        } else{
          for (let i = 0; i < 9; i++) {
            if (answerString[i] != "0") {
              let tempAnswerWhereRelevantDigitHappens = i;
              setanswerWhereRelevantDigitHappens(tempAnswerWhereRelevantDigitHappens);
              if (answerString[i]==tempUserInputString[i] && answerString[i+1]==tempUserInputString[i+1]){
                //push O to scoreArray whenver the user gets the answer correct
                let tempScoreArray = [...scoreArray];
                tempScoreArray.push("O");
                setScoreArray(tempScoreArray);
                
                //make modal visible
                setModalVisible(true);

              } else {
                //push X to scoreArray whenver the user gets the answer incorrect
                let tempScoreArray = [...scoreArray];
                tempScoreArray.push("X");
                setScoreArray(tempScoreArray);

                //make modal visible
                setModalVisible(true);
              }
              break;
            }
          }
        }
      }}><Text style={styles.button_text}>Check</Text></TouchableOpacity>

      
      
      {/* display answer */}
      <Text>Answer: {(answer * 100).toFixed(5)}%</Text>

      {/* display modal that contains a touchableOpacity that says next whenever Correct alert appears */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        // onRequestClose={() => {
        //   Alert.alert("Modal has been closed.");
        //   setModalVisible(!modalVisible);
        // }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
            {`
              This is Modal
              Random Number 1: ${randomNumber1}
              Random Number 2: ${randomNumber2}`}
            </Text> 
            <TouchableOpacity 
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text>Exit Modal</Text>
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  next_button:{
    //a button that centers its children
    width: 100,
    height: 50,
    backgroundColor: '#d24dff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    
  },
  check_button:{
    width: 100,
    height: 50,
    backgroundColor: '#1aa3ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  button_text:{
    color: 'white',
    fontSize: 16,
    
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
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
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
});



