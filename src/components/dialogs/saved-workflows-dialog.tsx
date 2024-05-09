import { generateId } from "@/lib/generators";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@ui/dialog";
import { FolderGit2 } from "lucide-react";
import { FC } from "react";

interface ISavedWorkflowsDialogProps {
  open: boolean;
  onOpenChange: () => void;
}

const SavedWorkflowsDialog: FC<ISavedWorkflowsDialogProps> = (props) => {
  const { onOpenChange, open } = props;

  const savedWorkflows = [
    {
      id: generateId(),
      folderName: "foldername",
      flowData: [],
      flowNodes: [],
    },
    {
      id: generateId(),
      folderName: "foldername",
      flowData: [],
      flowNodes: [],
    },
    {
      id: generateId(),
      folderName: "foldername",
      flowData: [],
      flowNodes: [],
    },
    {
      id: generateId(),
      folderName: "foldername",
      flowData: [],
      flowNodes: [],
    },
    {
      id: generateId(),
      folderName: "foldername",
      flowData: [],
      flowNodes: [],
    },
    {
      id: generateId(),
      folderName: "foldername",
      flowData: [],
      flowNodes: [],
    },
    {
      id: generateId(),
      folderName: "foldername",
      flowData: [],
      flowNodes: [],
    },
    {
      id: generateId(),
      folderName: "foldername",
      flowData: [],
      flowNodes: [],
    },
    {
      id: generateId(),
      folderName: "foldername",
      flowData: [],
      flowNodes: [],
    },
    {
      id: generateId(),
      folderName: "foldername",
      flowData: [],
      flowNodes: [],
    },
    {
      id: generateId(),
      folderName: "foldername",
      flowData: [],
      flowNodes: [],
    },
    {
      id: generateId(),
      folderName: "foldername",
      flowData: [],
      flowNodes: [],
    },
    {
      id: generateId(),
      folderName: "foldername",
      flowData: [],
      flowNodes: [],
    },
    {
      id: generateId(),
      folderName: "foldername",
      flowData: [],
      flowNodes: [],
    },
    {
      id: generateId(),
      folderName: "foldername",
      flowData: [],
      flowNodes: [],
    },
  ]


  return (<Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Saved workflows</DialogTitle>
      </DialogHeader>
      <div className="grid grid-cols-4 gap-4">
        {savedWorkflows.map((o) => (<button key={o.id} className="grid-center rounded border bg-gray-500/[0.3] p-4 transition-all hover:scale-105 hover:border-primary hover:bg-gray-400/[0.5] hover:shadow-md">
          <div className="text-center">
            <FolderGit2 size={30} strokeWidth={1} className="mx-auto" />
            <span className="break-all font-mono text-[10px] font-thin">{o.folderName}</span>
          </div>
        </button>))}
      </div>
    </DialogContent>
  </Dialog>)
}

export default SavedWorkflowsDialog;