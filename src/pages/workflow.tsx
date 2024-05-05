import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@ui/resizable";
import { lazy, LazyExoticComponent, type FC } from "react";

const FlowCanvas: LazyExoticComponent<FC> = lazy(() => import("@/components/flow-canvas"));
const OperationDataList: LazyExoticComponent<FC> = lazy(() => import("@/components/lists/operation-data-list"));

const WorkFlow: FC = () => {

  return <ResizablePanelGroup direction="vertical" className="min-h-dvh">
    <ResizablePanel defaultSize={75}>
      <FlowCanvas />
    </ResizablePanel>
    <ResizableHandle withHandle />
    <ResizablePanel defaultSize={25} minSize={25}>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={75}>
          <OperationDataList />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={25} maxSize={25} minSize={15}>
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Min Sider</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup >
    </ResizablePanel >
  </ResizablePanelGroup >;
}

export default WorkFlow;