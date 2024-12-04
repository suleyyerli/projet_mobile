export interface Category {
  id: number;
  nom: string;
  type: "Depense" | "Revenu";
}

export interface Transaction {
  id: number;
  montant: number;
  type: string;
  description: string;
  date: number;
  categorie_id: number;
  categorie_nom?: string;
}
