import { useReactiveClient } from "@dynamic-labs/react-hooks";
import { FC } from "react";
import { client } from "../client";
import { LoginView } from "../LoginView";
import { DisplayAuthenticatedUserView } from "../DisplayAuthenticatedUserView";
import { Text } from "react-native";

export const Home: FC = () => {
  const { auth, sdk } = useReactiveClient(client);

  if (!sdk.loaded) {
    return <Text>Loading...</Text>;
  }

  if (auth.token) {
    return <DisplayAuthenticatedUserView />;
  }

  return <LoginView />;
};
