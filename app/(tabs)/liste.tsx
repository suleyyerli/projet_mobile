// le screen qui affiche la liste des transactions revenus et depenses par date et avec un recapitulatif des revenues et dépenses et epargne du mois en question
// avec un bouton pour ajouter une transaction en cliquant sur une categorie
// avec un bouton pour ajouter une categorie

import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import * as SQLite from "expo-sqlite";
import { Transaction } from "../../constants/types";
import Card from "../../components/ui/Card";
import AjoutTransaction from "../../components/AjoutTransaction";
import AjoutCategorie from "../../components/AjoutCategorie";
import { Ionicons } from "@expo/vector-icons";
import Badge from "../../components/ui/Badge";
export default function Liste() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categoriesUpdated, setCategoriesUpdated] = useState(false);

  const fetchTransactions = async () => {
    const db = await SQLite.openDatabaseAsync("madb.db");
    const allRows = await db.getAllAsync(`
      SELECT Transactions.*, Categories.nom AS categorie_nom 
      FROM Transactions 
      JOIN Categories ON Transactions.categorie_id = Categories.id 
      ORDER BY date DESC
    `);
    setTransactions(allRows as Transaction[]);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const supprimerTransaction = async (id: number) => {
    const db = await SQLite.openDatabaseAsync("madb.db");
    await db.runAsync("DELETE FROM Transactions WHERE id = ?", [id]);
    fetchTransactions();
  };

  const handleCategorieAdded = () => {
    fetchTransactions();
    setCategoriesUpdated((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "column", gap: 10 }}>
        <AjoutTransaction
          onTransactionAdded={fetchTransactions}
          categoriesUpdated={categoriesUpdated}
        />
        <AjoutCategorie onCategorieAdded={handleCategorieAdded} />
      </View>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <View style={styles.transactionRow}>
              <View style={styles.transactionDetails}>
                <Text
                  style={[
                    styles.montant,
                    { color: item.type === "Depense" ? "red" : "green" },
                  ]}
                >
                  {item.type === "Depense" ? "-" : "+"}
                  {item.montant}€
                </Text>
                <Badge>
                  <Text style={styles.categorie}>
                    {item.categorie_nom || "Aucune catégorie"}
                  </Text>
                </Badge>
              </View>
              <View style={styles.transactionDetails}>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.date}>
                  {new Date(item.date * 1000).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.trashIconContainer}>
                <Ionicons
                  style={styles.trashIcon}
                  name="trash"
                  size={24}
                  color="red"
                  onPress={() => supprimerTransaction(item.id)}
                />
              </View>
            </View>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  card: {
    margin: 10,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  transactionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  transactionDetails: {
    flex: 1,
    marginHorizontal: 5,
  },
  montant: {
    fontSize: 25,
    fontWeight: "bold",
    paddingBottom: 5,
  },
  categorie: {
    fontSize: 16,
    color: "#666",
  },
  description: {
    fontSize: 14,
    color: "#999",
    marginBottom: 2,
  },
  date: {
    fontSize: 14,
    color: "#999",
    marginTop: 2,
  },
  trashIcon: {},
  trashIconContainer: {
    marginLeft: "auto", // Pousse l'icône à l'extrême droite
  },
});
