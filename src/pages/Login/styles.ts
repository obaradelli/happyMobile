import { LinearGradient } from "expo-linear-gradient";
import styled from "styled-components/native";

export const Container = styled.SafeAreaView`
  flex: 1;

  justify-content: center;
  align-items: center;

  background: #00c7c7;
`;

export const DivLogin = styled.View`
  margin-top: 40px;

  background-color: #0000;
  flex-direction: column;

  width: 300px;
`;

export const User = styled.TextInput`
  width: 100%;

  border: 2px solid rgba(250, 250, 250, 1);
  border-radius: 20px;

  justify-content: center;
  align-items: center;

  padding: 10px;

  background: rgba(250, 250, 250, 1);

  color: #2e2e2e;
`;

export const Password = styled.TextInput`
  width: 100%;

  border: 2px solid rgba(250, 250, 250, 1);
  border-radius: 20px;

  justify-content: center;
  align-items: center;

  padding: 10px;

  background: rgba(250, 250, 250, 1);

  color: #2e2e2e;
`;

export const ButtonLogin = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;

  border: 2px solid #ffd666;
  border-radius: 20px;

  justify-content: center;
  align-items: center;

  margin-top: 10px;
  padding: 10px;

  color: #ffd666;
  background-color: #ffd666;
`;

export const Linear = styled(LinearGradient).attrs({
  colors: ["#00C7C7", "#2AB5D1"],
})`
  flex: 1;
`;
