
export type Operation = {
  icon: JSX.Element;
  label: string;
  explain: string;
  input: string[]
  result: string[];
  nodeName: CustomNodes;
  type: "source" | "target",
}

export enum CustomNodes {
  INITIAL_NODE = "initialNode",
  FILTER_DATA_NODE = "filterDataNode",
  MERGE_DATA_NODE = "mergeDataNode",
  GROUPD_DATA_NODE = "groupDataNode",
  SLICE_DATA_NODE = "sliceDataNode",
  SORT_DATA_NODE = "sortDataNode",
  REDUCE_VALUE_NODE = "reduceValueNode",
  CONTAIN_DATA_NODE = "containDataNode",
  DELETE_DATA_NODE = "deleteDataNode",
  FIND_DATA_NODE = "findDataNode",
  AGGREGATE_DATA_NODE = "aggregateDataNode",
}

export type JSONValue = string | number | boolean | null | JSONObject | JSONArray;

interface JSONObject {
  [key: string]: JSONValue;
}

interface JSONArray extends Array<JSONValue> { }