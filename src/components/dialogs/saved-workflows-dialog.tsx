import { getWorkflows, removeWorkflow } from "@/db/storage-services";
import { useAppDispatch, useData } from "@/hooks/state-hooks";
import { importFlowState, resetFlowState } from "@/store/reducers/flow-data-slice";
import { importNodesState, resetFlowNodes } from "@/store/reducers/nodes-list-slice";
import { LogLevels } from "@/types/context";
import { WorkflowFolder } from "@/types/storage-schemas";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@ui/dialog";
import { ArchiveX, FolderGit2, FolderPlus, Trash2 } from "lucide-react";
import { FC, useCallback, useEffect, useState } from "react";

interface ISavedWorkflowsDialogProps {
  open: boolean;
  onOpenChange: () => void;
}

const SavedWorkflowsDialog: FC<ISavedWorkflowsDialogProps> = (props) => {
  const { onOpenChange, open } = props;
  const [workflows, setWorkflows] = useState<WorkflowFolder[]>([]);

  const { generateLog } = useData();
  const dispatch = useAppDispatch();

  const update = useCallback(async () => {
    await getWorkflows()
      .then((flows) => setWorkflows(flows))
      .catch((err) => generateLog(err, LogLevels.ERROR))
  }, [generateLog])

  const handleFileSelect = (workflow: WorkflowFolder): void => {
    dispatch(importFlowState(workflow.flowData));
    dispatch(importNodesState(workflow.flowNodes));
    onOpenChange();
    generateLog(`imported saved state from folder:\n folder: ${workflow.folderName}`, LogLevels.INFO);
  }

  const handleCreateNew = (): void => {
    dispatch(resetFlowNodes());
    dispatch(resetFlowState());
    onOpenChange();
  }

  const handleSavedDelete = async (workflow: WorkflowFolder): Promise<void> => {
    await removeWorkflow(workflow.id)
      .then(() => {
        update();
        generateLog(`deleted saved workflow: ${workflow.folderName}`, LogLevels.WARNING)
      })
      .catch((err) => {
        generateLog(`error while deleting the folder:\n${err}`, LogLevels.ERROR)
      })
  }

  useEffect(() => {
    update();
  }, [generateLog, open, update]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Saved workflows</DialogTitle>
        </DialogHeader>
        {workflows.length
          ? <div className="grid grid-cols-4 gap-4">
            {workflows.map((workflow) => (
              <button key={workflow.id} className="grid-center relative rounded border bg-gray-500/[0.3] p-4 transition-all hover:scale-105 hover:border-primary hover:bg-gray-400/[0.5] hover:shadow-md"
                onClick={() => {
                  console.log("clicked big")
                  handleFileSelect(workflow)
                }}>
                <div
                  className="absolute -right-2 -top-2 rounded bg-primary p-1 text-secondary dark:text-red-500"
                  onClick={(e) => {
                    console.log("clicked button")
                    handleSavedDelete(workflow);
                    e.stopPropagation();
                  }}>
                  <Trash2 size={14} />
                </div>
                <div
                  className="text-center">
                  <FolderGit2 size={30} strokeWidth={1} className="mx-auto" />
                  <span className="text-[8px]">{workflow.folderName}</span>
                </div>
              </button>
            ))}
            <button className="grid-center rounded border bg-gray-500/[0.5] p-4 transition-all hover:scale-105 hover:border-primary hover:bg-gray-400/[0.5] hover:shadow-md"
              onClick={handleCreateNew}>
              <div
                className="text-center">
                <FolderPlus size={30} strokeWidth={1} className="mx-auto" />
              </div>
            </button>
          </div>
          : <div className="grid-center h-[200px] text-muted">
            <ArchiveX size={40} />
          </div>}
      </DialogContent>
    </Dialog>
  );
};

export default SavedWorkflowsDialog;
