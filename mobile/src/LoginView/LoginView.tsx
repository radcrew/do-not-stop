import { FC, useState } from "react";
import { InputField } from "../InputField";
import { client } from "../client";
import { Button, StyleSheet, View } from "react-native";

export const LoginView: FC = () => {
  const [usedOneTimePasswordMethod, setUsedOneTimePasswordMethod] = useState<
    "email" | "sms" | null
  >(null);

  const renderContent = () => {
    if (usedOneTimePasswordMethod !== null) {
      const onSubmit = (token: string) => {
        if (usedOneTimePasswordMethod === "email") {
          client.auth.email.verifyOTP(token);
        } else if (usedOneTimePasswordMethod === "sms") {
          client.auth.sms.verifyOTP(token);
        }
      };

      return (
        <>
          <InputField key="otp" placeholder="OTP token" onSubmit={onSubmit} />
          <Button
            title="Cancel"
            onPress={() => setUsedOneTimePasswordMethod(null)}
          />
        </>
      );
    }

    return (
      <>
        <InputField
          key="email"
          placeholder="Email login"
          onSubmit={(email) =>
            client.auth.email
              .sendOTP(email)
              .then(() => setUsedOneTimePasswordMethod("email"))
          }
        />
        <InputField
          key="sms"
          placeholder="US/CA SMS login"
          onSubmit={(phone) =>
            client.auth.sms
              .sendOTP({ dialCode: "1", iso2: "us", phone })
              .then(() => setUsedOneTimePasswordMethod("sms"))
          }
        />
        <Button
          title="Connect with Farcaster"
          onPress={() => client.auth.social.connect({ provider: "farcaster" })}
        />
        <Button
          title="Connect with Google"
          onPress={() => client.auth.social.connect({ provider: "google" })}
        />
        <Button
          onPress={() => client.ui.auth.show()}
          title="Open Auth Flow UI"
        />
      </>
    );
  };

  return <View style={styles.container}>{renderContent()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: "100%",
    minWidth: "100%",
    alignContent: "stretch",
    gap: 40,
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Add a semi-transparent white overlay
  },
  logo: {
    width: 200,
    height: 200,
    alignSelf: "center",
    marginBottom: 20,
  },
});
