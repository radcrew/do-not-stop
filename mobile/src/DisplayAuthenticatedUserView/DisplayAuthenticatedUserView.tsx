import { useReactiveClient } from "@dynamic-labs/react-hooks";
import { FC } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import nacl_util from "tweetnacl-util";
import { client } from "../client";
import { Wallet } from "@dynamic-labs/client";

export const DisplayAuthenticatedUserView: FC = () => {
  const { auth, wallets } = useReactiveClient(client);

  const handleSignEVMMessage = async (wallet: Wallet) => {
    const walletClient = await client.viem.createWalletClient({
      wallet,
    });
    await walletClient.signMessage({ message: "gm!" });
  };

  const handleSignSolanaMessage = async (wallet: Wallet) => {
    const message = "gm";
    const messageBytes = nacl_util.decodeUTF8(message);
    const signer = client.solana.getSigner({ wallet });
    await signer.signMessage(messageBytes);
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.section__heading}>User:</Text>
        <View style={styles.content_section}>
          <Text>{JSON.stringify(auth.authenticatedUser, null, 2)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.section__heading}>Actions</Text>
        <View style={[styles.content_section, styles.actions_section]}>
          <Button
            onPress={() => client.ui.userProfile.show()}
            title="User Profile UI"
          />
          <Button onPress={() => client.auth.logout()} title="Logout" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.section__heading}>Wallets:</Text>
        <View style={styles.content_section}>
          {wallets.userWallets.map((wallet) => (
            <View key={wallet.id} style={styles.wallet_item}>
              <Text>Wallet address: {wallet.address}</Text>
              <Text>Chain: {wallet.chain}</Text>

              {wallet.chain === "EVM" && (
                <Button
                  title="Sign message (EVM)"
                  onPress={() => handleSignEVMMessage(wallet)}
                />
              )}

              {wallet.chain === "SOL" && (
                <View style={styles.button_group}>
                  <Button
                    title="Sign message (Solana)"
                    onPress={() => handleSignSolanaMessage(wallet)}
                  />
                </View>
              )}
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.section__heading}>JWT:</Text>
        <View style={styles.content_section}>
          <Text>{auth.token}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignContent: "stretch",
    gap: 40,
    padding: 20,
  },
  section: {
    gap: 5,
  },
  section__heading: {
    fontSize: 14,
    fontWeight: "bold",
  },
  content_section: {
    padding: 10,
    borderRadius: 6,
    backgroundColor: "#f9f9f9",
  },
  actions_section: {
    flexDirection: "column",
    gap: 6,
  },
  wallet_item: {
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eaeaea",
  },
  button_group: {
    marginTop: 8,
    gap: 8,
  },
});
