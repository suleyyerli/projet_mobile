# Setup de SQLite dans une application React Native/Expo

## Installation

```bash
npx create-expo-app@latest
// reset le projet permet de partir depuis une base propre
npm run reset-project
// installer expo-sqlite
npm install expo-sqlite
```

## Configuration

1. **Fichier de configuration de la base de données**

- Créer un fichier `sqlitedb.ts` dans le dossier `scripts`

  Ce fichier va contenir la configuration de la base de données SQLite.C'est dans ce fichier que tu créeras tes tables.

- Importé `SQLite` de `expo-sqlite`

  ```typescript
  import * as SQLite from "expo-sqlite";
  ```

- Création de la base de données si pas existante sinon l'ouvre
  Via la commande `SQLite.openDatabaseSync("madb.db")`

  ```typescript
  export const db = SQLite.openDatabaseSync("madb.db");
  ```

- Création des tables
  Via la commande `createTable()` et ensuite l'executer avec `db.execAsync()`

  exemple de création de table d'après le schéma de la documentation officielle

```typescript
import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("madb.db");

export async function createTable() {
  try {
    // Création de tables
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS Categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('Depense', 'Revenu'))
      );
    `);

    console.log("La base de données a été chargée avec succès.");
  } catch (error) {
    console.error("Erreur lors du chargement de la base de données :", error);
  }
}
```

### Installation de drizzle

Ensuite pour faciliter l'utilisation de la base de données, j'ai décidé d'utiliser drizzle pour consulter les requêtes SQL ma base de données etccc....

```bash
npm install expo-drizzle-studio-plugin
```

1. Utilisation de drizzle studio

- Dans le fichier `index.tsx`

```typescript
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
```

Pour le charger charger le avant la base de données sinon les modification ne passerons pas.
Comme ceci :

```typescript
useDrizzleStudio(db);
```

### Charger la base de données avant de lancer l'application

Dans le fichier `index.tsx`

```typescript
useEffect(() => {
  DB.createTable().then(() => {
    console.log("Base de données initialisée");
  });
}, []);
```

exmple global : `index.tsx`

```typescript
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
```

## Effectuer des requêtes SQL

1. Affciher par exemple le contenu de la table `Transactions`

Comment proceder ? D'après la documentation officielle
Affiche les transactions dans une liste

```typescript
export default function Liste() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const db = await SQLite.openDatabaseAsync("madb.db");
      const allRows = await db.getAllAsync("SELECT * FROM Transactions");
      setTransactions(allRows as Transaction[]);
    };

    fetchTransactions();
  }, []);
}
```

Ensuite toujoursdans le fichier `liste.tsx` l'afficher au front avec un `FlatList`

```typescript
  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Text
              style={[
                styles.montant,
                { color: item.type === "Depense" ? "red" : "green" },
              ]}
            >
              {item.type === "Depense" ? "-" : "+"}
              {item.montant}€
            </Text>
            <Text style={styles.categorie}>{item.description}</Text>
            <Text style={styles.date}>
              {new Date(item.date * 1000).toLocaleDateString()}
            </Text>
          </Card>
        )}
      />
    </View>
  );
}
```

J'ai créer un fichier dans le dossier `constants` nommé `types.ts` ou je définie les types des données que je récupère de la base de données. Pour eviter les erreurs de typage et avoir trop de code dans mes composants.

exemple de fichier `types.ts`

```typescript
export interface Category {
  id: number;
  nom: string;
  type: "Depense" | "Revenu";
}

export interface Transaction {
  id: number;
  montant: number;
  date: number;
  description: string;
  type: "Depense" | "Revenu";
}
```

exemple global : `liste.tsx`

```typescript
// le screen qui affiche la liste des transactions revenus et depenses par date et avec un recapitulatif des revenues et dépenses et epargne du mois en question
// avec un bouton pour ajouter une transaction en cliquant sur une categorie
// avec un bouton pour ajouter une categorie

import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import * as SQLite from "expo-sqlite";
import { Transaction } from "../../constants/types";
import Card from "../../components/ui/Card";

export default function Liste() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const db = await SQLite.openDatabaseAsync("madb.db");
      const allRows = await db.getAllAsync("SELECT * FROM Transactions");
      setTransactions(allRows as Transaction[]);
    };

    fetchTransactions();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Text
              style={[
                styles.montant,
                { color: item.type === "Depense" ? "red" : "green" },
              ]}
            >
              {item.type === "Depense" ? "-" : "+"}
              {item.montant}€
            </Text>
            <Text style={styles.categorie}>{item.description}</Text>
            <Text style={styles.date}>
              {new Date(item.date * 1000).toLocaleDateString()}
            </Text>
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
  montant: {
    fontSize: 25,
    fontWeight: "bold",
    paddingBottom: 10,
  },
  categorie: {
    fontSize: 16,
    color: "#666",
  },
  date: {
    fontSize: 14,
    color: "#999",
  },
});
```

## Conclusion

```color:red
J'ai donc réussi à faire fonctionner SQLite dans une application React Native/Expo et à faire des requêtes dessus.
PS J'AI GALERER
```
