import { useAppDispatch, useAppSelector, useData } from "@/hooks/state-hooks";
import { updateCurrentList } from "@/store/reducers/flow-data-slice";
import { setNodes } from "@/store/reducers/nodes-list-slice";
import { useFormik } from "formik";
import { FC, memo } from "react";
import { Handle, type NodeProps, Position } from "reactflow";
import CustomNodeTooltip from "@/components/custom-nodes/custom-tooltip";
import { LogLevels } from "@/types/context";

const ContainDataNode: FC<NodeProps> = memo((props) => {
  const { data, id } = props;
  const { generateLog } = useData();

  const dispatch = useAppDispatch();
  const { nodes } = useAppSelector(state => state.flowNodes);
  const { filedata } = useAppSelector(state => state.flowData);
  const availColumns = filedata.meta?.fields ?? [];

  const containNodeFormik = useFormik<{
    column: string;
    value: string;
    index: number;
  }>({
    enableReinitialize: true,
    initialValues: {
      column: availColumns[0] ?? "",
      value: "",
      index: 0,
    },
    onSubmit: (values) => {
      const { column, value, index } = values;

      if (index < 0 || index > data.length) {
        generateLog(`data set of [DATASET]:${data.length} but you provided index ${index}`, LogLevels.ERROR);
      }

      const record = data[index]

      if (record[column] === value) {
        const nodeIndex = nodes.findIndex(n => n.id === id);

        dispatch(updateCurrentList([record]))
        dispatch(setNodes([
          ...nodes.slice(0, nodeIndex),
          { ...nodes[nodeIndex], data: [record] },
          ...nodes.slice(nodeIndex + 1)
        ]))

        generateLog(`the given ${column}:${value} pair at index:${index} in [DATASET]:${data.length} is matched`, LogLevels.INFO);
      } else {
        generateLog(`the given ${column}:${value} pair at index:${index} in [DATASET]:${data.length} not matched`, LogLevels.WARNING);
      }
    }
  })

  const onSelfDelete = (): void => {
    dispatch(setNodes(nodes.filter(n => n.id !== id)));
    dispatch(updateCurrentList([]));
  }

  return <div className="rounded bg-primary p-2 text-secondary">
    <CustomNodeTooltip
      onDelete={onSelfDelete}
      disableRun={!containNodeFormik.values.column || !containNodeFormik.values.value}
      node="Check Contain"
      onClearForm={containNodeFormik.resetForm}
      onRun={containNodeFormik.handleSubmit} />

    <form className="flex w-40 flex-col gap-1 text-xs">
      <select
        name="column"
        onChange={containNodeFormik.handleChange}
        value={containNodeFormik.values.column}
        className="rounded border">
        <option disabled className="text-xs">column</option>
        {availColumns.map(s => <option value={s} className="text-xs">{s}</option>)}
      </select>
      <input type="text" placeholder="value" className="rounded border px-1"
        value={containNodeFormik.values.value}
        name="value"
        onChange={containNodeFormik.handleChange} />
      <input type="number" min={0} max={data.length} placeholder="index" className="rounded border px-1"
        value={containNodeFormik.values.index}
        name="index"
        onChange={containNodeFormik.handleChange} />
    </form>
    <Handle position={Position.Left} type="target" />
    <Handle position={Position.Right} type="source" />
  </div>
})

export default ContainDataNode;