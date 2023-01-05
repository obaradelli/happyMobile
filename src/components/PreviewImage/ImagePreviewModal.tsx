import { styles } from "../../pages/CreateOrphanage/styles";
import { FontAwesome } from "@expo/vector-icons";
import { Image, Modal, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface I_ImagePreviwModal {
  imagePreview: string;
  isOpenModalImagePreview: boolean;
  setIsOpenModalImagePreview: (value: boolean) => void;
  deleteImageAndCloseModal: (image: string) => void;
}

export const ImagePreviewModal = ({
  imagePreview,
  isOpenModalImagePreview,
  deleteImageAndCloseModal,
  setIsOpenModalImagePreview,
}: I_ImagePreviwModal) => {
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isOpenModalImagePreview}
    >
      <SafeAreaView style={styles.modalView}>
        <Image
          style={{ width: "100%", height: "85%", borderRadius: 20 }}
          source={{ uri: imagePreview }}
        />

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
                setIsOpenModalImagePreview(false);
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
              name="trash"
              size={50}
              color="#15B6D6"
              onPress={() => {
                deleteImageAndCloseModal(imagePreview);
              }}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};
