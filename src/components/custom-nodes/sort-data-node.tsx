import { FC, memo } from "react"
import { type NodeProps, Position, Handle } from "reactflow"

const SortDataNode: FC<NodeProps> = memo(() => {

  return <div>
    Sort Data Node
    <Handle position={Position.Left} type="target" />
    <Handle position={Position.Right} type="source" />
  </div>
})

export default SortDataNode;
