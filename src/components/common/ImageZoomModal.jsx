import { Image, Modal, TouchableOpacity, View } from "react-native";
import { ImageViewer } from "react-native-image-zoom-viewer";
import { Octicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

export default function ImageZoomModal({ modalOpen, setModalOpen, images }) {
  return (
    <Modal visible={modalOpen} transparent={false}>
      <ImageViewer
        renderIndicator={() => null}
        renderHeader={() => (
          <View style={{ position: "fixed", top: 45, left: 15, zIndex: 50 }}>
            <TouchableOpacity
              onPress={() => {
                setModalOpen(false);
              }}
            >
              <Octicons name="x" size={30} style={{ color: "white" }} />
            </TouchableOpacity>
          </View>
        )}
        imageUrls={images}
        renderImage={(props) => <Image {...props} />}
      />

      <StatusBar style="light" />
    </Modal>
  );
}
