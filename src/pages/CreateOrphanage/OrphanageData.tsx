import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

import * as ImagePicker from "expo-image-picker";

import api from "../../services/api";
import { Camera } from "expo-camera";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { FontAwesome } from "@expo/vector-icons";

interface OrphanageDataRouteParams {
  position: { latitude: number; longitude: number };
}

export default function OrphanageData() {
  const route = useRoute();
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [instructions, setInstructions] = useState("");
  const [opening_hours, setOpeningHours] = useState("");
  const [open_on_weekends, setOpenOnWeekends] = useState(true);

  const camRef = useRef(null);
  const [cameraIsOpen, setCameraIsOpen] = useState(false);
  const [hasPermision, setHasPermision] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [open, setOpen] = useState(false);
  const [openModalOne, setOpenModalOne] = useState(false);
  const [loading, setLoading] = useState(true);

  const cameraOptions = { quality: 1.0, base64: false, skipProcessing: true };
  const params = route.params as OrphanageDataRouteParams;
  const { latitude, longitude } = params.position;

  const [images, setImages] = useState<string[]>([]);

  async function handleCreateOrphanage() {
    try {
      const data = new FormData();
      data.append("name", name);
      data.append("about", about);
      data.append("latitude", String(latitude));
      data.append("longitude", String(longitude));
      data.append("instructions", instructions);
      data.append("opening_hours", opening_hours);
      data.append("open_on_weekends", String(open_on_weekends));

      images.forEach((image, index) =>
        data.append("images", {
          name: `image_${index}.jpg`,
          type: "image/jpg",
          uri: image,
        } as any)
      );

      await api.post("orphanages", data);

      navigation.navigate("OrphanagesMap");
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermision(status === "granted");
    })();
  }, []);

  if (hasPermision === null) {
    return <View />;
  }

  if (hasPermision === false) {
    return <Text>Acesso negado!</Text>;
  }

  async function takePicture() {
    if (camRef) {
      setCapturedPhoto(null);
      setOpen(true);

      const data = await camRef.current.takePictureAsync({
        skipProcessing: true,
      });

      setCapturedPhoto(data.uri);
    }
  }

  async function savePicture() {
    // console.log("pprt", capturedPhoto);
    setImages([...images, String(capturedPhoto)]);
  }

  ////////////////////////////////////////////////////////////////
  if (cameraIsOpen) {
    return (
      <Modal animationType="slide" transparent={false} visible={openModalOne}>
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

        <Modal animationType="slide" transparent={false} visible={open}>
          <SafeAreaView style={styles.modalView}>
            {capturedPhoto ? (
              <Image
                style={{ width: "100%", height: "85%", borderRadius: 20 }}
                source={{ uri: capturedPhoto }}
              />
            ) : (
              <View>
                {/* <Text>Loading</Text> */}
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
                      setOpen(false);
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
                    onPress={() => {
                      savePicture();
                      setCameraIsOpen(false);
                      setOpen(false);
                      setOpenModalOne(false);
                    }}
                  />
                </TouchableOpacity>
              </View>
            ) : null}
          </SafeAreaView>
          <StatusBar hidden={false} backgroundColor={"#fff"} />
        </Modal>
      </Modal>
    );
  } else {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ padding: 24 }}
      >
        <Text style={styles.title}>Dados</Text>

        <Text style={styles.label}>Nome</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Text style={styles.label}>Sobre</Text>
        <TextInput
          style={[styles.input, { height: 110 }]}
          multiline
          value={about}
          onChangeText={setAbout}
        />

        <Text style={styles.label}>Fotos</Text>
        <View style={styles.uploadedImageContainer}>
          {images.map((image, i) => {
            return (
              <Image
                key={i}
                source={{ uri: image }}
                style={styles.uploadedImage}
              />
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.imagesInput}
          onPress={() => {
            setCameraIsOpen(true);
            setOpenModalOne(true);
          }}
        >
          <Feather name="plus" size={24} color="#15B6D6" />
        </TouchableOpacity>

        <Text style={styles.title}>Visitação</Text>

        <Text style={styles.label}>Instruções</Text>
        <TextInput
          style={[styles.input, { height: 110 }]}
          multiline
          value={instructions}
          onChangeText={setInstructions}
        />

        <Text style={styles.label}>Horario de visitas</Text>
        <TextInput
          style={styles.input}
          value={opening_hours}
          onChangeText={setOpeningHours}
        />

        <View style={styles.switchContainer}>
          <Text style={styles.label}>Atende final de semana?</Text>
          <Switch
            thumbColor="#fff"
            trackColor={{ false: "#ccc", true: "#39CC83" }}
            value={open_on_weekends}
            onValueChange={setOpenOnWeekends}
          />
        </View>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleCreateOrphanage}
        >
          <Text style={styles.nextButtonText}>Cadastrar</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  title: {
    color: "#5c8599",
    fontSize: 24,
    fontFamily: "Nunito700B",
    marginBottom: 32,
    paddingBottom: 24,
    borderBottomWidth: 0.8,
    borderBottomColor: "#D3E2E6",
  },

  label: {
    color: "#8fa7b3",
    fontFamily: "Nunito600SB",
    marginBottom: 8,
  },

  comment: {
    fontSize: 11,
    color: "#8fa7b3",
  },

  input: {
    backgroundColor: "#fff",
    borderWidth: 1.4,
    borderColor: "#d3e2e6",
    borderRadius: 20,
    height: 56,
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginBottom: 16,
    textAlignVertical: "top",
  },

  uploadedImageContainer: {
    flexDirection: "row",
  },

  uploadedImage: {
    width: 64,
    height: 64,
    borderRadius: 20,
    marginBottom: 32,
    marginRight: 8,
  },

  imagesInput: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderStyle: "dashed",
    borderColor: "#96D2F0",
    borderWidth: 1.4,
    borderRadius: 20,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },

  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
  },

  nextButton: {
    backgroundColor: "#15c3d6",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    height: 56,
    marginTop: 32,
  },

  nextButtonText: {
    fontFamily: "Nunito800EB",
    fontSize: 16,
    color: "#FFF",
  },
  container23: {
    flex: 1,
    justifyContent: "center",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#15B6D6",
    margin: 20,
    borderRadius: 10,
    height: 50,
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
  },
  activityIndicator: {
    color: "#15B6D6",
    height: 50,
    width: 50,
    fontSize: 50,
  },
});
