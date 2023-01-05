import { Camera } from "expo-camera";
import { useRef, useState } from "react";
import {
  Modal,
  TouchableOpacity,
  Image,
  View,
  ActivityIndicator,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { FontAwesome } from "@expo/vector-icons";

import { styles } from "./styles";

interface ICameraModal {
  isOpenCameraModal: boolean;
  setIsOpenCameraModal: (value: boolean) => void;
  savePicture(capturedPhoto: string): Promise<void>;
}

export const CameraModal = ({
  isOpenCameraModal,
  setIsOpenCameraModal,
  savePicture,
}: ICameraModal) => {
  const [isOpenPreviewImageModal, setIsOpenPreviewImageModal] =
    useState<boolean>(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);

  const camRef = useRef(null);

  const handleCheck = () => {
    savePicture(String(capturedPhoto));
    setIsOpenCameraModal(false);
    setIsOpenPreviewImageModal(false);
  };

  async function takePicture() {
    if (camRef) {
      setCapturedPhoto(null);
      setIsOpenPreviewImageModal(true);

      const data = await camRef.current.takePictureAsync({
        skipProcessing: true,
      });

      setCapturedPhoto(data.uri);
    }
  }

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isOpenCameraModal}
    >
      <Camera
        style={{ flex: 1 }}
        type={Camera.Constants.Type.back}
        ref={camRef}
        autoFocus={true}
        focusDepth={5}
      />
      <TouchableOpacity style={styles.button} onPress={takePicture}>
        <FontAwesome name="camera" size={23} color="#fff" />
        <StatusBar hidden={false} backgroundColor={"#fff"} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={false}
        visible={isOpenPreviewImageModal}
      >
        <SafeAreaView style={styles.modalView}>
          {capturedPhoto ? (
            <Image
              style={{ width: "100%", height: "85%", borderRadius: 20 }}
              source={{ uri: capturedPhoto }}
            />
          ) : (
            <View>
              <ActivityIndicator
                style={styles.activityIndicator}
                size="large"
              />
            </View>
          )}

          {capturedPhoto ? (
            <View
              style={{
                margin: 10,
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                marginTop: "auto",

                borderRadius: 10,
              }}
            >
              <TouchableOpacity
                style={{
                  margin: 10,
                  flexDirection: "row",

                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 10,
                  padding: 10,
                }}
              >
                <FontAwesome
                  name="close"
                  size={50}
                  color="#ff0000"
                  onPress={() => {
                    setIsOpenPreviewImageModal(false);
                  }}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  margin: 10,
                  flexDirection: "row",

                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 10,
                  padding: 10,
                }}
                onPress={() => {}}
              >
                <FontAwesome
                  name="check"
                  size={50}
                  color="#15B6D6"
                  onPress={handleCheck}
                />
              </TouchableOpacity>
            </View>
          ) : null}
        </SafeAreaView>
        <StatusBar hidden={false} backgroundColor={"#fff"} />
      </Modal>
    </Modal>
  );
};
