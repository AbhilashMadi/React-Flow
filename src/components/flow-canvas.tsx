import { Button } from "@ui/button";
import { GitBranchPlus } from "lucide-react";
import { FC, lazy, useCallback, useState } from "react";
import ReactFlow, { Background, Controls, Panel } from "reactflow";

import "reactflow/dist/style.css";
import ThemeSwitch from "./common/theme-switch";

const OperationsDialog = lazy(() => import("@/components/dialogs/operations-dialog"));

const FlowCanvas: FC = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleAddBlock = useCallback((): void => {
    setOpenModal(!openModal);
  }, [openModal]);

  return <>
    <OperationsDialog
      open={openModal}
      onOpenChange={handleAddBlock} />
    <ReactFlow fitView>
      <Background />
      <Controls />
      {/* <MiniMap className="dark:bg-muted-foreground" zoomable pannable /> */}
      <Panel position={"top-left"}>
        <Button
          size="icon"
          onClick={handleAddBlock}
          title="add operation">
          <GitBranchPlus size={16} />
        </Button>
      </Panel>
      <Panel position="top-right">
        <ThemeSwitch />
      </Panel>
    </ReactFlow>
  </>;
}

export default FlowCanvas;