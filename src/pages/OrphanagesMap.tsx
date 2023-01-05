import { useCallback, useState } from "react";

import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from "react-native-maps";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import mapMarker from "../images/mapMarker.png";
import api from "../services/api";

interface Orphanage {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export default function OrphanagesMap() {
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);
  const navigation = useNavigation();

  const getOrphanages = useCallback(async () => {
    const { data } = await api.get("orphanages");

    setOrphanages(data);
  }, []);

  useFocusEffect(() => {
    getOrphanages();
  });

  function handleNavigateToOrphanageDetails(id: number) {
    navigation.navigate("OrphanageDetails", { id });
  }

  function handleNavigateToCreateOrphanage() {
    navigation.navigate("SelectMapPosition");
  }

  function handleVanigateToListOrphanageDetails() {
    navigation.navigate("OrphanageListDetails");
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: -23.6360511,
          longitude: -46.5169581,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008,
        }}
      >
        {orphanages.map((orphanage) => {
          return (
            <Marker
              key={orphanage.id}
              icon={mapMarker}
              calloutAnchor={{ x: 2.7, y: 0.8 }}
              coordinate={{
                latitude: orphanage.latitude,
                longitude: orphanage.longitude,
              }}
            >
              <Callout
                tooltip={true}
                onPress={() => handleNavigateToOrphanageDetails(orphanage.id)}
              >
                <View style={styles.calloutContainer}>
                  <Text style={styles.calloutText}>{orphanage.name}</Text>
                  <Text style={styles.calloutTextSecondary}>Ver mais</Text>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.listOrphanageButton}
          onPress={handleVanigateToListOrphanageDetails}
        >
          <Feather name="list" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.footerText}>
          {orphanages.length} orfanatos encontrados
        </Text>

        <TouchableOpacity
          style={styles.createOrphanageButton}
          onPress={handleNavigateToCreateOrphanage}
        >
          <Feather name="plus" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },

  calloutContainer: {
    width: 160,
    height: 48,
    paddingHorizontal: 16,
    backgroundColor: "#0089a5",
    borderRadius: 16,
    justifyContent: "center",
  },

  calloutText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Nunito700B",
  },
  calloutTextSecondary: {
    color: "#ffffffb5",
    fontSize: 10,
    fontFamily: "Nunito700B",
  },

  footer: {
    position: "absolute",
    left: 24,
    right: 24,
    bottom: 32,

    backgroundColor: "#fff",
    borderRadius: 20,
    height: 56,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    elevation: 3,
  },

  footerText: {
    fontFamily: "Nunito700B",
    // paddingLeft: "20%",
    color: "#8fa7b3",
  },

  createOrphanageButton: {
    width: 56,
    height: 56,
    backgroundColor: "#15c3d6",
    borderRadius: 20,

    justifyContent: "center",
    alignItems: "center",
  },

  listOrphanageButton: {
    width: 56,
    height: 56,
    backgroundColor: "#15c3d6",
    borderRadius: 20,

    justifyContent: "center",
    alignItems: "center",
  },
});
