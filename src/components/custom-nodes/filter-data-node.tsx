import { useAppDispatch, useAppSelector, useData } from "@/hooks/state-hooks";
import { updateCurrentList } from "@/store/reducers/flow-data-slice";
import { setNodes } from "@/store/reducers/nodes-list-slice";
import { LogLevels } from "@/types/context";
import { Button } from "@ui/button";
import { useFormik } from "formik";
import { CirclePlay } from "lucide-react";
import { FC, memo } from "react";
import { Handle, NodeToolbar, Position, type NodeProps } from "reactflow";

const FilterDataNode: FC<NodeProps> = memo((props) => {
  const { data, id } = props;
  const { generateLog } = useData();
  const dispatch = useAppDispatch();

  const { nodes } = useAppSelector((s) => s.flowNodes);
  const { filedata } = useAppSelector((s) => s.flowdata);

  const filterFormik = useFormik<{
    column: string;
    criteria: string;
    condition: string;
  }>({
    enableReinitialize: true,
    initialValues: {
      column: "",
      criteria: "",
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
              case "text is exactly":
                return o[column] === condition;
              case "text is not exactly":
                return o[column] !== condition;
              case "text includes":
                return o[column].includes(condition);
              case "text doesn't includes":
                return !o[column].includes(condition);
              case "data is not empty or null":
                return o[column] || o[column] !== null;
              case "data matches regex":
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

  return <div className={"bg-primary p-2 text-secondary"}>
    <NodeToolbar position={Position.Bottom} className="border">
      <Button size={"icon"} type="button" onClick={filterFormik.submitForm} disabled={!filterFormik.values.column || !filterFormik.values.condition || !filterFormik.values.criteria}>
        <CirclePlay size={14} />
      </Button>
    </NodeToolbar>

    <form className="flex flex-col gap-2 text-xs text-primary dark:text-secondary">
      <div>Filter:</div>
      <select onChange={filterFormik.handleChange} name={"column"} className="border">
        <option>Select a column</option>
        {filedata.meta?.fields?.map(s => <option value={s} key={s}>{s}</option>)}
      </select>

      <select onChange={filterFormik.handleChange} name={"criteria"} className="border">
        <option>Select a criteria</option>
        <option value="text is exactly">text is exactly</option>
        <option value="text is not exactly">text is not exactly</option>
        <option value="text includes">text includes</option>
        <option value="text doesn't includes">text doesn't includes</option>
        <option value="data is not empty or null">data is not empty or null</option>
        <option value="data matches regex">data matches regex</option>
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
  </div>
})

export default FilterDataNode;