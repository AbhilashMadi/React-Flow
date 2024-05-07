import { useAppDispatch, useAppSelector, useData } from "@/hooks/state-hooks";
import { updateFlowData } from "@/store/reducers/flow-data-slice";
import { LogLevels } from "@/types/context";
import { Button, buttonVariants } from "@ui/button";
import { File } from "lucide-react";
import parser from "papaparse";
import { ChangeEvent, FC, memo, useRef } from "react";
import { Handle, NodeProps, NodeToolbar, Position } from "reactflow";

const InitialNode: FC<NodeProps> = memo((props) => {
  const dispatch = useAppDispatch();
  const { filedata } = useAppSelector((state) => state.flowdata);
  const { generateLog } = useData();
  console.log(props);

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

  return (<div>
    <input type="file" accept=".csv" className="hidden" ref={inputRef} onChange={handleFileChange} />
    {filedata.filename
      ? <div title={filedata.filename} className={buttonVariants({ variant: "default" })}>
        {filedata.filename}
      </div>
      : <Button size="sm" onClick={handleSelectFile}>
        <File size={14} className="mr-1" />Select File
      </Button>}
    {filedata.filename && <NodeToolbar position={Position.Bottom}>
      <pre className="text-[10px]">[DATASET]: {filedata.data.length} | {filedata.meta?.fields?.length} columns</pre>
    </NodeToolbar>}
    <Handle position={Position.Right} type="source" className="size-2 bg-purple-500" />
  </div>);
});

export default InitialNode;
