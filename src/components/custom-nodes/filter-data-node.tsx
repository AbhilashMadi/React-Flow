import { FC, memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"

const FilterDataNode: FC<NodeProps> = memo((props) => {

  return <div>
    Filter Data Node
    <Handle position={Position.Left} type="target" />
    <Handle position={Position.Right} type="source" />
  </div>
})

export default FilterDataNode;