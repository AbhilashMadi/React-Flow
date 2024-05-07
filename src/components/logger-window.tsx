import { useData } from "@/hooks/state-hooks";
import { LogLevels } from "@/types/context";
import { CircleCheck, CircleXIcon, Info, SquareTerminal, TriangleAlert } from "lucide-react";
import { FC, ReactNode, useEffect, useRef } from "react";

const LoggerWindow: FC = () => {
  const { logs } = useData();
  const logsWindowRef = useRef<HTMLUListElement>(null);

  const colorMap: Readonly<{ [K in LogLevels]: string }> = {
    [LogLevels.ERROR]: "dar:bg-red-400/[0.1] bg-red-400/[0.5] dark:text-red-200 text-primary",
    [LogLevels.INFO]: "dark:bg-blue-400/[0.1] bg-blue-400/[0.5] dark:text-blue-200 text-primary",
    [LogLevels.SUCCESS]: "dark:bg-green-400/[0.1] bg-green-400/[0.5] dark:text-green-200 text-primary",
    [LogLevels.WARNING]: "dark:bg-yellow-400/[0.1] bg-yellow-400/[0.5] dark:text-yellow-200 text-primary",
  };

  const iconMap: Readonly<{ [K in LogLevels]: ReactNode }> = {
    [LogLevels.ERROR]: <CircleXIcon size={14} aria-label="Error" />,
    [LogLevels.INFO]: <Info size={14} aria-label="Info" />,
    [LogLevels.SUCCESS]: <CircleCheck size={14} aria-label="Success" />,
    [LogLevels.WARNING]: <TriangleAlert size={14} aria-label="Warning" />,
  } as const;

  useEffect(() => {
    if (logsWindowRef.current) {
      logsWindowRef.current.scrollTop = logsWindowRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <ul className="relative size-full overflow-y-scroll" ref={logsWindowRef}>
      {logs.length ? (
        logs.map((o, i) => (
          <li key={`${o.time}-${i}`} className={`${colorMap[o.logLevel]} m-1 flex gap-2 rounded-lg p-2`}>
            <pre>{iconMap[o.logLevel]}</pre>
            <p className="break-all font-mono text-[10px] leading-normal">
              {o.message.split(/\n/).filter(Boolean).map(s => <span className="mb-2 block text-[10px] leading-normal" key={`${o.time}-${s}`}>{s}</span>)}
            </p>
          </li>
        ))
      ) : (
        <SquareTerminal
          size={50}
          className="absolute left-1/2 top-1/2 mx-auto -translate-x-1/2 -translate-y-1/2 text-secondary"
          aria-label="No logs available"
        />
      )}
    </ul>
  );
};

export default LoggerWindow;
