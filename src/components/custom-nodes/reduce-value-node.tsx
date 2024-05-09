import { useAppDispatch, useAppSelector, useData } from "@/hooks/state-hooks";
import { updateCurrentList } from "@/store/reducers/flow-data-slice";
import { setNodes } from "@/store/reducers/nodes-list-slice";
import { LogLevels } from "@/types/context";
import { useFormik } from "formik";
import { FC, memo, useMemo } from "react";
import { type NodeProps, Handle, NodeToolbar, Position } from "reactflow";
import CustomNodeTooltip from "@/components/custom-nodes/custom-tooltip";
import { GripHorizontal } from "lucide-react";

const ReduceValueNode: FC<NodeProps> = memo((props) => {
  const { id, data } = props;
  const { generateLog } = useData();

  const { nodes } = useAppSelector(s => s.flowNodes);
  const { filedata } = useAppSelector(s => s.flowData);

  const dispatch = useAppDispatch();

  const numberCols = useMemo(() => filedata.meta?.fields?.filter((c: string) => {
    let numSeries = true;

    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * filedata.data.length);

      if (Number.isNaN(Number((filedata.data[randomIndex] as Record<string, any>)[c] || "-"))) {
        numSeries = false;
        break;
      }
    }

    return numSeries;
  }) ?? [], [filedata]);

  const reuducerFormik = useFormik<{ column: string, direction: "ttb" | "btt", performOn: "previous" | "wholeData" }>({
    enableReinitialize: true,
    initialValues: {
      column: numberCols[0] ?? "",
      direction: "ttb",
      performOn: "wholeData",
    },
    onSubmit: (values) => {
      const { column, direction, performOn } = values;

      try {
        const nodeIndex = nodes.findIndex(r => r.id === id);
        if (nodeIndex === -1) {
          generateLog(`Error: Node with ID ${id} not found. Aborting operation.`, LogLevels.ERROR);
          return;
        }

        let sum = 0;
        const dataset = performOn === "previous" ? nodes[nodeIndex - 1].data : filedata.data

        if (direction === "btt") {
          sum = dataset.reduceRight((total: number, curr: any) => total + (Number(curr[column]) || 0), 0);
        } else {
          sum = dataset.reduce((total: number, curr: any) => total + (Number(curr[column]) || 0), 0);
        }

        const currdata = {
          [`${column}_total`]: sum,
          "direction": direction === "btt" ? "bottom to top" : "top to bottom"
        };

        dispatch(updateCurrentList([currdata]));
        dispatch(setNodes([
          ...nodes.slice(0, nodeIndex),
          { ...nodes[nodeIndex], data: [currdata] }
        ]));

        generateLog(`reduced the values of column "${column}".\nSum: ${sum}, direction: ${direction}, [DATASET]: ${performOn}`, LogLevels.INFO);

      } catch (error) {
        generateLog(`Error: An unexpected error occurred while trying to reduce the column "${column}".\nDetails: ${error}`, LogLevels.ERROR);
      }
    }

  });


  const onSelfDelete = (): void => {
    dispatch(setNodes(nodes.filter(n => n.id !== id)));
    dispatch(updateCurrentList([]));
  }

  return <div className="rounded bg-primary p-2 text-secondary">
    <CustomNodeTooltip
      onDelete={onSelfDelete}
      node="Reduce"
      onClearForm={reuducerFormik.resetForm}
      onRun={reuducerFormik.submitForm}
      disableRun={false} />

    <form className="flex flex-col gap-2 text-secondary">
      <select
        name="column"
        onChange={reuducerFormik.handleChange}
        value={reuducerFormik.values.column}
        className="rounded border p-1 text-xs">
        <option className="text-xs" disabled>select column</option>
        {numberCols.map(s => <option value={s} key={s} className="text-xs">{s}</option>)}
      </select>
      <select
        name="direction"
        onChange={reuducerFormik.handleChange}
        value={reuducerFormik.values.direction}
        className="rounded border p-1 text-xs">
        <option className="text-xs" disabled>select direction</option>
        <option value="ttb" className="text-xs">from top to bottom</option>
        <option value="btt" className="text-xs">from bottom to top</option>
      </select>
      <select
        name="performOn"
        onChange={reuducerFormik.handleChange}
        value={reuducerFormik.values.performOn}
        className="rounded border p-1 text-xs">
        <option className="text-xs" disabled>selection dataset</option>
        <option value="previous" className="text-xs">dataset - previous</option>
        <option value="wholeData" className="text-xs">dataset - whole file</option>
      </select>
    </form>
    <Handle position={Position.Left} type="target" />
    <NodeToolbar position={Position.Bottom}>
      <pre className="text-[10px]">[DATASET]: {data.length} | {filedata.meta?.fields?.length} columns</pre>
    </NodeToolbar>
    <div className="grid-center mt-1 h-4">
      <GripHorizontal />
    </div>
  </div>
})

export default ReduceValueNode;