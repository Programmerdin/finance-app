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

export default function CompoundingQuizComponent({navigation, route}) {
  
    return (
      <View>
        <StatusBar style="light" />
        <Text>Compounding Quiz Component</Text>

        {/* a TouchableOpacity titled quit */}
        <TouchableOpacity
          style={styles.quit_button}
          onPress={() => {//navigate to MainScreen
            navigation.navigate("MainPage");
          }}
        >
          <Text style={styles.button_text}>Quit</Text>
        </TouchableOpacity>
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
  quit_button: {
    width: 100,
    height: 50,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
})