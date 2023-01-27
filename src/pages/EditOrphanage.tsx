import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

import { styles } from "./CreateOrphanage/styles";

import api from "../services/api";
import { Camera } from "expo-camera";
import { CameraModal } from "../components/Camera/CameraModal";
import { ImagePreviewModal } from "../components/PreviewImage/ImagePreviewModal";

interface OrphanageDetailsRouteParam {
  id: number;
}

interface Orphanage {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  about: string;
  instructions: string;
  opening_hours: string;
  open_on_weekends: boolean;
  images: Array<{
    id: number;
    url: string;
  }>;
}

export default function EditOrphanage() {
  const route = useRoute();
  const navigation = useNavigation();
  const params = route.params as OrphanageDetailsRouteParam;

  const [orphanage, setOrphanage] = useState<Orphanage>({} as Orphanage);

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

  const getOrphanage = () => {
    api.get(`orphanages/${params.id}`).then((response) => {
      setOrphanage(response.data);
      response.data.images.map(({ url }) => {
        setImages((prev) => [...prev, url]);
      });
    });
  };

  useEffect(() => {
    getOrphanage();
  }, [params.id]);

  function handleNavigateToMapAndDeleteOrphanage() {
    navigation.navigate("OrphanagesMap");
    api.delete(`orphanages/delete/${params.id}`).then((response) => {});
  }

  async function handleCreateOrphanage() {
    try {
      const data = new FormData();
      data.append("name", orphanage.name);
      data.append("about", orphanage.about);
      data.append("latitude", String(orphanage.latitude));
      data.append("longitude", String(orphanage.longitude));
      data.append("instructions", orphanage.instructions);
      data.append("opening_hours", orphanage.opening_hours);
      data.append("open_on_weekends", String(orphanage.open_on_weekends));
      images.forEach((image, index) =>
        data.append("images", {
          name: `image_${index}.jpg`,
          type: "image/jpg",
          uri: image,
        } as any)
      );

      await api.post("orphanages", data);
      handleNavigateToMapAndDeleteOrphanage();
      navigation.navigate("OrphanagesMap");
    } catch (error) {
      console.error(error);
    }
  }

  function savePicture(capturedPhoto: string) {
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

  const updateName = (newName: string) => {
    const orphanageWithNewName = {
      ...orphanage,
      name: newName,
    };

    setOrphanage(orphanageWithNewName);
  };

  const updateAbout = (newAbout: string) => {
    const orphanageWithNewAbout = {
      ...orphanage,
      about: newAbout,
    };

    setOrphanage(orphanageWithNewAbout);
  };

  const updateInstructions = (newInstructions: string) => {
    const orphanageWithNewInstructions = {
      ...orphanage,
      instructions: newInstructions,
    };

    setOrphanage(orphanageWithNewInstructions);
  };

  const updateOpeningHours = (newOpeningHours: string) => {
    const orphanageWithNewOpeningHours = {
      ...orphanage,
      opening_hours: newOpeningHours,
    };

    setOrphanage(orphanageWithNewOpeningHours);
  };

  const updateOpenOnWeekends = (newOpenOnWeekends: boolean) => {
    const orphanageWithNewOpenOnWeekends = {
      ...orphanage,
      open_on_weekends: newOpenOnWeekends,
    };

    setOrphanage(orphanageWithNewOpenOnWeekends);
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
        <TextInput
          style={styles.input}
          value={orphanage.name}
          onChangeText={updateName}
        />

        <Text style={styles.label}>Sobre</Text>
        <TextInput
          style={[styles.input, { height: 110 }]}
          multiline
          value={orphanage.about}
          onChangeText={updateAbout}
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
          value={orphanage.instructions}
          onChangeText={updateInstructions}
        />

        <Text style={styles.label}>Horario de visitas</Text>
        <TextInput
          style={styles.input}
          value={orphanage.opening_hours}
          onChangeText={updateOpeningHours}
        />

        <View style={styles.switchContainer}>
          <Text style={styles.label}>Atende final de semana?</Text>
          <Switch
            thumbColor="#fff"
            trackColor={{ false: "#ccc", true: "#39CC83" }}
            value={orphanage.open_on_weekends}
            onValueChange={updateOpenOnWeekends}
          />
        </View>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => handleCreateOrphanage()}
        >
          <Text style={styles.nextButtonText}>Editar</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}
