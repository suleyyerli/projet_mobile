import React, { useState } from "react";
import {
  View,
  Button,
  TextInput,
  Modal,
  Text,
  TouchableOpacity,
} from "react-native";
import * as SQLite from "expo-sqlite";
import { Ionicons } from "@expo/vector-icons";
import UIButton from "./ui/UIButton";

export default function AjoutCategorie({
  onCategorieAdded,
}: {
  onCategorieAdded: () => void;
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [typeModalVisible, setTypeModalVisible] = useState(false);
  const [nom, setNom] = useState("");
  const [type, setType] = useState("Depense");

  const handleAddCategorie = async () => {
    if (nom && type) {
      const db = await SQLite.openDatabaseAsync("madb.db");
      try {
        await db.runAsync(`INSERT INTO Categories (nom, type) VALUES (?, ?)`, [
          nom,
          type,
        ]);
        console.log("Catégorie ajoutée avec succès");
        onCategorieAdded();
        setNom("");
        setType("Depense");
        setModalVisible(false);
      } catch (error) {
        console.error("Erreur lors de l'ajout de la catégorie:", error);
      }
    } else {
      console.error("Nom ou type invalide");
    }
  };

  return (
    <View>
      <UIButton text="Catégorie" onPress={() => setModalVisible(true)} />
      <Modal visible={modalVisible} animationType="slide">
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Ajouter une catégorie</Text>
          <TextInput
            placeholder="Nom de la catégorie"
            value={nom}
            onChangeText={setNom}
            style={{ borderWidth: 1, padding: 5, marginVertical: 10 }}
          />
          <TouchableOpacity onPress={() => setTypeModalVisible(true)}>
            <Text style={{ borderWidth: 1, padding: 5, marginVertical: 10 }}>
              {type}
            </Text>
          </TouchableOpacity>
          <Modal visible={typeModalVisible} transparent={true}>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
            >
              <View
                style={{
                  backgroundColor: "white",
                  padding: 20,
                  borderRadius: 10,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setType("Depense");
                    setTypeModalVisible(false);
                  }}
                >
                  <Text>Depense</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setType("Revenu");
                    setTypeModalVisible(false);
                  }}
                >
                  <Text>Revenu</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <Button title="Ajouter" onPress={handleAddCategorie} />
          <Button title="Fermer" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
}
