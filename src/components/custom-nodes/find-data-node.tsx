import { updateCurrentList } from "@/store/reducers/flow-data-slice";
import { setNodes } from "@/store/reducers/nodes-list-slice";
import { useFormik } from "formik";
import { FC, memo } from "react";
import { Handle, type NodeProps, Position } from "reactflow";
import CustomNodeTooltip from "./custom-tooltip";
import { useAppDispatch, useAppSelector, useData } from "@/hooks/state-hooks";
import { LogLevels } from "@/types/context";
import { GripHorizontal } from "lucide-react";

const FindDataNode: FC<NodeProps> = memo((props) => {
  const { data, id } = props;

  const { nodes } = useAppSelector(s => s.flowNodes);
  const { filedata } = useAppSelector(s => s.flowData);

  const dispatch = useAppDispatch();
  const { generateLog } = useData();

  const availColumns = filedata.meta?.fields ?? [];

  const findNodeFormik = useFormik<{
    column: string;
    value: string;
    findAt: "last" | "first";
  }>({
    enableReinitialize: true,
    initialValues: {
      column: availColumns[0] ?? "",
      value: "",
      findAt: "first",
    },
    onSubmit: (values) => {
      const { column, value, findAt } = values;

      const nodeIndex = nodes.findIndex(n => n.id === id);

      let record: object = {}
      let recordIndex: number | null = null;

      if (findAt === "first") {
        record = data.find((o, i: number) => {
          if (o[column] === value) {
            recordIndex = i;
            return true;
          }
          return false;
        });
      } else {
        record = data.findLast((o, i: number) => {
          if (o[column] === value) {
            recordIndex = i;
            return true;
          }
          return false;
        });
      }

      dispatch(updateCurrentList(record ? [record] : []))
      dispatch(setNodes([
        ...nodes.slice(0, nodeIndex),
        { ...nodes[nodeIndex], data: record ? [record] : [] },
        ...nodes.slice(nodeIndex + 1)
      ]))

      if (record) {
        generateLog(`found matched based on ${column}:${value}, find:${findAt} at index ${recordIndex} in [DATASET]:${data.length}`, LogLevels.SUCCESS);
      } else {
        generateLog(`no records found based on ${column}:${value}, find:${findAt} in [DATASET]:${data.length}`, LogLevels.ERROR);
      }
    }
  });

  const onSelfDelete = (): void => {
    dispatch(setNodes(nodes.filter(n => n.id !== id)));
    dispatch(updateCurrentList([]));
  }

  return <div className="rounded bg-primary p-2 text-secondary">
    <CustomNodeTooltip node="Find"
      onDelete={onSelfDelete}
      onClearForm={findNodeFormik.resetForm}
      onRun={findNodeFormik.handleSubmit}
      disableRun={!findNodeFormik.values.column || !findNodeFormik.values.value}
    />
    <form className="flex w-40 flex-col gap-2 text-xs">
      <select
        name="column"
        onChange={findNodeFormik.handleChange}
        value={findNodeFormik.values.column}
        className="rounded border">
        <option disabled className="text-xs">column</option>
        {availColumns.map(s => <option value={s} className="text-xs">{s}</option>)}
      </select>
      <input type="text"
        className="rounded border px-1 text-xs"
        name="value"
        onChange={findNodeFormik.handleChange}
        value={findNodeFormik.values.value}
      />
      <select
        name="findAt"
        onChange={findNodeFormik.handleChange}
        value={findNodeFormik.values.findAt}
        className="rounded border">
        <option disabled className="text-xs">Select occurence</option>
        <option value="first" className="text-xs">find first</option>
        <option value="last" className="text-xs">find last</option>
      </select>
    </form>
    <Handle position={Position.Left} type="target" />
    <Handle position={Position.Right} type="source" />
    <div className="grid-center mt-1 h-4">
      <GripHorizontal />
    </div>
  </div>
})

export default FindDataNode;