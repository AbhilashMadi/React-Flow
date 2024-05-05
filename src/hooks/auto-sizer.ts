import { useEffect, useRef, useState } from "react";

const useAutoSizer = <T extends HTMLElement>() => {
  const containerRef = useRef<T>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return { containerRef, width: dimensions.width, height: dimensions.height };
};

export default useAutoSizer;
