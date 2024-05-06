import MutedText from "@/components/typography/muted-text";
import { cn } from "@/lib/utils";
import { type Operation } from "@/types/mapper-objects";
import { buttonVariants } from "@ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@ui/dialog";
import { ArrowUpDown, Group, ListFilter, ListPlus, TableRowsSplit } from "lucide-react";
import { FC } from "react";

interface IOperationsDialog {
  open: boolean;
  onOpenChange: () => void;
}

const Operations: ReadonlyArray<Operation> = [
  {
    icon: <ListFilter size={18} />,
    label: "Filter",
    explain: "Filter a data set based on a given column name and value.",
    input: ["Custom", "Falsy", "Truthy"],
    onClick: () => null,
    result: [],
  },
  {
    icon: <ListPlus size={18} />,
    label: "Merge",
    explain: "Merges two data sets based on the given column names.",
    input: [],
    onClick: () => null,
    result: [],
  },
  {
    icon: <Group size={18} />,
    label: "Group",
    explain: "Groups a data set based on a given column name.",
    input: [],
    onClick: () => null,
    result: [],
  },
  {
    icon: <TableRowsSplit size={18} />,
    label: "Slice",
    explain: "Slices a data set based on indices.",
    input: [],
    onClick: () => null,
    result: [],
  },
  {
    icon: <ArrowUpDown size={18} />,
    label: "Sort",
    explain: "Sorts data based on a given column.",
    input: [],
    onClick: () => null,
    result: [],
  },
];

const OperationsDialog: FC<IOperationsDialog> = ({ open, onOpenChange }) => {

  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="min-w-[700px]">
      <DialogHeader>
        <DialogTitle>Choose Operation</DialogTitle>
      </DialogHeader>
      <div className="grid grid-cols-3 gap-3 [&>*]:p-2">
        {Operations.map((o, i) => {
          return <div key={i} className="cursor-grab rounded-lg border border-muted transition-all hover:scale-105 hover:border-primary hover:shadow-lg">
            <div className="mb-2 flex items-center">
              <span className={cn(buttonVariants({ size: "icon" }), "size-8 rounded-lg")}>{o.icon}</span>
              <span className="ml-2">{o.label}</span>
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