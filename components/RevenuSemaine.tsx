// Component que je vais réutiliser dans le screen details pour les stats

import React, { useEffect, useState } from "react";
import { BarChart } from "react-native-gifted-charts";
import * as SQLite from "expo-sqlite";
import { Dimensions } from "react-native";
import Card from "./ui/Card";

const screenWidth = Dimensions.get("window").width;

export default function WeeklyRevenueBarChart() {
  const [revenues, setRevenues] = useState<number[]>([]);

  const fetchWeeklyRevenues = async () => {
    const db = await SQLite.openDatabaseAsync("madb.db");
    const results = await db.getAllAsync(`
      SELECT SUM(montant) as total, strftime('%w', datetime(date, 'unixepoch')) as day
      FROM Transactions
      WHERE type = 'Revenu' AND date >= strftime('%s', 'now', '-7 days')
      GROUP BY day
      ORDER BY day
    `);
    const weeklyRevenues = Array(7).fill(0);
    results.forEach((row: any) => {
      const { total, day } = row;
      weeklyRevenues[parseInt(day)] = total;
    });

    setRevenues(weeklyRevenues);
  };

  useEffect(() => {
    fetchWeeklyRevenues();
  }, []);

  return (
    <Card>
      <BarChart
        data={revenues.map((value, index) => ({
          value,
          label: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"][index],
        }))}
        width={screenWidth - 20}
        height={250}
        barWidth={22}
        noOfSections={4}
        barBorderRadius={4}
        frontColor="lightgray"
        yAxisThickness={0}
        xAxisThickness={0}
      />
    </Card>
  );
}
