
"use client";

import { Button } from "@/components/ui/button";

type ExportAllApplicationsButtonProps = {
  applications: {
    jobTitle: string;
    candidateName: string;
    email: string;
    createdAt: string;
    status: string;
  }[];
};

export default function ExportAllApplicationsButton({
  applications,
}: ExportAllApplicationsButtonProps) {
  function exportToCSV() {
    const statusLabels: Record<string, string> = {
      PENDING: "Oczekuje",
      ACCEPTED: "Zaakceptowane",
      REJECTED: "Odrzucone",
    };

    const rows = [
      [
        "Stanowisko",
        "Imię i nazwisko",
        "Adres e-mail",
        "Data zgłoszenia",
        "Status",
      ],
      ...applications.map((application) => [
        application.jobTitle,
        application.candidateName,
        application.email,
        application.createdAt,
        statusLabels[application.status] || application.status,
      ]),
    ];

    const csvContent = rows
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(";"),
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "wszystkie-zgloszenia-devjobs.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <Button variant="outline" onClick={exportToCSV}>
      Eksportuj wszystkie zgłoszenia
    </Button>
  );
}
