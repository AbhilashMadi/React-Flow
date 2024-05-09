import { useAppDispatch, useAppSelector, useData } from "@/hooks/state-hooks";
import { updateCurrentList } from "@/store/reducers/flow-data-slice";
import { setNodes } from "@/store/reducers/nodes-list-slice";
import { LogLevels } from "@/types/context";
import { useFormik } from "formik";
import { FC, memo } from "react";
import { Handle, NodeToolbar, Position, type NodeProps } from "reactflow";
import CustomTooltip from "./custom-tooltip";
import { GripHorizontal } from "lucide-react";

const FilterDataNode: FC<NodeProps> = memo((props) => {
  const { data, id } = props;
  const { generateLog } = useData();
  const dispatch = useAppDispatch();

  const { nodes } = useAppSelector((s) => s.flowNodes);
  const { filedata } = useAppSelector((s) => s.flowData);
  const dataColumns = filedata.meta?.fields ?? [];


  const filterFormik = useFormik<{
    column: string;
    criteria: string;
    condition: string;
  }>({
    enableReinitialize: true,
    initialValues: {
      column: dataColumns[0] ?? "",
      criteria: "exactly",
      condition: "",
    },
    onSubmit: async (values) => {
      const { column, condition, criteria } = values;

      const nodeIndex = nodes.findIndex((n) => n.id === id);

      if (nodeIndex !== -1) {
        const filteredData = {
          ...nodes[nodeIndex], data: data.filter((o: { [key: string]: string }) => {
            if (!column) return false;

            switch (criteria) {
              case "exactly":
                return o[column] === condition;
              case "notExactly":
                return o[column] !== condition;
              case "includes":
                return o[column].includes(condition);
              case "notIncludes":
                return !o[column].includes(condition);
              case "emptyOrNull":
                return o[column] && o[column] !== null;
              case "regex":
                return new RegExp(condition).test(o[column]);
              default:
                return false;
            }
          })
        };

        const matchedNodes = [
          ...nodes.slice(0, nodeIndex),
          filteredData,
          ...nodes.slice(nodeIndex + 1)
        ];

        dispatch(setNodes(matchedNodes));
        dispatch(updateCurrentList(filteredData.data));
        generateLog(`Filtered current rows: ${data?.length ?? "-"}\n
        matched rows based on given criteria: column: '${column}', criteria: ${criteria}, condition: ${condition}\n
        rows matched: ${filteredData.data.length}\n`, LogLevels.INFO);
      } else {
        generateLog(`Node not found with ID: ${id}`, LogLevels.INFO);
      }
    },
  })

  const deleteSelf = (): void => {
    dispatch(setNodes(nodes.filter((n) => n.id !== id)));
    dispatch(updateCurrentList([]));
  }

  return <div className="rounded bg-primary p-2 text-secondary">
    <CustomTooltip
      onDelete={deleteSelf}
      onClearForm={filterFormik.resetForm}
      onRun={filterFormik.submitForm}
      disableRun={!filterFormik.values.column || !filterFormik.values.criteria}
      node={"Filter"}
    />
    <form className="flex flex-col gap-2 text-xs text-primary dark:text-secondary">
      <select onChange={filterFormik.handleChange} name={"column"} className="border" value={filterFormik.values.column}>
        <option className="text-xs">Select a column</option>
        {dataColumns.map(s => <option value={s} key={s} className="text-xs">{s}</option>)}
      </select>

      <select onChange={filterFormik.handleChange} name={"criteria"} className="border" value={filterFormik.values.criteria}>
        <option className="text-xs" disabled>Select a criteria</option>
        <option value="exactly" className="text-xs">text is exactly</option>
        <option value="notExactly" className="text-xs">text is not exactly</option>
        <option value="includes" className="text-xs">text includes</option>
        <option value="notIncludes" className="text-xs">text doesn't includes</option>
        <option value="emptyOrNull" className="text-xs">data is not empty or null</option>
        <option value="regex" className="text-xs">data matches regex</option>
      </select>

      <input
        type="text"
        value={filterFormik.values.condition}
        onChange={filterFormik.handleChange}
        name="condition"
        className="border" />
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
})

export default FilterDataNode;