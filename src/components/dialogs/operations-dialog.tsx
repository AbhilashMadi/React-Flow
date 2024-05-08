import MutedText from "@/components/typography/muted-text";
import { useAppDispatch, useAppSelector, useData } from "@/hooks/state-hooks";
import { generateId } from "@/lib/generators";
import { cn } from "@/lib/utils";
import { setEdges, setNodes } from "@/store/reducers/nodes-list-slice";
import { LogLevels } from "@/types/context";
import { CustomNodes, type Operation } from "@/types/mapper-objects";
import { buttonVariants } from "@ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@ui/dialog";
import { ArrowUpDown, Command, CopyCheck, FileSearch, ListFilter, ListPlus, ListX, SquareMinus, TableRowsSplit } from "lucide-react";
import { FC } from "react";
import type { Edge, Node } from "reactflow";

interface IOperationsDialog {
  open: boolean;
  onOpenChange: () => void;
}

const Operations: ReadonlyArray<Operation> = [
  {
    icon: <ListFilter size={18} />,
    label: "Filter",
    explain: "Filter a dataset based on a given column name and value.",
    input: ["Column Name", "Filter Value"],
    nodeName: CustomNodes.FILTER_DATA_NODE,
    type: "source",
    result: [],
  },
  {
    icon: <ListPlus size={18} />,
    label: "Merge",
    explain: "Merge two datasets based on the given column names.",
    input: [],
    nodeName: CustomNodes.MERGE_DATA_NODE,
    result: [],
    type: "source",
  },
  // {
  //   icon: <Group size={18} />,
  //   label: "Group",
  //   explain: "Group a dataset based on a given column name.",
  //   nodeName: CustomNodes.GROUPD_DATA_NODE,
  //   input: [],
  //   result: [],
  // },
  {
    icon: <TableRowsSplit size={18} />,
    label: "Slice",
    explain: "Slice a dataset based on indices.",
    input: ["Start Index", "End Index"],
    nodeName: CustomNodes.SLICE_DATA_NODE,
    result: [],
    type: "source",
  },
  {
    icon: <ArrowUpDown size={18} />,
    label: "Sort",
    explain: "Sort data based on a given column.",
    nodeName: CustomNodes.SORT_DATA_NODE,
    input: ["Column Name", "Sort Order"],
    result: [],
    type: "source",
  },
  {
    icon: <ListX size={18} />,
    label: "Delete",
    explain: "Delete nodes by providing there providing the indices.",
    nodeName: CustomNodes.DELETE_DATA_NODE,
    input: ["From Index", "To Index"],
    result: ["Text"],
    type: "source",
  },
  {
    icon: <Command size={18} />,
    label: "Aggregation",
    explain: "Aggregate the data to match the given condition. For example: 'key:value,key1:value1'.",
    nodeName: CustomNodes.AGGREGATE_DATA_NODE,
    input: ["Aggregation Condition"],
    result: ["Array of Objects"],
    type: "source",
  },
  {
    icon: <SquareMinus size={18} />,
    label: "Reduce",
    explain: "Generate the total of a particular column.",
    nodeName: CustomNodes.REDUCE_VALUE_NODE,
    input: ["Column Name"],
    result: ["Total"],
    type: "target",
  },
  {
    icon: <CopyCheck size={18} />,
    label: "Contain",
    explain: "Check whether the object at the given index contains the specified value.",
    nodeName: CustomNodes.CONTAIN_DATA_NODE,
    input: ["Index"],
    result: ["Text"],
    type: "target",
  },
  {
    icon: <FileSearch size={18} />,
    label: "Find",
    explain: "Find the first or last match of a particular document in the dataset.",
    nodeName: CustomNodes.FIND_DATA_NODE,
    input: ["Search String"],
    result: ["Matching Object"],
    type: "target",
  },
];


const OperationsDialog: FC<IOperationsDialog> = ({ open, onOpenChange }) => {
  const { generateLog } = useData();
  const { nodes, edges } = useAppSelector((s) => s.flowNodes);
  const dispatch = useAppDispatch();

  const onOperationSelect = (operation: Operation): void => {
    const { position: { x, y }, id, data } = nodes.at(-1)!;

    const newOperationNode: Node = {
      id: generateId(),
      data,
      type: operation.nodeName,
      position: { x: x + 200, y: nodes.length === 1 ? 300 : y },
    };

    dispatch(setNodes([...nodes, newOperationNode]));

    const newEdge: Edge = {
      id: generateId(),
      source: id,
      target: [
        CustomNodes.FILTER_DATA_NODE,
        CustomNodes.MERGE_DATA_NODE,
        CustomNodes.SLICE_DATA_NODE,
        CustomNodes.SORT_DATA_NODE,
        CustomNodes.DELETE_DATA_NODE,
        CustomNodes.AGGREGATE_DATA_NODE
      ].includes(operation.nodeName) ? newOperationNode.id : "",
      animated: true,
    };

    dispatch(setEdges([...edges, newEdge]));
    onOpenChange();
    generateLog(`New Operation added!\n** ${operation.explain}`, LogLevels.SUCCESS);
  }

  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="min-w-[700px]">
      <DialogHeader>
        <DialogTitle>Choose Operation</DialogTitle>
      </DialogHeader>
      <div className="grid grid-cols-3 gap-3 [&>*]:p-2">
        {Operations.map((o, i) => {
          return <div key={i} className="cursor-grab rounded-lg border border-muted transition-all hover:scale-105 hover:border-primary hover:shadow-lg" onClick={() => onOperationSelect(o)}>
            <div className="mb-2 flex items-center">
              <span className={cn(buttonVariants({ size: "icon" }), "size-8 rounded-lg")}>{o.icon}</span>
              <span className="ml-2 font-mono">{o.label}/
                <span className={cn(o.type === "source" ? "text-red-300" : "text-green-300", "text-xs")}>{o.type}</span>
              </span>
            </div>
            <MutedText className="mt-1 text-[10px] leading-normal">{o.explain}</MutedText>
            <MutedText className="mt-1 text-[10px] leading-normal">Input: {o.input.join(", ")}</MutedText>
            <MutedText className="text-[10px] leading-normal">Result: {o.result.join(", ")}</MutedText>
          </div>
        })}
      </div>
    </DialogContent>
  </Dialog>
}

export default OperationsDialog;