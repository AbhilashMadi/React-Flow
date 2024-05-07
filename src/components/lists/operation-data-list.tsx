import useAutoSizer from "@/hooks/auto-sizer";
import { useAppDispatch, useAppSelector } from "@/hooks/state-hooks";
import { sortData } from "@/lib/sorters";
import { cn } from "@/lib/utils";
import { updateFlowData } from "@/store/reducers/flow-data-slice";
import { ArrowDown, ArrowUp, Grid2x2X } from "lucide-react";
import { useState, type FC } from "react";
import { FixedSizeGrid } from "react-window";

const OperationDataList: FC = () => {
  const { height, width, containerRef } = useAutoSizer<HTMLDivElement>();
  const dispatch = useAppDispatch();
  const [sortOrder, setSortOrder] = useState<"asc" | "dsc">("asc");
  const [sortedCol, setSortedCol] = useState<string>("");

  const { filedata } = useAppSelector(state => state.flowdata);

  const onSortClick = (col: string, order: typeof sortOrder) => {
    dispatch(updateFlowData({
      ...filedata,
      data: sortData(filedata.data, col, order)
    }));

    setSortOrder(order);
    setSortedCol(col);

  };


  const Cell: FC<{ rowIndex: number; columnIndex: number; style: React.CSSProperties }> = ({ rowIndex, columnIndex, style }) => {
    const isHeaderRow = rowIndex === 0;
    const headerCol = filedata.meta?.fields[columnIndex];

    const cellContent = isHeaderRow
      ? <>{headerCol || "--"}
        {sortOrder === "asc"
          ? <ArrowUp
            size={10}
            className="absolute right-2 top-2 inline cursor-pointer"
            aria-label="Sort column in descending order"
            onClick={() => { onSortClick(headerCol, "dsc") }} />
          : <ArrowDown
            size={10}
            className="absolute right-2 top-2 inline cursor-pointer"
            aria-label="Sort column in ascending order"
            onClick={() => { onSortClick(headerCol, "asc") }} />}
      </>
      : filedata.data[rowIndex - 1]?.[filedata.meta?.fields[columnIndex]] || "--";

    return (
      <div style={style} className={cn(isHeaderRow
        ? `border border-b-0 dark:bg-gray-400/[0.1] bg-gray-200
        ${sortedCol === headerCol && "dark:text-green-400 text-violet-700"}` : "border-t",
        columnIndex === 0 && "border-l", "border-r border-muted p-1 text-xs overflow-hidden leading-5 relative")}>
        {cellContent}
      </div>
    );
  };

  return (<div ref={containerRef} className="h-full">
    {
      filedata.data.length
        ? <FixedSizeGrid
          columnCount={filedata.meta?.fields?.length || 0}
          columnWidth={150}
          rowHeight={25}
          height={height}
          width={width}
          rowCount={(filedata.data.length || 0) + 1
          }>
          {Cell}
        </FixedSizeGrid>
        : <div className="grid-center h-full">
          <Grid2x2X
            size={50}
            className="text-secondary"
            aria-label="No data available" />
        </div>
    }
  </div>);
};

export default OperationDataList;
