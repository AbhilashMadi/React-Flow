
export const aggregateData = (aggregationString: string, data: Record<string, any>[]): any[] => {
  if (!aggregationString.trim()) {
    throw new Error("Aggregation string is empty.");
  }

  const conditions = aggregationString.split(",");
  if (conditions.length === 1 && !conditions[0].includes(":")) {
    throw new Error("No conditions provided in the aggregation string.");
  }

  // convert conditions to an object for faster lookup
  const conditionMap: Record<string, string> = {};
  for (const condition of conditions) {
    const [key, value] = condition.trim().split(":");
    conditionMap[key] = value;
  }

  // filter data based on conditions
  return data.filter((obj) => {
    for (const key in conditionMap) {
      if (!(key in obj) || obj[key] !== conditionMap[key]) {
        return false; // Object doesn't meet the condition
      }
    }
    return true; // Object meets all conditions
  });
};
