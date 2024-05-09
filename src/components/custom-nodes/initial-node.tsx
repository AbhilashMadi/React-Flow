import { useAppDispatch, useAppSelector, useData } from "@/hooks/state-hooks";
import { updateFlowData } from "@/store/reducers/flow-data-slice";
import { setNodes } from "@/store/reducers/nodes-list-slice";
import { LogLevels } from "@/types/context";
import { Button, buttonVariants } from "@ui/button";
import { File, FileDown, GripHorizontal } from "lucide-react";
import parser from "papaparse";
import { ChangeEvent, FC, memo, useRef } from "react";
import { Handle, NodeProps, NodeToolbar, Position } from "reactflow";
import sampleCsv from "../../assets/electronic-card-transactions.csv?url";


const InitialNode: FC<NodeProps> = memo(() => {
  const dispatch = useAppDispatch();
  const { filedata } = useAppSelector((state) => state.flowData);
  const { nodes } = useAppSelector((state) => state.flowNodes);
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
        complete: (res) => {
          dispatch(updateFlowData({ filename, ...res }));

          //updating the initila node with pared data
          dispatch(setNodes([{
            ...nodes[0],
            data: res.data,
          }]));

          generateLog(`${res.errors.length} rows are affected while parsing data`, LogLevels.WARNING)
          generateLog(`successfully parsed data from file: ${filename ?? "--"}`, LogLevels.SUCCESS)
          generateLog(`
          file: ${filename ?? "--"} \n
          columns: ${res.meta?.fields?.join(", ")} \n
          rows: ${res.data.length}
          `, LogLevels.INFO)
        },
      });
    } catch (error) {
      generateLog("Unable to import data from file:", LogLevels.ERROR);
    }
  };

  const handleLoadSampleData = (): void => {
    try {
      const filename = "electronic-card-transactions.csv";

      parser.parse(sampleCsv, {
        header: true,
        download: true,
        complete: (res) => {
          dispatch(updateFlowData({ filename, ...res }));
          dispatch(setNodes([{
            ...nodes[0],
            data: res.data,
          }]));

          generateLog(`${res.errors.length} rows are affected while parsing data`, LogLevels.WARNING)
          generateLog(`successfully parsed data from file: ${filename ?? "--"}`, LogLevels.SUCCESS)
          generateLog(`
          file: ${filename ?? "--"} \n
          columns: ${res.meta?.fields?.join(", ")} \n
          rows: ${res.data.length}
          `, LogLevels.INFO)
        },
        error: (error) => {
          generateLog(`Error parsing CSV: ${error}`, LogLevels.ERROR);
        }
      });
    } catch (error) {
      console.log(error)
    }
  }


  return (<div className="flex gap-2 rounded bg-muted p-2">
    <input type="file" accept=".csv" className="hidden" ref={inputRef} onChange={handleFileChange} />
    {filedata.filename
      ? <div title={filedata.filename} className={buttonVariants({ variant: "default" })}>
        {filedata.filename}
      </div>
      : <>
        <Button size="sm" onClick={handleSelectFile}>
          <File size={14} className="mr-1" />
          Select File
        </Button>
        <Button size="sm" onClick={handleLoadSampleData}>
          <FileDown size={14} className="mr-1" />
          Lode sample data
        </Button>
        <div className="grid-center mt-1 h-4">
          <GripHorizontal />
        </div>
      </>}
    {filedata.filename && <NodeToolbar position={Position.Bottom}>
      <pre className="text-[10px]">[DATASET]: {filedata.data.length} | {filedata.meta?.fields?.length} columns</pre>
    </NodeToolbar>}
    <Handle position={Position.Right} type="source" className="size-2 bg-purple-500" />
  </div>);
});

export default InitialNode;
