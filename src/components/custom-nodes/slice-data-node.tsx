import CustomNodeTooltip from "@/components/custom-nodes/custom-tooltip";
import { useAppDispatch, useAppSelector, useData } from "@/hooks/state-hooks";
import { updateCurrentList } from "@/store/reducers/flow-data-slice";
import { setNodes } from "@/store/reducers/nodes-list-slice";
import { LogLevels } from "@/types/context";
import { useFormik } from "formik";
import { FC, memo } from "react";
import { Handle, NodeToolbar, Position, type NodeProps } from "reactflow";

const SliceDataNode: FC<NodeProps> = memo((props) => {
  const { id, data } = props;
  const dispatch = useAppDispatch();
  const { nodes } = useAppSelector((s) => s.flowNodes);
  const { filedata } = useAppSelector((s) => s.flowData);
  const { generateLog } = useData();

  const sliceFormik = useFormik<{
    start: number;
    end: number;
    inclusive: boolean;
  }>({
    enableReinitialize: true,
    initialValues: {
      start: 0,
      end: data?.length,
      inclusive: false,
    },
    onSubmit: (values) => {
      const { start, end, inclusive } = values;

      try {
        const nodeIndex = nodes.findIndex(o => o.id === id);
        if (nodeIndex === -1) return;

        const newData = data.slice(start, inclusive && end !== data.length ? end + 1 : end);
        const newNodes = [
          ...nodes.slice(0, nodeIndex),
          { ...nodes[nodeIndex], data: newData },
          ...nodes.slice(nodeIndex + 1)
        ]

        dispatch(updateCurrentList(newNodes[nodeIndex].data));
        dispatch(setNodes(newNodes));

        generateLog(`Sliced [DATASET]:${data.length} from ${start} to ${end} \n
        available [DATASET]:${newData.length}`, LogLevels.SUCCESS);
      } catch (error) {
        generateLog(`something went wrong while slice the data:\n
        ${error}`, LogLevels.ERROR);
      }
    }
  })

  const onSelfDelete = (): void => {
    dispatch(setNodes(nodes.filter(n => n.id !== id)));
    dispatch(updateCurrentList([]));
  }

  return <div className="rounded bg-primary p-2 text-[10px]">
    <CustomNodeTooltip
      onClearForm={sliceFormik.resetForm}
      onDelete={onSelfDelete}
      onRun={sliceFormik.handleSubmit}
      node="Slice" />
    <form className="flex flex-col gap-2 text-secondary">
      <fieldset>
        <input
          type="number"
          placeholder="start"
          name="start"
          onChange={sliceFormik.handleChange}
          value={sliceFormik.values.start}
          min={0}
          max={data.length}
          className="w-24 rounded border p-1 text-xs" />
        <label className="mx-1 text-xs">to</label>
        <input
          type="number"
          placeholder="end"
          name="end"
          onChange={sliceFormik.handleChange}
          value={sliceFormik.values.end}
          min={sliceFormik.values.start}
          max={data.length}
          className="w-24 rounded border p-1 text-xs" />
      </fieldset>
      <fieldset className="flex items-center gap-1">
        <label className="text-xs">include last one: </label>
        <input type="checkbox" name="inclusive" onChange={sliceFormik.handleChange} />
      </fieldset>
    </form>
    <NodeToolbar position={Position.Bottom}>
      <pre className="text-[10px]">[DATASET]: {data.length} | {filedata.meta?.fields?.length} columns</pre>
    </NodeToolbar>
    <Handle position={Position.Left} type="target" />
    <Handle position={Position.Right} type="source" />
  </div>
});

export default SliceDataNode;