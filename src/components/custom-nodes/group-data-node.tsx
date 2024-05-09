import { FC, memo } from "react"
import { Handle, type NodeProps, Position } from "reactflow"

const GroupDataNode: FC<NodeProps> = memo(() => {

  return <div>
    Merge Data Node
    <Handle position={Position.Left} type="target" />
    <Handle position={Position.Right} type="source" />
  </div>
})

export default GroupDataNode;