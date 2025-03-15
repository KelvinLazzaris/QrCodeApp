import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { CameraView } from "expo-camera";
import { useRouter } from "expo-router";

export default function Index() {
  const [facing, setFacing] = useState("back");
  const [scanned, setScanned] = useState(false);
  const [qrData, setQrData] = useState("");
  const [qrList, setQrList] = useState([]);
  const router = useRouter();

  // Função para carregar os dados do AsyncStorage
  const loadQrList = async () => {
    try {
      const storedQrList = await AsyncStorage.getItem("qrList");
      if (storedQrList) {
        setQrList(JSON.parse(storedQrList));
      }
    } catch (error) {
      console.error("Erro ao carregar qrList do AsyncStorage:", error);
    }
  };

  // Função para salvar os dados no AsyncStorage
  const saveQrList = async (list) => {
    try {
      await AsyncStorage.setItem("qrList", JSON.stringify(list));
    } catch (error) {
      console.error("Erro ao salvar qrList no AsyncStorage:", error);
    }
  };

  useEffect(() => {
    loadQrList();
  }, []);

  useEffect(() => {
    saveQrList(qrList);
  }, [qrList]);

  // Alterna entre câmera frontal e traseira
  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  // Função chamada ao escanear um QR Code
  const handleCamera = ({ type, data }) => {
    setScanned(true);
    setQrData(data);
    setQrList((prevList) => [...prevList, { url: data, timestamp: new Date().toLocaleString() }]);
    Alert.alert("QR Code Escaneado", `Conteúdo: ${data}`);
  };

  // Redireciona para a tela de histórico
  const irParaHistorico = () => {
    router.push({ pathname: "/historico", params: { qrList: JSON.stringify(qrList) } });
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={scanned ? undefined : handleCamera}
      />
      
      {/* Ícone flutuante para inverter a câmera */}
      <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
        <Ionicons name="camera-reverse" size={30} color="white" />
      </TouchableOpacity>

      <View style={styles.controles}>
        {qrList.length > 0 && (
          <TouchableOpacity style={styles.button} onPress={irParaHistorico}>
            <Text style={styles.text}>Ver Histórico</Text>
          </TouchableOpacity>
        )}
        {scanned && (
          <TouchableOpacity style={styles.button} onPress={() => setScanned(false)}>
            <Text style={styles.text}>Escanear Novamente</Text>
          </TouchableOpacity>
        )}
      </View>

      {qrData !== "" && (
        <View style={styles.result}>
          <Text style={styles.resultText}>{qrData}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    flex: 1,
  },
  flipButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 50,
    padding: 10,
  },
  controles: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  result: {
    position: "absolute",
    bottom: 80,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 10,
    borderRadius: 5,
    alignSelf: "center",
  },
  resultText: {
    fontSize: 16,
    color: "black",
  },
});
