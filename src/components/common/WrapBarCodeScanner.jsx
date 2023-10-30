import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
const SCREEN_WIDTH = Dimensions.get("window").width;
import { Ionicons } from "@expo/vector-icons";
import { BarCodeScanner } from "expo-barcode-scanner";

export default function WrapBarCodeScanner({
  barCodeScannerOpen,
  setBarCodeScannerOpen,
  handleBarCodeScanned,
}) {
  const styles = StyleSheet.create({
    toast: {
      position: "absolute",
      top: 100,
      left: SCREEN_WIDTH / 2 - 130,
      width: 260,
      height: 40,
      backgroundColor: "rgba(244,244,244,0.3)",
      borderRadius: 8,
      zIndex: 15,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    toast_text: {
      color: "white",
      marginLeft: 8,
      fontWeight: "700",
    },
    close_button: {
      position: "absolute",
      bottom: 150,
      left: SCREEN_WIDTH / 2 - 30,
      width: 60,
      height: 60,
      backgroundColor: "rgba(255,255,255,0.8)",
      borderRadius: 30,
      zIndex: 15,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  if (barCodeScannerOpen) {
    return (
      <>
        <View style={styles.toast}>
          <Ionicons name="alert-circle" size={24} color="white" />
          <Text style={styles.toast_text}>
            학생증 뒷면의 바코드를 스캔해주세요 !
          </Text>
        </View>

        <TouchableOpacity
          style={styles.close_button}
          onPress={() => {
            setBarCodeScannerOpen(false);
          }}
        >
          <Ionicons name="close" size={32} color="#a4a4a4" />
        </TouchableOpacity>

        <BarCodeScanner
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.code39]}
          onBarCodeScanned={handleBarCodeScanned}
          style={{
            ...StyleSheet.absoluteFillObject,
            zIndex: 10,
            backgroundColor: "black",
          }}
        />
      </>
    );
  }
}
