import { CirclePlay, RotateCcw, X } from "lucide-react"
import { FC } from "react"
import { NodeToolbar } from "reactflow"

interface ICustomNodeTooltipProps {
  onDelete: () => void;
  onRun: () => void;
  onClearForm: () => void;
  disableRun?: boolean;
}

const CustomNodeTooltip: FC<ICustomNodeTooltipProps> = (props) => {
  const { onClearForm, onDelete, onRun, disableRun = false } = props

  return <NodeToolbar isVisible className="[&>button]:grid-center flex gap-1 text-white [&>button]:size-6 [&>button]:rounded">
    <button title="delete" className="bg-red-500" onClick={onDelete}><X size={14} /></button>
    <button title="reset" className="bg-purple-500" onClick={onClearForm}><RotateCcw size={14} /></button>
    <button title="run" className="bg-green-500 disabled:bg-green-200" onClick={onRun} disabled={disableRun}><CirclePlay size={14} /></button>
  </NodeToolbar>
}

export default CustomNodeTooltip;