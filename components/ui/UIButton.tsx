import {
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface UIButtonProps {
  style?: ViewStyle;
  textStyle?: TextStyle;
  onPress: () => void;
  text: string;
}

export default function UIButton({
  style = {},
  textStyle = {},
  onPress,
  text,
}: UIButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          padding: 10,
          borderRadius: 25,
          backgroundColor: "#e0f0ff",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      <Ionicons
        name="add-circle-outline"
        size={20}
        color="#007aff"
        style={{ marginRight: 5 }}
      />
      <Text style={[{ color: "#007aff", fontSize: 16 }, textStyle]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}
