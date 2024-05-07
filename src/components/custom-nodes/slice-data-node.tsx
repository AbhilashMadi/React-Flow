import { FC, memo } from "react"
import { Position, type NodeProps, Handle } from "reactflow"

const SliceDataNode: FC<NodeProps> = memo((props) => {

  return <div>
    Slice Data Node
    <Handle position={Position.Left} type="target" />
    <Handle position={Position.Right} type="source" />
  </div>
});

export default SliceDataNode;