import { View, Text } from "react-native";
import * as DB from "../scripts/sqlitedb";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  const router = useRouter();

  useDrizzleStudio(DB.db);

  useEffect(() => {
    DB.createTable().then(() => {
      console.log("Base de données initialisée");
      router.push("/(tabs)/home");
    });
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Chargement...</Text>
    </View>
  );
}
