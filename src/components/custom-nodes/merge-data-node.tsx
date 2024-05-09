import { useAppDispatch, useAppSelector, useData } from "@/hooks/state-hooks";
import { updateCurrentList } from "@/store/reducers/flow-data-slice";
import { setNodes } from "@/store/reducers/nodes-list-slice";
import { LogLevels } from "@/types/context";
import { useFormik } from "formik";
import { FC, memo } from "react";
import { Handle, NodeProps, NodeToolbar, Position } from "reactflow";
import CustomNodeTooltip from "./custom-tooltip";
import { GripHorizontal } from "lucide-react";

const MergeDataNode: FC<NodeProps> = memo((props) => {
  const { data, id } = props;
  const { filedata } = useAppSelector((s) => s.flowData);
  const { nodes } = useAppSelector((s) => s.flowNodes);
  const { generateLog } = useData();

  const dispatch = useAppDispatch();

  const mergeFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      columnOne: "",
      columnTwo: "",
      mergeAs: "",
      separator: "-",
      operator: "+",
    },
    onSubmit: (values) => {
      const { columnOne, columnTwo, mergeAs, separator, operator } = values;
      try {
        const nodeIndex = nodes.findIndex(n => n.id === id);
        if (nodeIndex === -1) return;

        let col: string = `${columnOne} ${separator} ${columnTwo}`
        const newData = nodes[nodeIndex].data.map((o: any) => {
          let finalVal: string | number = "";

          const valueOne = o[columnOne];
          const valueTwo = o[columnTwo];

          if (mergeAs === "asString") {
            finalVal = `${valueOne}${separator}${valueTwo}`;
          }

          if (mergeAs === "asNumber") {
            const a = Number(valueOne) || 0;
            const b = Number(valueTwo) || 0;
            col = `${columnOne} ${operator} ${columnTwo}`

            switch (operator) {
              case "+":
                finalVal = a + b;
                break;
              case "-":
                finalVal = a - b;
                break;
              case "/":
                finalVal = a / b;
                break;
              case "%":
                finalVal = a % b;
                break;
              case "*":
                finalVal = a * b;
                break;
              default:
                finalVal = 0;
                break;
            }
          }

          return { ...o, [col]: finalVal };
        });

        dispatch(updateCurrentList(newData));
        dispatch(setNodes([
          ...nodes.slice(0, nodeIndex),
          { ...nodes[nodeIndex], data: newData },
          ...nodes.slice(nodeIndex + 1),
        ]));

        generateLog(`added new column to data DATASET: ${col}\n
      merged columns as: ${mergeAs}`, LogLevels.SUCCESS)
      } catch (error) {
        generateLog(`something went wrong while merging ${columnOne} and ${columnTwo} \n
        ERROR: ${error}`, LogLevels.ERROR);
      }
    }
  })

  const onSelfDelete = (): void => {
    dispatch(setNodes(nodes.filter(n => n.id !== id)));
    dispatch(updateCurrentList([]));
  }

  const availableColumns = filedata.meta?.fields || [];

  return (
    <div className="rounded bg-primary p-2 text-secondary">
      <CustomNodeTooltip
        onDelete={onSelfDelete}
        onClearForm={mergeFormik.resetForm}
        onRun={mergeFormik.submitForm}
        disableRun={!mergeFormik.values.columnOne || !mergeFormik.values.columnTwo || !mergeFormik.values.mergeAs}
        node={"Merge"} />
      <form className="flex flex-col gap-2 text-xs text-primary dark:text-secondary">
        <select
          className="rounded border p-1"
          onChange={mergeFormik.handleChange}
          name="columnOne"
          value={mergeFormik.values.columnOne}>
          <option disabled value="" className="text-xs">Column one</option>
          {availableColumns.map(col => (
            <option key={col} value={col} className="text-xs">{col}</option>
          ))}
        </select>
        <select
          className="rounded border p-1"
          onChange={mergeFormik.handleChange}
          name="columnTwo"
          value={mergeFormik.values.columnTwo}>
          <option disabled value="" className="text-xs">Column two</option>
          {availableColumns.map(col => (
            <option key={col} value={col} className="text-xs">{col}</option>
          ))}
        </select>
        <select
          className="rounded border p-1"
          onChange={mergeFormik.handleChange}
          name="mergeAs"
          value={mergeFormik.values.mergeAs}>
          <option disabled value="" className="text-xs">Merge columns as</option>
          <option value="asString" className="text-xs">Merge as text</option>
          <option value="asNumber" className="text-xs">Merge as number</option>
        </select>
        {mergeFormik.values.mergeAs === "asString" && (
          <select
            className="border"
            onChange={mergeFormik.handleChange}
            name="separator"
            value={mergeFormik.values.separator}>
            <option disabled value="" className="text-xs">Choose column separators</option>
            <option value="/" className="text-xs">/</option>
            <option value="-" className="text-xs">-</option>
            <option value="_" className="text-xs">_</option>
            <option value=" | " className="text-xs">|</option>
          </select>
        )}
        {mergeFormik.values.mergeAs === "asNumber" && (
          <select
            className="border"
            onChange={mergeFormik.handleChange}
            name="operator"
            value={mergeFormik.values.operator}>
            <option disabled className="text-xs">Choose operation</option>
            <option value="+" className="text-xs">+</option>
            <option value="-" className="text-xs">-</option>
            <option value="/" className="text-xs">/</option>
            <option value="%" className="text-xs">%</option>
            <option value="*" className="text-xs">*</option>
          </select>
        )}
      </form>
      <Handle position={Position.Left} type="target" />
      <Handle position={Position.Right} type="source" />
      <NodeToolbar position={Position.Bottom}>
        <pre className="text-[10px]">[DATASET]: {data.length} | {filedata.meta?.fields?.length} columns</pre>
      </NodeToolbar>
      <div className="grid-center mt-1 h-4">
        <GripHorizontal />
      </div>
    </div>
  );
});

export default MergeDataNode;
