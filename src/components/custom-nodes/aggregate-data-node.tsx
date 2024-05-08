import { useAppDispatch, useAppSelector } from "@/hooks/state-hooks";
import { updateCurrentList } from "@/store/reducers/flow-data-slice";
import { setNodes } from "@/store/reducers/nodes-list-slice";
import { FC, memo } from "react";
import { Handle, type NodeProps, Position } from "reactflow";
import CustomNodeTooltip from "./custom-tooltip";

const AggregateDataNode: FC<NodeProps> = memo((props) => {
  const { id, data } = props;
  const { nodes } = useAppSelector((s) => s.flowNodes);
  const dispatch = useAppDispatch();

  const onSelfDelete = (): void => {
    dispatch(setNodes(nodes.filter(n => n.id !== id)));
    dispatch(updateCurrentList([]));
  }

  return <div className="rounded bg-primary p-2 text-secondary">
    <CustomNodeTooltip
      onDelete={onSelfDelete} node="Aggregation"
    />
    <form className="flex w-40 flex-col">
      <div className="mb-1 text-xs">aggregation string:</div>
      <input
        type="text"
        name="aggregation"
        className="rounded border p-1 text-xs placeholder:text-xs"
        placeholder="ex: key:value,key1:value1" />
    </form>
    <Handle position={Position.Left} type="target" />
    <Handle position={Position.Right} type="source" />
  </div>
})

export default AggregateDataNode;