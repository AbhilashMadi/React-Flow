import { useAppDispatch, useAppSelector, useData } from "@/hooks/state-hooks";
import { updateFlowData } from "@/store/reducers/flow-data-slice";
import { LogLevels } from "@/types/context";
import { Button } from "@ui/button";
import { File } from "lucide-react";
import parser from "papaparse";
import { ChangeEvent, FC, memo, useRef } from "react";
import { Handle, NodeProps, Position } from "reactflow";

const InitialNode: FC<NodeProps> = memo((props) => {
  const dispatch = useAppDispatch();
  const { filedata } = useAppSelector((state) => state.flowdata);
  const { generateLog } = useData();

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelectFile = (): void => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files && event.target.files[0];
    const filename = file?.name;

    try {
      parser.parse(file as File, {
        header: true,
        complete: (data) => {
          dispatch(updateFlowData({ filename, ...data }));
          generateLog(`${data.errors.length} meny rows are affected while parsing data`, LogLevels.WARNING)
          generateLog(`successfully parsed data from file: ${filename ?? "--"}`, LogLevels.SUCCESS)
          generateLog(`
          file: ${filename ?? "--"} \n
          columns: ${data.meta?.fields?.join(", ")} \n
          rows: ${data.data.length}
          `, LogLevels.INFO)
        },
      });
    } catch (error) {
      generateLog("Unable to import data from file:", LogLevels.ERROR);
    }
  };

  return (<div className="text-[10px]">
    <input type="file" accept=".csv" className="hidden" ref={inputRef} onChange={handleFileChange} />
    {filedata.filename
      ? <Button size="sm" title={filedata.filename}>
        Documents: {filedata.data.length}
      </Button>
      : <Button size="sm" onClick={handleSelectFile}>
        <File size={14} className="mr-1" />Select File
      </Button>}
    <Handle position={Position.Right} type="source" />
  </div>);
});

export default InitialNode;
