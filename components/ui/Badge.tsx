import { View, ViewStyle } from "react-native";

interface BadgeProps extends React.PropsWithChildren {
  style?: ViewStyle;
}

export default function Badge({ children, style = {} }: BadgeProps) {
  return (
    <View
      style={{
        paddingVertical: 2,
        paddingHorizontal: 9,
        borderRadius: 12,
        backgroundColor: "#e0f0ff",
        alignSelf: "flex-start",
        flexDirection: "row",
        ...style,
      }}
    >
      {children}
    </View>
  );
}
