import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("madb.db");

export async function createTable() {
  try {
    // Création des tables
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS Categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('Depense', 'Revenu'))
      );

      CREATE TABLE IF NOT EXISTS Transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        categorie_id INTEGER,
        montant REAL NOT NULL,
        date INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
        description TEXT,
        type TEXT NOT NULL CHECK (type IN ('Depense', 'Revenu')),
        FOREIGN KEY (categorie_id) REFERENCES Categories (id)
      );
    `);

    console.log("La base de données a été chargée avec succès.");
  } catch (error) {
    console.error("Erreur lors du chargement de la base de données :", error);
  }
}
