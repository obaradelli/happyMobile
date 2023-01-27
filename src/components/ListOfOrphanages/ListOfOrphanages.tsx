import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Text, View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import api from "../../services/api";

interface Orphanage {
  id: number;
  name: string;
  about: string;
  instructions: string;
  opening_hours: string;
  open_on_weekends: boolean;
  images: Array<{
    id: number;
    url: string;
  }>;
}

export default function ListOfOrphanages() {
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);
  const navigation = useNavigation();

  function handleNavigateToOrphanageDetails(id: number) {
    navigation.navigate("OrphanageDetails", { id });
  }

  const getOrphanages = async () => {
    const { data } = await api.get("orphanages");

    setOrphanages(data);
  };

  useEffect(() => {
    getOrphanages();
  }, []);

  return (
    <FlatList
      data={orphanages}
      keyExtractor={(orphanage) => orphanage.name}
      renderItem={({ item }) => (
        <View style={styles.border}>
          <TouchableOpacity
            key={item.id}
            style={styles.view}
            onPress={() => handleNavigateToOrphanageDetails(item.id)}
          >
            <Image style={styles.image} source={{ uri: item.images[0].url }} />
            <View>
              <Text style={styles.text}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
      contentContainerStyle={orphanages.length === 0 && { flex: 1 }}
      ListEmptyComponent={() => <View></View>}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,

    alignItems: "center",
    flexDirection: "row",
    padding: 10,
    paddingLeft: 5,
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: "#8fa7b3",
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 5,
  },
  text: {
    marginLeft: 20,
    color: "#15B6D6",

    fontSize: 20,
    fontWeight: "600",
  },
});
