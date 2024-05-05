import { unparse } from "papaparse";

export const exportDateToFile = async (jsonData: object[], fileName: string, exportType: ".csv" | ".json" = ".json") => {
  try {
    let dataBlob;

    if (exportType === ".json") {
      dataBlob = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json" });
    } else if (exportType === ".csv") {
      dataBlob = new Blob([unparse(jsonData)], { type: "text/csv" });
    } else {
      throw new Error("Unsupported file type selected for data export");
    }

    const link = document.createElement("a");
    link.href = URL.createObjectURL(dataBlob);
    link.download = fileName + exportType;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
  } catch (error) {
    console.error("Error exporting data:", error);
    throw error;
  }
};
