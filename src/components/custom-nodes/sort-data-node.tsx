import { useAppDispatch, useAppSelector, useData } from "@/hooks/state-hooks"
import { FC, memo } from "react"
import { type NodeProps, Position, Handle } from "reactflow"
import CustomNodeTooltip from "./custom-tooltip";
import { setNodes } from "@/store/reducers/nodes-list-slice";
import { useFormik } from "formik";
import { updateCurrentList } from "@/store/reducers/flow-data-slice";
import { sortData } from "@/lib/sorters";
import { LogLevels } from "@/types/context";
import { GripHorizontal } from "lucide-react";

const SortDataNode: FC<NodeProps> = memo((props) => {
  const { data, id } = props;
  const { nodes } = useAppSelector((s) => s.flowNodes);
  const dispatch = useAppDispatch();
  const { generateLog } = useData();

  const sortFormik = useFormik<{
    column: string;
    order: "asc" | "dsc";
  }>({
    enableReinitialize: true,
    initialValues: {
      column: "",
      order: "dsc",
    },
    onSubmit: (values) => {
      const { column, order } = values;
      try {
        const nodeIndex = nodes.findIndex(o => o.id === id);
        if (nodeIndex === -1) return;

        const sortedData = sortData(data, column, order);
        dispatch(setNodes([
          ...nodes.slice(0, nodeIndex),
          { ...nodes[nodeIndex], data: sortedData },
          ...nodes.slice(nodeIndex + 1),
        ]))
        dispatch(updateCurrentList(sortedData));
        generateLog(`sorted [DATASET]: ${data.length}, order: ${order === "asc" ? "ascending ↑" : "descending ↓"}`, LogLevels.INFO);
      } catch (error) {
        console.log(error);
      }
    }
  })

  const onSelfDelete = (): void => {
    dispatch(setNodes(nodes.filter(n => n.id !== id)));
    dispatch(updateCurrentList([]));
  }

  return <div className="rounded bg-primary p-2 text-secondary">
    <CustomNodeTooltip
      onClearForm={sortFormik.resetForm}
      onDelete={onSelfDelete}
      onRun={sortFormik.handleSubmit}
      disableRun={!sortFormik.values.column || !sortFormik.values.order}
      node="Sort" />
    <form className="flex flex-col gap-2 text-secondary">
      <select name="column" onChange={sortFormik.handleChange} value={sortFormik.values.column} className="border text-xs">
        {Object.keys(data[0] ?? {}).map(s => <option value={s} className="text-xs">{s}</option>)}
      </select>
      <select name="order" onChange={sortFormik.handleChange} value={sortFormik.values.order} className="border text-xs">
        <option value="asc" className="text-xs">ascending</option>
        <option value="dsc" className="text-xs">descending</option>
      </select>
    </form>
    <Handle position={Position.Left} type="target" />
    <Handle position={Position.Right} type="source" />
    <div className="grid-center mt-1 h-4">
      <GripHorizontal />
    </div>
  </div>
})

export default SortDataNode;
