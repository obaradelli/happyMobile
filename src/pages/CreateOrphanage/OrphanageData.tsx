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

import { styles } from "./styles";

import api from "../../services/api";
import { Camera } from "expo-camera";
import { CameraModal } from "./CameraModal";
import { ImagePreviewModal } from "./ImagePreviewModal";

interface OrphanageDataRouteParams {
  position: { latitude: number; longitude: number };
}

export default function OrphanageData() {
  const route = useRoute();
  const navigation = useNavigation();
  const params = route.params as OrphanageDataRouteParams;

  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [instructions, setInstructions] = useState("");
  const [opening_hours, setOpeningHours] = useState("");
  const [open_on_weekends, setOpenOnWeekends] = useState(true);

  const { latitude, longitude } = params.position;

  const [isOpenCameraModal, setIsOpenCameraModal] = useState(false);
  const [hasPermision, setHasPermision] = useState(null);

  const [images, setImages] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState("");
  const [isOpenModalImagePreview, setIsOpenModalImagePreview] = useState(false);

  const changeIsOpenCameraModal = (value: boolean) => {
    setIsOpenCameraModal(value);
  };

  const changeisOpenModalImagePreview = (value: boolean) => {
    setIsOpenModalImagePreview(value);
  };

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

  async function savePicture(capturedPhoto: string) {
    setImages([...images, capturedPhoto]);
  }

  const deleteImageAndCloseModal = (image: string) => {
    const newImages: string[] = [];

    images.forEach((uri) => {
      if (uri !== image) {
        newImages.push(uri);
      }
    });

    setImages(newImages);
    setIsOpenModalImagePreview(false);
  };

  const fetchPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermision(status === "granted");
  };

  useEffect(() => {
    fetchPermission();
  }, []);

  if (hasPermision === null) {
    return <View />;
  }

  if (hasPermision === false) {
    return <Text>Acesso negado!</Text>;
  }

  return (
    <>
      <CameraModal
        isOpenCameraModal={isOpenCameraModal}
        setIsOpenCameraModal={changeIsOpenCameraModal}
        savePicture={savePicture}
      />

      <ImagePreviewModal
        imagePreview={imagePreview}
        isOpenModalImagePreview={isOpenModalImagePreview}
        setIsOpenModalImagePreview={changeisOpenModalImagePreview}
        deleteImageAndCloseModal={deleteImageAndCloseModal}
      />

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
              <TouchableOpacity
                key={i}
                onPress={() => {
                  setImagePreview(image);
                  setIsOpenModalImagePreview(true);
                }}
              >
                <Image source={{ uri: image }} style={styles.uploadedImage} />
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.imagesInput}
          onPress={() => {
            setIsOpenCameraModal(true);
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
    </>
  );
}
