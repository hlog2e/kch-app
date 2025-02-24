import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CameraView } from "expo-camera";

export default function WrapBarCodeScanner({
  barCodeScannerOpen,
  setBarCodeScannerOpen,
  handleBarCodeScanned,
}) {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      zIndex: 100,
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 150,
    },
    alert: {
      zIndex: 100,
      padding: 8,
      backgroundColor: "rgba(244,244,244,0.3)",
      borderRadius: 8,
      flexDirection: "row",
      alignItems: "center",
    },
    alertText: {
      color: "white",
      marginLeft: 8,
      fontWeight: "700",
    },
    close_button: {
      zIndex: 100,
      backgroundColor: "rgba(255,255,255,0.8)",
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  if (!barCodeScannerOpen) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.alert}>
        <Ionicons name="alert-circle" size={24} color="white" />
        <Text style={styles.alertText}>
          학생증 뒷면의 바코드를 스캔해주세요 !
        </Text>
      </View>

      <TouchableOpacity
        style={styles.close_button}
        onPress={() => setBarCodeScannerOpen(false)}
      >
        <Ionicons name="close" size={32} color="#a4a4a4" />
      </TouchableOpacity>

      <CameraView
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: "black",
        }}
        barCodeScannerSettings={{
          barCodeTypes: ["code39"],
        }}
        onBarcodeScanned={(barcodeData) => handleBarCodeScanned(barcodeData)}
      />
    </View>
  );
}
