"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function generateSampleData(range: string) {
  // produce a few sample rows based on range; in real app, fetch server-side
  const rows = [];
  const count = range === "30" ? 10 : 5;
  for (let i = 0; i < count; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    rows.push({
      date: date.toISOString().slice(0, 10),
      product: i % 3 === 0 ? "Organic Tomatoes" : i % 3 === 1 ? "Fresh Spinach" : "Organic Carrots",
      quantity: (i + 1) * 5,
      revenue: ((i + 1) * 5 * 50).toFixed(2),
    });
  }
  return rows;
}

export default function AnalyticsExportPage() {
  const params = useSearchParams();
  const range = params.get("range") || "30";

  const data = useMemo(() => generateSampleData(range), [range]);

  const downloadCSV = () => {
    const header = ["date", "product", "quantity", "revenue"];
    const csv = [header.join(",")].concat(
      data.map((r) => [r.date, r.product, r.quantity, r.revenue].join(","))
    ).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `farm-analytics-${range}-days.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Export Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Exporting analytics for the last {range} days.</p>
          <div className="space-x-2">
            <Button onClick={downloadCSV}>Download CSV</Button>
            <Button variant="outline" onClick={() => alert("PDF export not implemented in this demo")}>Download PDF</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
