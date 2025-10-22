import { Button, StyleSheet, TextInput, View } from "react-native";

import { FC, useState } from "react";

export type LoginViewProps = {
  onSubmit: (text: string) => void;
  placeholder?: string;
};

export const InputField: FC<LoginViewProps> = ({ onSubmit, placeholder }) => {
  const [content, setContent] = useState("");

  return (
    <View style={styles.section}>
      <TextInput
        style={styles.section__input}
        placeholder={placeholder}
        onChangeText={setContent}
        value={content}
      />

      <Button title="Submit" onPress={() => onSubmit(content)} />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
  },

  section__input: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    paddingHorizontal: 3,
    paddingVertical: 5,
  },
});
