import { type FC } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@ui/resizable";

const WorkFlow: FC = () => {

  return <ResizablePanelGroup direction="vertical" className="min-h-screen">
    <ResizablePanel defaultSize={75}>
      <div className="flex h-full items-center justify-center p-6">
        <span className="font-semibold">Workflow</span>
      </div>
    </ResizablePanel>
    <ResizableHandle withHandle />
    <ResizablePanel defaultSize={25} minSize={25} maxSize={92}>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={75}>
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Table</span>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={25} maxSize={25} minSize={15}>
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Min Sider</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </ResizablePanel>
  </ResizablePanelGroup>;
}

export default WorkFlow;