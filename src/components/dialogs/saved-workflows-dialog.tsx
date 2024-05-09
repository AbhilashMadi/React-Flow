import { getWorkflows } from "@/db/storage-services";
import { useData } from "@/hooks/state-hooks";
import { LogLevels } from "@/types/context";
import { WorkflowFolder } from "@/types/storage-schemas";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@ui/dialog";
import { ArchiveX, FolderGit2 } from "lucide-react";
import { FC, useEffect, useState } from "react";

interface ISavedWorkflowsDialogProps {
  open: boolean;
  onOpenChange: () => void;
}

const SavedWorkflowsDialog: FC<ISavedWorkflowsDialogProps> = (props) => {
  const { onOpenChange, open } = props;
  const [workflows, setWorkflows] = useState<WorkflowFolder[]>([]);
  const { generateLog } = useData();

  useEffect(() => {
    const update = async () => {
      await getWorkflows()
        .then((flows) => setWorkflows(flows))
        .catch((err) => generateLog(err, LogLevels.ERROR))
    }

    update();
  }, [generateLog, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Saved workflows</DialogTitle>
        </DialogHeader>
        {workflows.length
          ? <div className="grid grid-cols-4 gap-4">
            {workflows.map((workflow) => (
              <button key={workflow.id} className="grid-center rounded border bg-gray-500/[0.3] p-4 transition-all hover:scale-105 hover:border-primary hover:bg-gray-400/[0.5] hover:shadow-md">
                <div className="text-center">
                  <FolderGit2 size={30} strokeWidth={1} className="mx-auto" />
                  <span className="break-all font-mono text-[10px] font-thin">{workflow.folderName}</span>
                </div>
              </button>
            ))}
          </div>
          : <div className="grid-center h-[200px] text-muted"><ArchiveX size={40} /></div>}
      </DialogContent>
    </Dialog>
  );
};

export default SavedWorkflowsDialog;
