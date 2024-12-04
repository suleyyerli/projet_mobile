import { Tabs } from "expo-router";

export default () => {
  return (
    <Tabs>
      <Tabs.Screen name="liste" />
      <Tabs.Screen name="details" />
    </Tabs>
  );
};
