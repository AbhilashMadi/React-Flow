
export type Operation = {
  icon: JSX.Element;
  label: string;
  explain: string;
  input: string[]
  result: string[];
  onClick: () => void;
}

export type JSONValue = string | number | boolean | null | JSONObject | JSONArray;

interface JSONObject {
  [key: string]: JSONValue;
}

interface JSONArray extends Array<JSONValue> { }