import { FC, memo } from "react"
import { Handle, type NodeProps, Position } from "reactflow"

const ContainDataNode: FC<NodeProps> = memo((props) => {

  return <div>
    Contain Data Node
    <Handle position={Position.Left} type="target" />
    <Handle position={Position.Right} type="source" />
  </div>
})

export default ContainDataNode;