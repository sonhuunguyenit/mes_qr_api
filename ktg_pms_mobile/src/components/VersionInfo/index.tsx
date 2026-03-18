import { Column, Text } from "~/common";
import { CONFIG } from "~/constants/config";
import * as Updates from "expo-updates";
import moment from "moment";
import { StyleSheet } from "react-native";

const formatDateTime = (text: string | undefined | Date, format?: string) => {
  if (!text) return "";
  const date = moment(text);
  if (!date.isValid()) return "";
  return date.format(format ?? "DD/MM/YYYY HH:mm");
};

export const VersionInfo = () => {
  const { channel = "", createdAt } = Updates;
  const formattedDate = createdAt ? formatDateTime(createdAt) : "";

  return (
    <Column
      width="100%"
      justify="center"
      align="center"
      style={styles.container}
    >
      <Text style={styles.text}>{`Môi trường: ${CONFIG.NODE_ENV}`}</Text>
      <Text style={styles.text}>{`Môi trường nhúng: ${channel}`}</Text>
      <Text style={styles.text}>{`Cập nhật: ${formattedDate}`}</Text>
    </Column>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 25,
  },
  text: {
    color: "#666",
    fontSize: 12,
    marginHorizontal: 6,
  },
});
