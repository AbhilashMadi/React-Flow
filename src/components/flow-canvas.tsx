import { Button } from "@ui/button";
import { FileDown, GitBranchPlus } from "lucide-react";
import { FC, lazy, useCallback, useState } from "react";
import ReactFlow, { Background, Controls, Panel } from "reactflow";

import "reactflow/dist/style.css";
import ThemeSwitch from "@/components/common/theme-switch";
import { useAppSelector } from "@/hooks/state-hooks";

const OperationsDialog = lazy(() => import("@/components/dialogs/operations-dialog"));
const FetchFileDialog = lazy(() => import("@/components/dialogs/fetch-file-dialog"));

const FlowCanvas: FC = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [dataModal, setDatamodal] = useState<boolean>(false);

  const { filedata } = useAppSelector((state) => state.flowdata);

  const handleAddNode = useCallback((): void => {
    setOpenModal(!openModal);
  }, [openModal])

  const handleAddData = useCallback((): void => {
    setDatamodal(!dataModal);
  }, [dataModal])

  return <>
    <FetchFileDialog
      open={dataModal}
      onOpenChange={handleAddData} />
    <OperationsDialog
      open={openModal}
      onOpenChange={handleAddNode} />
    <ReactFlow fitView>
      <Background />
      <Controls />
      {/* <MiniMap className="dark:bg-muted-foreground" zoomable pannable /> */}
      <Panel position={"top-left"}>
        {filedata.data.length
          ? <Button
            size="icon"
            onClick={handleAddNode}
            title="add operation">
            <GitBranchPlus size={16} />
          </Button>
          : <Button
            size="icon"
            onClick={handleAddData}
            title="add operation">
            <FileDown size={16} />
          </Button>}
      </Panel>
      <Panel position="top-right">
        <ThemeSwitch />
      </Panel>
    </ReactFlow>
  </>;
}

export default FlowCanvas;