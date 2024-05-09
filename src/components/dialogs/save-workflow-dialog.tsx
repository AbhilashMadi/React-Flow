import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@ui/dialog";
import { FC } from "react";
import { Switch } from "@ui/switch";
import { Input } from "@ui/input";
import { Button } from "@ui/button";
import { Save } from "lucide-react";
import { useFormik } from "formik";

interface ISaveWorkFlowDialog {
  open: boolean;
  onOpenChange: () => void;
}

const SaveWorkFlowDialog: FC<ISaveWorkFlowDialog> = (props) => {
  const { open, onOpenChange } = props;

  const saveFolderFormik = useFormik<{
    folderName: string;
    isClear: boolean;
  }>({
    enableReinitialize: true,
    initialValues: {
      folderName: "",
      isClear: true,
    },
    onSubmit: (values) => {
      console.log(values);
    }
  })

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