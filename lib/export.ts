export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  columns?: { key: keyof T; label: string }[]
) {
  if (data.length === 0) {
    console.warn("No data to export");
    return;
  }

  const headers = columns
    ? columns.map((col) => col.label)
    : Object.keys(data[0]);

  const rows = data.map((item) => {
    const keys = columns ? columns.map((col) => col.key) : Object.keys(item);
    return keys.map((key) => {
      const value = item[key];
      if (value === null || value === undefined) return "";
      const stringValue = String(value);
      return stringValue.includes(",")
        ? `"${stringValue.replace(/"/g, '""')}"`
        : stringValue;
    });
  });

  const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join(
    "\n"
  );

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToJSON<T>(data: T, filename: string) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.json`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
