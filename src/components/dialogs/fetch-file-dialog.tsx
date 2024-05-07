import { useAppDispatch, useData } from "@/hooks/state-hooks";
import { updateFlowData } from "@/store/reducers/flow-data-slice";
import { LogLevels } from "@/types/context";
import { Button } from "@ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@ui/dialog";
import { Input } from "@ui/input";
import parser from "papaparse";
import { ChangeEvent, FC } from "react";

interface IFetchFileDialogProps {
  open: boolean;
  onOpenChange: () => void;
}

const FetchFileDialog: FC<IFetchFileDialogProps> = (props) => {
  const { onOpenChange, open } = props;
  const { generateLog } = useData();
  const dispatch = useAppDispatch();

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>): void => {
    try {
      const file = e.target.files?.[0];
      parser.parse(file as File, {
        // fastMode: true,
        header: true,
        complete: (data) => {
          console.log(data)
          dispatch(updateFlowData(data));
          onOpenChange();
          console.log(data);
          generateLog(`${data.errors.length} meny rows are affected while parsing data`, LogLevels.WARNING)
          generateLog(`successfully parsed data from file: ${file?.name ?? "--"}`, LogLevels.SUCCESS)
          generateLog(`
          file: ${file?.name ?? "--"} \n
          columns: ${data.meta?.fields?.join(", ")} \n
          rows: ${data.data.length}
          `, LogLevels.INFO)
        },
      });
    } catch (error) {
      console.error("Unable to import data from file:", error);
    }
  };

  const handleLoadSampleData = (): void => {
    try {
      parser.parse("https://upnow-prod.ff45e40d1a1c8f7e7de4e976d0c9e555.r2.cloudflarestorage.com/ZqvOMHRZqqYTv8IVvwesDk45ZWu2/a1541056-69ff-4b5d-b866-6ad289033f99?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=cdd12e35bbd220303957dc5603a4cc8e%2F20240506%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20240506T031955Z&X-Amz-Expires=43200&X-Amz-Signature=97ce27de3923a563f9aab5b05e21f0f06a7e80d7fbf3a6d03517db51ae993c0b&X-Amz-SignedHeaders=host&response-content-disposition=attachment%3B%20filename%3D%22electronic-card-transactions.csv%22", {
        // fastMode: true,
        header: true,
        download: true,
        complete: (res) => {
          dispatch(updateFlowData(res));
          onOpenChange();
        }
      })
    } catch (error) {
      console.error("unable to import sample data:", error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Load Data</DialogTitle>
          <DialogDescription>
            Choose a local .csv file to import data from for the application.
          </DialogDescription>
        </DialogHeader>
        <fieldset>
          <label htmlFor="picture" className="text-xs">Choose a local file:</label>
          <Input id="picture" type="file" accept=".csv" onChange={handleFileSelect} />
        </fieldset>
        <p className="mx-auto">or</p>
        <Button onClick={handleLoadSampleData}>Load Sample Data</Button>
      </DialogContent>
    </Dialog>
  );
};

export default FetchFileDialog;
