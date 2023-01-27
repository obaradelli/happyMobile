import { LogBox, Switch, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import api from "../../services/api";
import Logotipo from "../../images/Logotipo.svg";
import {
  ButtonLogin,
  Container,
  DivLogin,
  Linear,
  Password,
  User,
} from "./styles";

export default function Login() {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberLogin, setRememberLogin] = useState(false);

  useEffect(() => {
    loadSavedLogin();
  }, []);

  const handleRememberLogin = async () => {
    setRememberLogin((prev) => !prev);
    if (!rememberLogin) {
      await AsyncStorage.setItem("password", password);
      await AsyncStorage.setItem("email", email);
    } else {
      await AsyncStorage.removeItem("password");
      await AsyncStorage.removeItem("email");
    }
  };

  const handlePasswordChange = async (text: string) => {
    setPassword(text);
    if (rememberLogin) {
      await AsyncStorage.setItem("password", text);
    }
  };

  const handleEmailChange = async (text: string) => {
    setEmail(text);
    if (rememberLogin) {
      await AsyncStorage.setItem("email", text);
    }
  };

  const loadSavedLogin = async () => {
    const savedPassword = await AsyncStorage.getItem("password");
    const savedEmail = await AsyncStorage.getItem("email");

    if (savedPassword && savedEmail) {
      setPassword(savedPassword);
      setEmail(savedEmail);

      setRememberLogin(true);
    }
  };

  function handleLogin(email: string, password: string) {
    api
      .post("/sessions", {
        email,
        password,
      })
      .then((response) => {
        if (response.data.token) {
          console.log("sucess");
          navigation.navigate("OrphanagesMap");
        }
      });
  }

  return (
    <Container>
      <Logotipo width={400} />

      <DivLogin>
        <User
          placeholder="Email"
          value={email}
          onChangeText={(text) => handleEmailChange(text.toLowerCase())}
        ></User>
        <Password
          style={{ marginTop: 25 }}
          placeholder="Senha"
          value={password}
          onChangeText={(text) => handlePasswordChange(text)}
          secureTextEntry
        ></Password>

        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}
        >
          <Switch
            value={rememberLogin}
            onValueChange={handleRememberLogin}
            style={{ marginRight: 10 }}
          ></Switch>
          <Text style={{ color: "white" }}>Lembrar Login</Text>
        </View>

        <ButtonLogin onPress={() => handleLogin(email, password)}>
          <Text style={{ color: "white", fontWeight: "bold" }}>Entrar</Text>
        </ButtonLogin>
      </DivLogin>
    </Container>
  );
}
