import { storeNewWorkflow } from "@/db/storage-services";
import { useAppDispatch, useAppSelector, useData } from "@/hooks/state-hooks";
import { generateId } from "@/lib/generators";
import { resetFlowState } from "@/store/reducers/flow-data-slice";
import { resetFlowNodes } from "@/store/reducers/nodes-list-slice";
import { LogLevels } from "@/types/context";
import { Button } from "@ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@ui/dialog";
import { Input } from "@ui/input";
import { Switch } from "@ui/switch";
import { useFormik } from "formik";
import { Save } from "lucide-react";
import { FC } from "react";

interface ISaveWorkFlowDialog {
  open: boolean;
  onOpenChange: () => void;
}

const SaveWorkFlowDialog: FC<ISaveWorkFlowDialog> = (props) => {
  const { open, onOpenChange } = props;
  const { generateLog } = useData();

  const flowData = useAppSelector(state => state.flowData);
  const flowNodes = useAppSelector(state => state.flowNodes);
  const dispatch = useAppDispatch();

  const saveFolderFormik = useFormik<{
    folderName: string;
    isClear: boolean;
  }>({
    enableReinitialize: true,
    initialValues: {
      folderName: "",
      isClear: true,
    },
    onSubmit: async (values, { resetForm }) => {
      const { folderName, isClear } = values;
      await storeNewWorkflow({
        flowData,
        flowNodes,
        folderName,
        id: generateId(),
      }).then((res) => {
        generateLog(`successfully saved the workflow with folder name: ${folderName}, id: ${res}`, LogLevels.SUCCESS)
        onOpenChange();
        resetForm();

        if (isClear) {
          dispatch(resetFlowNodes())
          dispatch(resetFlowState())
        }
      }).catch((err) => {
        generateLog(err, LogLevels.ERROR)
      })
    }
  });

  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Save current workflow</DialogTitle>
      </DialogHeader>
      <form className="flex flex-col gap-3" onSubmit={saveFolderFormik.handleSubmit}>
        <Input placeholder="Folder name"
          onChange={saveFolderFormik.handleChange}
          value={saveFolderFormik.values.folderName}
          name="folderName"
          onBlur={saveFolderFormik.handleBlur} />
        <Button
          size={"sm"}
          disabled={!saveFolderFormik.values.folderName}>
          <Save size={16} className="mr-2" />Save</Button>
        <fieldset className="flex items-center gap-4">
          <label
            htmlFor="clear-workflow"
            className="ml-auto w-20 text-xs">Clear current workflow:</label>
          <Switch id="clear-workflow" name="isClear"
            onCheckedChange={(checked) => saveFolderFormik.setFieldValue("isClear", checked)}
            checked={saveFolderFormik.values.isClear} />
        </fieldset>
      </form>
    </DialogContent>
  </Dialog>
}

export default SaveWorkFlowDialog;