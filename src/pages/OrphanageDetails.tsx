import React, { useEffect, useState } from "react";
import {
  Image,
  View,
  ScrollView,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

import mapMarkerImg from "../images/mapMarker.png";
import api from "../services/api";

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

export default function OrphanageDetails() {
  const [orphanage, setOrphanage] = useState<Orphanage>();

  const route = useRoute();

  const params = route.params as OrphanageDetailsRouteParam;

  const navigation = useNavigation();

  useEffect(() => {
    api.get(`orphanages/${params.id}`).then((response) => {
      setOrphanage(response.data);
    });
  }, [params.id]);

  if (!orphanage) {
    return (
      <View style={styles.container}>
        <Text style={styles.description}>Carregando...</Text>
      </View>
    );
  }

  function handleOpenGoogleMapRoutes() {
    Linking.openURL(
      `https://www.google.com/maps/dir/?api=1&destination=${orphanage?.latitude},${orphanage?.longitude}`
    );
  }

  function handleNavigateToEditPage(id: number) {
    navigation.navigate("EditOrphanage", { id });
  }

  function handleNavigateToMapAndDeleteOrphanage() {
    navigation.navigate("OrphanagesMap");
    api.delete(`orphanages/delete/${params.id}`).then((response) => {});
  }

  async function handleDelete() {
    Alert.alert("Deletar", "Deseja deletar o orfanato?", [
      { text: "Não", style: "cancel" },
      { text: "Sim", onPress: () => handleNavigateToMapAndDeleteOrphanage() },
    ]);
  }

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.imagesContainer}>
          <ScrollView horizontal pagingEnabled>
            {orphanage.images.map((image) => {
              return (
                <Image
                  key={image.id}
                  style={styles.image}
                  source={{
                    uri: image.url,
                  }}
                />
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{orphanage.name}</Text>
          <Text style={styles.description}>{orphanage.about}</Text>

          <View style={styles.mapContainer}>
            <MapView
              initialRegion={{
                latitude: orphanage.latitude,
                longitude: orphanage.longitude,
                latitudeDelta: 0.008,
                longitudeDelta: 0.008,
              }}
              zoomEnabled={false}
              pitchEnabled={false}
              scrollEnabled={false}
              rotateEnabled={false}
              style={styles.mapStyle}
            >
              <Marker
                icon={mapMarkerImg}
                coordinate={{
                  latitude: orphanage.latitude,
                  longitude: orphanage.longitude,
                }}
              />
            </MapView>

            <TouchableOpacity
              onPress={handleOpenGoogleMapRoutes}
              style={styles.routesContainer}
            >
              <Text style={styles.routesText}>Ver rotas no Google Maps</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.separator} />

          <Text style={styles.title}>Instruções para visita</Text>
          <Text style={styles.description}>{orphanage.instructions}</Text>

          <View style={styles.scheduleContainer}>
            <View style={[styles.scheduleItem, styles.scheduleItemBlue]}>
              <Feather name="clock" size={40} color="#2AB5D1" />
              <Text style={[styles.scheduleText, styles.scheduleTextBlue]}>
                Segunda à Sexta {orphanage.opening_hours}
              </Text>
            </View>

            {orphanage.open_on_weekends === true ? (
              <View style={[styles.scheduleItem, styles.scheduleItemGreen]}>
                <Feather name="info" size={40} color="#39CC83" />
                <Text style={[styles.scheduleText, styles.scheduleTextGreen]}>
                  Atendemos fim de semana
                </Text>
              </View>
            ) : (
              <View style={[styles.scheduleItem, styles.scheduleItemRed]}>
                <Feather name="info" size={40} color="#ff669d" />
                <Text style={[styles.scheduleText, styles.scheduleTextRed]}>
                  Não Atendemos fim de semana
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.dcs}>
        <TouchableOpacity
          style={styles.Button1}
          onPress={() => {
            handleNavigateToEditPage(orphanage.id);
          }}
        >
          <Text style={styles.contactButtonText}>Editar Orfanato</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.Button2}
          onPress={() => {
            handleDelete();
          }}
        >
          <Text style={styles.contactButtonText}>Deletar Orfanato</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  imagesContainer: {
    height: 240,
  },

  image: {
    width: Dimensions.get("window").width,
    height: 240,
    resizeMode: "cover",
  },

  detailsContainer: {
    padding: 24,
  },

  title: {
    color: "#4D6F80",
    fontSize: 30,
    fontFamily: "Nunito700B",
  },

  description: {
    fontFamily: "Nunito600SB",
    color: "#5c8599",
    lineHeight: 24,
    marginTop: 16,
  },

  mapContainer: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1.2,
    borderColor: "#B3DAE2",
    marginTop: 40,
    backgroundColor: "#E6F7FB",
  },

  mapStyle: {
    width: "100%",
    height: 150,
  },

  routesContainer: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  routesText: {
    fontFamily: "Nunito700B",
    color: "#0089a5",
  },

  separator: {
    height: 0.8,
    width: "100%",
    backgroundColor: "#D3E2E6",
    marginVertical: 40,
  },

  scheduleContainer: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  scheduleItem: {
    width: "48%",
    padding: 20,
  },

  scheduleItemBlue: {
    backgroundColor: "#E6F7FB",
    borderWidth: 1,
    borderColor: "#B3DAE2",
    borderRadius: 20,
  },

  scheduleItemGreen: {
    backgroundColor: "#EDFFF6",
    borderWidth: 1,
    borderColor: "#A1E9C5",
    borderRadius: 20,
  },

  scheduleItemRed: {
    backgroundColor: "#fef6f9",
    borderWidth: 1,
    borderColor: "#ffbcd4",
    borderRadius: 20,
  },

  scheduleText: {
    fontFamily: "Nunito600SB",
    fontSize: 16,
    lineHeight: 24,
    marginTop: 20,
  },

  scheduleTextBlue: {
    color: "#5C8599",
  },

  scheduleTextGreen: {
    color: "#37C77F",
  },

  scheduleTextRed: {
    color: "#ff669d",
  },
  dcs: {
    height: 45,
    borderRadius: 20,
    alignContenr: "center",
    justifyContent: "space-between",
    backgroundColor: "transparent",
    flexDirection: "row",
  },

  Button1: {
    backgroundColor: "rgba(21, 182, 214, 0.700)",

    height: 45,
    width: "50%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    padding: 10,
  },
  Button2: {
    backgroundColor: "rgba(255, 0, 0, 0.700)",

    height: 45,
    width: "50%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    padding: 10,
  },

  contactButtonText: {
    fontFamily: "Nunito800EB",
    color: "#FFF",
    fontSize: 15,
  },
});
