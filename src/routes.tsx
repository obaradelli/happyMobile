import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import OrphanagesMap from "./pages/OrphanagesMap";
import OrphanageDetails from "./pages/OrphanageDetails";

import SelectMapPosition from "./pages/CreateOrphanage/SelectMapPosition";
import OrphanageData from "./pages/CreateOrphanage/OrphanageData";
import Header from "./components/Header/Header";
import ListOfOrphanages from "./components/ListOfOrphanages/ListOfOrphanages";
import EditOrphanage from "./pages/EditOrphanage";
import Login from "./pages/Login/Login";

const Stack = createNativeStackNavigator();

export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#f2f3f5" },
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="OrphanagesMap" component={OrphanagesMap} />

        <Stack.Screen
          name="OrphanageDetails"
          component={OrphanageDetails}
          options={{
            headerShown: true,
            header: () => <Header showCancel={false} title="Orfanato" />,
          }}
        />

        <Stack.Screen
          name="OrphanageListDetails"
          component={ListOfOrphanages}
          options={{
            headerShown: true,
            header: () => (
              <Header showCancel={false} title="Lista de Orfanatos" />
            ),
          }}
        />

        <Stack.Screen
          name="EditOrphanage"
          component={EditOrphanage}
          options={{
            headerShown: true,
            header: () => <Header showCancel={false} title="Edite os dados" />,
          }}
        />

        <Stack.Screen
          name="SelectMapPosition"
          component={SelectMapPosition}
          options={{
            headerShown: true,
            header: () => <Header title="Selecione no mapa" />,
          }}
        />
        <Stack.Screen
          name="OrphanageData"
          component={OrphanageData}
          options={{
            headerShown: true,
            header: () => <Header title="Iforme os dados" />,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
