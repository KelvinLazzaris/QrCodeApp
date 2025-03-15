import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Linking, Button, Share, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Historico() {
  const { qrList } = useLocalSearchParams();
  const [qrListArray, setQrListArray] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const loadQrList = async () => {
      try {
        const storedQrList = await AsyncStorage.getItem("qrList");
        if (storedQrList) {
          setQrListArray(JSON.parse(storedQrList));
        }
      } catch (error) {
        console.error("Erro ao carregar QR Codes do armazenamento:", error);
      }
    };
    loadQrList();
  }, []);

  useEffect(() => {
    if (qrList) {
      try {
        const parsedList = JSON.parse(qrList);
        setQrListArray(parsedList);
        AsyncStorage.setItem("qrList", JSON.stringify(parsedList));
      } catch (error) {
        console.error("Erro ao analisar JSON:", error);
        setQrListArray([]);
      }
    }
  }, [qrList]);

  const limparHistorico = async () => {
    setQrListArray([]);
    await AsyncStorage.removeItem("qrList");
  };

  const QRCodeItem = ({ item, index }) => {
    const { url, timestamp } = item;
    const [isValidURL, setIsValidURL] = useState(false);

    useEffect(() => {
      const checkURL = async () => {
        const valid = await Linking.canOpenURL(url);
        setIsValidURL(valid);
      };
      checkURL();
    }, [url]);

    return (
      <View style={styles.listItem}>
        {isValidURL ? (
          <Text
            style={[styles.listText, { color: "blue", textDecorationLine: "underline" }]}
            onPress={() => Linking.openURL(url)}
            onLongPress={() => Share.share({ message: url })}
          >
            {url}
          </Text>
        ) : (
          <Text style={styles.listText}>{`${index + 1}. ${url}`}</Text>
        )}
        <Text style={styles.timestampText}>Escaneado em: {timestamp}</Text>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.historyContainer,
        darkMode && { backgroundColor: "#000" },
      ]}
    >
      <Text style={[styles.historyTitle, darkMode && { color: "#fff" }]}>Histórico de QR Codes Escaneados</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => setDarkMode(!darkMode)} style={styles.iconButton}>
          <FontAwesome name={darkMode ? "sun-o" : "moon-o"} size={24} color={darkMode ? "yellow" : "black"} />
        </TouchableOpacity>
        <TouchableOpacity onPress={limparHistorico} style={styles.iconButton}>
          <MaterialIcons name="delete" size={24} color="red" />
        </TouchableOpacity>
      </View>
      <View style={styles.counterContainer}>
        <Text style={styles.counterText}>Total de QR Codes: {qrListArray.length}</Text>
      </View>
      <FlatList
        data={qrListArray}
        renderItem={({ item, index }) => <QRCodeItem item={item} index={index} />}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={<Text style={darkMode && { color: "#fff" }}>Nenhum QR Code escaneado ainda</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  historyContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  historyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#000",
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  listText: {
    fontSize: 16,
    color: "#000",
  },
  timestampText: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },
  counterContainer: {
    flex: 0.5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "yellow",
    marginVertical: 10,
  },
  counterText: {
    fontSize: 16,
    color: "#555",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  iconButton: {
    marginHorizontal: 10,
  },
});
