import { Button } from "@ui/button";
import { FolderOpenDot, FolderPlus, GitBranchPlus } from "lucide-react";
import { FC, lazy, SyntheticEvent, useCallback, useState } from "react";
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Connection,
  Controls,
  Edge,
  EdgeChange,
  NodeChange,
  Panel,
  type Node
} from "reactflow";

import ThemeSwitch from "@/components/common/theme-switch";
import { useAppDispatch, useAppSelector } from "@/hooks/state-hooks";
import "reactflow/dist/style.css";

const OperationsDialog = lazy(() => import("@/components/dialogs/operations-dialog"));
// const FetchFileDialog = lazy(() => import("@/components/dialogs/fetch-file-dialog"));

import AggregateDataNode from "@/components/custom-nodes/aggregate-data-node";
import ContainDataNode from "@/components/custom-nodes/contain-data-node";
import DeleteDataNode from "@/components/custom-nodes/delete-data-nodes";
import FilterDataNode from "@/components/custom-nodes/filter-data-node";
import FindDataNode from "@/components/custom-nodes/find-data-node";
import GroupDataNode from "@/components/custom-nodes/group-data-node";
import InitialNode from "@/components/custom-nodes/initial-node";
import MergeDataNode from "@/components/custom-nodes/merge-data-node";
import ReduceValueNode from "@/components/custom-nodes/reduce-value-node";
import SliceDataNode from "@/components/custom-nodes/slice-data-node";
import SortDataNode from "@/components/custom-nodes/sort-data-node";
import { updateCurrentList } from "@/store/reducers/flow-data-slice";
import { setEdges, setNodes } from "@/store/reducers/nodes-list-slice";
import SavedWorkflowsDialog from "./dialogs/saved-workflows-dialog";
import SaveWorkFlowDialog from "./dialogs/save-workflow-dialog";

//custom nodes
const nodeTypes = {
  initialNode: InitialNode, //import
  filterDataNode: FilterDataNode, //Filter
  mergeDataNode: MergeDataNode, //Merge
  groupDataNode: GroupDataNode,//Group
  sliceDataNode: SliceDataNode, //Slice
  sortDataNode: SortDataNode, //Sort
  reduceValueNode: ReduceValueNode, //Reduce
  containDataNode: ContainDataNode, //Check
  deleteDataNode: DeleteDataNode, //Delete
  findDataNode: FindDataNode, //Find
  aggregateDataNode: AggregateDataNode, //Aggregate
}

const FlowCanvas: FC = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [savedWorkflows, setSavedWorkflows] = useState<boolean>(false);
  const [saveWorkflow, setSaveWorkflow] = useState<boolean>(false);

  const { filedata } = useAppSelector((state) => state.flowData);
  const { nodes, edges } = useAppSelector((state) => state.flowNodes);
  const dispatch = useAppDispatch();

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    dispatch(setNodes(applyNodeChanges(changes, nodes)));
  }, [dispatch, nodes]);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    dispatch(setEdges(applyEdgeChanges(changes, edges)))
  }, [dispatch, edges]);

  const onNodeClick = useCallback((_: SyntheticEvent, node: Node) => {
    dispatch(updateCurrentList(node.data))
  }, [dispatch]);

  const onConnect = useCallback((connection: Edge | Connection) => {
    dispatch(setEdges(addEdge(connection, edges)));
  }, [dispatch, edges]);

  const handleAddNodeDialog = useCallback((): void => {
    setOpenModal(!openModal);
  }, [openModal])

  const handleOpenSavedWorkflows = useCallback((): void => {
    setSavedWorkflows(!savedWorkflows);
  }, [savedWorkflows]);

  const handleSaveCurrent = useCallback((): void => {
    setSaveWorkflow(!saveWorkflow);
  }, [saveWorkflow]);

  return <>
    <OperationsDialog
      open={openModal}
      onOpenChange={handleAddNodeDialog} />
    <SavedWorkflowsDialog
      open={savedWorkflows}
      onOpenChange={handleOpenSavedWorkflows}
    />
    <SaveWorkFlowDialog
      open={saveWorkflow}
      onOpenChange={handleSaveCurrent} />
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      nodeTypes={nodeTypes}
      onEdgesChange={onEdgesChange}
      onNodeClick={onNodeClick}
      onConnect={onConnect}
      onNodesDelete={(...params) => { console.log(params) }}
      fitView={false}>
      <Background />
      <Controls />
      <Panel position={"top-left"} className="flex flex-col gap-2">
        {filedata.data.length
          ? <Button
            size="icon"
            onClick={handleAddNodeDialog}
            title="add operation">
            <GitBranchPlus size={16} />
          </Button>
          : <></>}
        <Button
          size="icon"
          onClick={handleOpenSavedWorkflows}
          title="view saved workflows">
          <FolderOpenDot size={16} />
        </Button>
        <Button
          size="icon"
          onClick={handleSaveCurrent}
          title="save current workflow">
          <FolderPlus size={16} />
        </Button>
      </Panel>
      <Panel position="top-right">
        <ThemeSwitch />
      </Panel>
    </ReactFlow>
  </>;
}

export default FlowCanvas;