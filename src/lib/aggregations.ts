import { LogLevels, type AppContextState } from "@/types/context";

/**
 * Filter data based on aggregation conditions.
 * @example
 * aggregateData("key:value, key1:value1", data, generateLog);
 * @param aggregationString Aggregation string in the format "key:value, key1:value1".
 * @param data Array of objects to filter.
 * @param generateLog Function to generate log messages.
 * @returns Filtered array of objects.
 */
export const aggregateData = (aggregationString: string, data: Record<string, any>[], generateLog: AppContextState["generateLog"]): any[] => {
  // Check if aggregationString is empty
  if (!aggregationString.trim()) {
    generateLog("Aggregation string is empty.", LogLevels.ERROR);
    return [];
  }

  const conditions = aggregationString.split(",");
  // Check if no conditions are provided
  if (conditions.length === 0) {
    generateLog("No conditions provided in the aggregation string.", LogLevels.ERROR);
    return [];
  }

  return data.filter((obj) => {
    let conditionMet = true;

    for (const condition of conditions) {
      const [key, value] = condition.trim().split(":");

      // Check if the key exists in the object
      if (!(key in obj)) {
        conditionMet = false;
        break;
      }

      // Compare the value with the object's value
      if (obj[key] !== value) {
        conditionMet = false;
        break;
      }
    }

    return conditionMet;
  });
};
