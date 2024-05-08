import { useAppDispatch, useAppSelector, useData } from "@/hooks/state-hooks";
import { updateCurrentList } from "@/store/reducers/flow-data-slice";
import { setNodes } from "@/store/reducers/nodes-list-slice";
import { LogLevels } from "@/types/context";
import { useFormik } from "formik";
import { FC, memo, useMemo } from "react";
import { type NodeProps, Handle, Position } from "reactflow";
import CustomNodeTooltip from "./custom-tooltip";

const ReduceValueNode: FC<NodeProps> = memo((props) => {
  const { id } = props;
  const { generateLog } = useData();

  const { nodes } = useAppSelector(s => s.flowNodes);
  const { filedata } = useAppSelector(s => s.flowdata);

  const dispatch = useAppDispatch();

  const numberCols = useMemo(() => filedata.meta?.fields?.filter((c: string) => {
    let numSeries = true;

    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * filedata.data.length);

      if (Number.isNaN(Number(filedata.data[randomIndex][c] || "-"))) {
        numSeries = false;
        break;
      }
    }

    return numSeries;
  }) ?? [], [filedata]);

  const reuducerFormik = useFormik<{ column: string, direction: "ttb" | "btt" }>({
    enableReinitialize: true,
    initialValues: {
      column: numberCols[0] ?? "",
      direction: "ttb",
    },
    onSubmit: (values) => {
      const { column, direction } = values;

      try {
        const nodeIndex = nodes.findIndex(r => r.id === id);
        if (nodeIndex === -1) {
          generateLog(`Error: Node with ID ${id} not found. Aborting operation.`, LogLevels.ERROR);
          return;
        }

        let sum = 0;

        if (direction === "btt") {
          sum = nodes[nodeIndex - 1].data.reduceRight((total: number, curr) => total + (Number(curr[column]) || 0), 0);
        } else {
          sum = nodes[nodeIndex - 1].data.reduce((total: number, curr) => total + (Number(curr[column]) || 0), 0);
        }

        const currdata = {
          [`${column}_total`]: sum,
          [direction]: direction === "btt" ? "reduced from bottom to top" : "reduced from top to bottom"
        };

        dispatch(updateCurrentList([currdata]));
        dispatch(setNodes([
          ...nodes.slice(0, nodeIndex),
          { ...nodes[nodeIndex], data: [currdata] }
        ]));

        generateLog(`Successfully reduced the values of column "${column}".\nSum: ${sum}, direction: ${direction}`, LogLevels.INFO);

      } catch (error) {
        generateLog(`Error: An unexpected error occurred while trying to reduce the column "${column}".\nDetails: ${error}`, LogLevels.ERROR);
      }
    }

  });


  const onSelfDelete = (): void => {
    dispatch(setNodes(nodes.filter(n => n.id !== id)));
    dispatch(updateCurrentList([]));
  }

  return <div className="rounded bg-primary p-2">
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
        className="border text-xs">
        <option className="text-xs" disabled>select column</option>
        {numberCols.map(s => <option value={s} key={s} className="text-xs">{s}</option>)}
      </select>
      <select
        name="direction"
        onChange={reuducerFormik.handleChange}
        value={reuducerFormik.values.direction}
        className="border text-xs">
        <option className="text-xs" disabled>select direction</option>
        <option value="ttb" className="text-xs">from top to bottom</option>
        <option value="btt" className="text-xs">from bottom to top</option>
      </select>
    </form>
    <Handle position={Position.Left} type="target" />
    <Handle position={Position.Right} type="source" />
  </div>
})

export default ReduceValueNode;