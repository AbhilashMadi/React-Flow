export const sortData = (data: any[], column: string, direction: "asc" | "dsc"): any[] => {
  return [...data].sort((a, b) => {
    const valueA = a[column];
    const valueB = b[column];

    const isAsc: boolean = direction === "asc";

    // check for empty values
    if (!valueA && !valueB) {
      return isAsc ? -1 : 1; // Both values are empty, treat them as equal
    } else if (!valueA) {
      return 1; // Value A is empty, push it to the end
    } else if (!valueB) {
      return -1; // Value B is empty, push it to the end
    }

    // Checking for date format
    const dateA = new Date(valueA);
    const dateB = new Date(valueB);

    if (dateA.toString() !== "Invalid Date" && dateB.toString() !== "Invalid Date") {
      return isAsc ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    }

    // Convert values to numbers if possible
    const numA = parseFloat(valueA);
    const numB = parseFloat(valueB);

    // Check if both values are numbers
    if (!Number.isNaN(numA) && !Number.isNaN(numB)) {
      return isAsc ? numA - numB : numB - numA;
    }

    // Check if both values are strings
    if (typeof valueA === "string" && typeof valueB === "string") {
      return isAsc ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    }

    // Fallback to string comparison
    return isAsc ? String(valueA).localeCompare(String(valueB)) : String(valueB).localeCompare(String(valueA));
  });
};
