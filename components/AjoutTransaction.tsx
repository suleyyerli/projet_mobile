// Composant qui permet d'ajouter des transactions
// il permet de sélectionner une catégorie, de saisir le montant, la description et de valider l'ajout
// modal pour sélectionner la catégorie, input pour le montant, input pour la description, bouton pour valider
import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  Modal,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import * as SQLite from "expo-sqlite";
import { Category } from "../constants/types";
import { Ionicons } from "@expo/vector-icons";
import UIButton from "./ui/UIButton";

export default function AjoutTransaction({
  onTransactionAdded,
  categoriesUpdated,
}: {
  onTransactionAdded: () => void;
  categoriesUpdated: boolean;
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [montant, setMontant] = useState("");
  const [description, setDescription] = useState("");

  const fetchCategories = async () => {
    const db = await SQLite.openDatabaseAsync("madb.db");
    const allRows = await db.getAllAsync("SELECT * FROM Categories");
    setCategories(allRows as Category[]);
  };

  useEffect(() => {
    fetchCategories();
  }, [categoriesUpdated]);

  useEffect(() => {
    if (modalVisible) {
      fetchCategories();
    }
  }, [modalVisible]);

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setModalVisible(false);
  };

  const handleAddTransaction = async () => {
    if (selectedCategory && montant && description) {
      const montantNum = parseFloat(montant);
      if (!isNaN(montantNum)) {
        const db = await SQLite.openDatabaseAsync("madb.db");
        try {
          await db.runAsync(
            `INSERT INTO Transactions (categorie_id, montant, description, type) VALUES (?, ?, ?, ?)`,
            [
              selectedCategory.id,
              montantNum,
              description,
              selectedCategory.type,
            ]
          );
          console.log("Transaction ajoutée avec succès");
          onTransactionAdded();
          setSelectedCategory(null);
          setMontant("");
          setDescription("");
        } catch (error) {
          console.error("Erreur lors de l'ajout de la transaction:", error);
        }
      } else {
        console.error("Montant invalide");
      }
    }
  };

  return (
    <View>
      <UIButton text="Transaction" onPress={() => setModalVisible(true)} />
      <Modal visible={modalVisible} animationType="slide">
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Sélectionner une catégorie</Text>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => handleCategorySelect(category)}
              style={{
                padding: 10,
                backgroundColor: "#ddd",
                marginVertical: 5,
              }}
            >
              <Text>{category.type}</Text>
              <Text>{category.nom}</Text>
            </TouchableOpacity>
          ))}
          <Button title="Fermer" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
      {selectedCategory && (
        <View>
          <Text>Catégorie sélectionnée: {selectedCategory.nom}</Text>
          <TextInput
            placeholder="Saisir le montant"
            keyboardType="numeric"
            value={montant}
            onChangeText={setMontant}
            style={{ borderWidth: 1, padding: 5, marginVertical: 10 }}
          />
          <TextInput
            placeholder="Saisir la description"
            value={description}
            onChangeText={setDescription}
            style={{ borderWidth: 1, padding: 5, marginVertical: 10 }}
          />
          <Button title="Ajouter" onPress={handleAddTransaction} />
        </View>
      )}
    </View>
  );
}
