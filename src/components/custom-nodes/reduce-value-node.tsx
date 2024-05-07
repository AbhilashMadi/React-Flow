import { FC, memo } from "react";
import { type NodeProps, Handle, Position } from "reactflow";

const ReduceValueNode: FC<NodeProps> = memo((props) => {

  return <div>
    Reduce Value Node
    <Handle position={Position.Left} type="target" />
    <Handle position={Position.Right} type="source" />
  </div>
})

export default ReduceValueNode;