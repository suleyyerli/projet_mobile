// le screen qui affiche le global revenus et depenses sous forme de graphique, courbe de revenus et depenses
// le screen qui affiche le solde Total de revenue et de depenses
// Affiche l'epargne mensuelle et l'epargne annuelle
// Resumé par mois et par annee
import { View, Text, StyleSheet } from "react-native";
import RevenuSemaine from "../../components/RevenuSemaine";
import Card from "../../components/ui/Card";
export default function Details() {
  return (
    <View>
      <Text style={styles.title}>Details</Text>
      <View style={styles.container}>
        <RevenuSemaine />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 15,
    textAlign: "center",
    color: "#333",
  },
});
