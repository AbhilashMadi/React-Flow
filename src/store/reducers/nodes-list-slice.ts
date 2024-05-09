import { generateId } from "@/lib/generators";
import { CustomNodes } from "@/types/mapper-objects";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Edge, Node } from "reactflow";

type IninitialState = {
  nodes: Node[];
  edges: Edge[];
}

const initialState: IninitialState = {
  nodes: [{
    id: generateId(),
    type: CustomNodes.INITIAL_NODE,
    data: "",
    position: { x: 200, y: 200 },
  }],
  edges: [],
}

const counterSlice = createSlice({
  name: "flowNodes",
  initialState,
  reducers: {
    setNodes: (state, action: PayloadAction<Node[]>) => {
      state.nodes = action.payload;
    },
    setEdges: (state, action: PayloadAction<Edge[]>) => {
      state.edges = action.payload;
    },
    resetFlow: () => initialState,
  }
});

export const { setNodes, setEdges, resetFlow } = counterSlice.actions;
export default counterSlice.reducer;