import CustomNodeTooltip from "@/components/custom-nodes/custom-tooltip";
import { useAppDispatch, useAppSelector, useData } from "@/hooks/state-hooks";
import { generateId } from "@/lib/generators";
import { updateCurrentList } from "@/store/reducers/flow-data-slice";
import { setNodes } from "@/store/reducers/nodes-list-slice";
import { LogLevels } from "@/types/context";
import { GripHorizontal, Minus, PanelLeft, PanelRight, Plus } from "lucide-react";
import { ChangeEvent, FC, memo, useState } from "react";
import { Handle, NodeProps, NodeToolbar, Position } from "reactflow";

const DeleteDataNode: FC<NodeProps> = memo((props) => {
  const { id, data } = props;
  const { generateLog } = useData();

  const { nodes } = useAppSelector(s => s.flowNodes);
  const { filedata } = useAppSelector(s => s.flowData);
  const dispatch = useAppDispatch();

  const [inputs, setInputs] = useState<{ [key: string]: number | "" }>({
    [generateId()]: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (+value < 0 || +value > data.length) return;

    setInputs({
      ...inputs,
      [name]: Number(value),
    });
  };

  const handleAddRemoveInput = (perform: "add" | "remove", name: string): void => {
    if (perform === "add") {
      setInputs({ ...inputs, [name]: "" });
    }

    if (perform === "remove") {
      const { [name]: _remove, ...rest } = inputs;
      setInputs(rest);
    }
  };

  const handleRun = (perform: "pop" | "unshift" | "run"): void => {
    let newData: object[] = structuredClone(data);

    const nodeIndex = nodes.findIndex(n => n.id === id);
    if (nodeIndex === -1) return;

    if (perform === "pop") {
      newData.pop();

      generateLog(`deleted an record from last of the dataset\n
      previous [DATASET_LENGTH]: ${data.length}\n
      current [DATASET_LENGTH]: ${newData.length}`, LogLevels.WARNING);
    }

    if (perform === "unshift") {
      newData.shift();

      generateLog(`deleted an record from front of the dataset\n
      previous [DATASET_LENGTH]: ${data.length}\n
      current [DATASET_LENGTH]: ${newData.length}`, LogLevels.WARNING);
    }

    if (perform === "run") {
      const indicesToRemove = Object.values(inputs);
      newData = newData.filter((_, i) => !indicesToRemove.includes(i));

      generateLog(`successfully removed the records at given indices from the dataset\n
      removed records indices: ${indicesToRemove.join(", ")}
      previous records: ${data.length}\n
      current records: ${newData.length}\n`, LogLevels.SUCCESS);
    }

    dispatch(updateCurrentList(newData));
    dispatch(setNodes([
      ...nodes.slice(0, nodeIndex),
      { ...nodes[nodeIndex], data: newData },
      ...nodes.slice(nodeIndex + 1),
    ]))
  }

  const inputsLength = Object.keys(inputs).length;

  const disableAdd = !inputs[Object.keys(inputs).at(-1) ?? ""] || inputsLength > 5;
  const disableRemove = inputsLength === 1;

  const onSelfDelete = (): void => {
    dispatch(setNodes(nodes.filter(n => n.id !== id)));
    dispatch(updateCurrentList([]));
  }

  return (
    <div className="rounded bg-primary p-2 text-secondary">
      <CustomNodeTooltip node="Delete"
        onClearForm={() => setInputs({ "input-1": "" })}
        onDelete={onSelfDelete}
        onRun={() => handleRun("run")} />
      <form className="text-xs">
        <div className="flex gap-1 text-xs">
          <button
            type="button"
            className="rounded bg-secondary p-1 font-mono text-primary hover:shadow-lg active:scale-95"
            title="Pop - remove last"
            onClick={() => handleRun("unshift")}>
            <PanelLeft size={14} />
          </button>
          <button
            type="button"
            className="rounded bg-secondary p-1 font-mono text-primary hover:shadow-lg active:scale-95"
            title="Unshift - remove first"
            onClick={() => handleRun("pop")}>
            <PanelRight size={14} />
          </button>
        </div>
        <div className="my-1 space-y-1">
          {Object.entries(inputs).map(([name, value]) => (
            <div className="flex gap-1" key={name}>
              <input
                type="number"
                className="w-32 rounded border px-1"
                name={name}
                value={value}
                min={0}
                max={data.length}
                onChange={handleInputChange}
              />
              <button
                type="button"
                className="grow rounded bg-red-500 p-1 text-secondary active:scale-95 disabled:bg-gray-400"
                disabled={disableRemove}
                onClick={() => handleAddRemoveInput("remove", name)}>
                <Minus size={14} className="mx-auto" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            className="grow rounded bg-green-500 p-1 text-secondary active:scale-95 disabled:bg-gray-400"
            disabled={disableAdd}
            onClick={() => handleAddRemoveInput("add", generateId())}>
            <Plus size={14} className="mx-auto" />
          </button>
        </div>
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

export default DeleteDataNode;
