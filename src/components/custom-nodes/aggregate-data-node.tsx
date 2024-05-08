import { useAppDispatch, useAppSelector, useData } from "@/hooks/state-hooks";
import { updateCurrentList } from "@/store/reducers/flow-data-slice";
import { setNodes } from "@/store/reducers/nodes-list-slice";
import { FC, memo, useState } from "react";
import { Handle, type NodeProps, Position } from "reactflow";
import CustomNodeTooltip from "./custom-tooltip";
import { aggregateData } from "@/lib/aggregations";
import { LogLevels } from "@/types/context";

const AggregateDataNode: FC<NodeProps> = memo((props) => {
  const { id, data } = props;
  const { nodes } = useAppSelector((s) => s.flowNodes);
  const { generateLog } = useData();
  const [aggregationString, setAggregationString] = useState<string>("");

  const dispatch = useAppDispatch();

  const handleRun = (): void => {
    try {
      const nodeIndex = nodes.findIndex(n => n.id === id)
      if (nodeIndex === -1) return;

      const aggregatedRecords = aggregateData(aggregationString, data);

      dispatch(setNodes([
        ...nodes.slice(0, nodeIndex),
        { ...nodes[nodeIndex], data: aggregatedRecords },
        ...nodes.slice(nodeIndex + 1),
      ]));
      dispatch(updateCurrentList(aggregatedRecords))

      generateLog(`aggregated over the existing records\n
      aggregation string: ${aggregationString}\n
      old [DATASET]:${data.length}\n
      new [DATASET]:${aggregateData.length - 1}\n
      `, LogLevels.SUCCESS);
    } catch (error) {
      generateLog(`something went wrong while aggregating over the records:\n
      ${error}`, LogLevels.ERROR);
    }
  }

  const onSelfDelete = (): void => {
    dispatch(setNodes(nodes.filter(n => n.id !== id)));
    dispatch(updateCurrentList([]));
  }

  return <div className="rounded bg-primary p-2 text-secondary">
    <CustomNodeTooltip
      onDelete={onSelfDelete} node="Aggregation"
      onClearForm={() => setAggregationString("")}
      onRun={handleRun}
    />
    <form className="flex w-40 flex-col">
      <div className="mb-1 text-xs">aggregation string:</div>
      <input
        type="text"
        name="aggregation"
        onChange={(e) => setAggregationString(e.target.value)}
        className="rounded border p-1 text-xs placeholder:text-xs"
        placeholder="ex: key:value,key1:value1" />
    </form>
    <Handle position={Position.Left} type="target" />
    <Handle position={Position.Right} type="source" />
  </div>
})

export default AggregateDataNode;