import { createElement, useMemo } from "react";
import { Rect } from "./types";
import ClipPath from "../../svg/clipPath";
import { renderDenseBigBedData } from "./helpers";
import { useXTransform } from "../../../hooks/useXTransform";
import { useTheme } from "../../../store/themeStore";
import { useTooltipStore } from "../../../store/tooltipStore";
import { DenseBigBedProps } from "./types";
import DefaultTooltip from "../../tooltip/defaultTooltip";

function DenseBigBed({ id, data, height, color, dimensions, onClick, onHover, onLeave, tooltip }: DenseBigBedProps) {
  const { totalWidth, sideWidth } = dimensions;
  const x = useXTransform(totalWidth);

  const rendered: Rect[] = useMemo(() => {
    return renderDenseBigBedData(data || [], x);
  }, [data, x]);

  const { background } = useTheme();

  const handleClick = (rect: Rect) => {
    if (onClick) {
      onClick(rect);
    }
  };

  const showTooltip = useTooltipStore((state) => state.showTooltip);
  const hideTooltip = useTooltipStore((state) => state.hideTooltip);
  const handleMouseOver = (rect: Rect, e: React.MouseEvent<SVGGElement>) => {
    if (onHover) {
      onHover(rect);
    }
    let content = <DefaultTooltip value={rect.name || ""} />;
    if (tooltip) {
      content = createElement(tooltip, rect);
    }
    showTooltip(content, e.clientX, e.clientY);
  };

  const handleMouseOut = (rect: Rect) => {
    if (onLeave) {
      onLeave(rect);
    }
    hideTooltip();
  };

  return (
    <g width={totalWidth} height={height} clipPath={`url(#${id})`} transform={`translate(-${sideWidth}, 0)`}>
      <rect width={totalWidth} height={height} fill={background} />
      <defs>
        <ClipPath id={id} width={totalWidth} height={height} />
      </defs>
      {rendered.map((rect, i) => (
        <rect
          style={{ cursor: onClick ? "pointer" : "default" }}
          key={`${id}_${i}`}
          height={height * 0.6}
          width={rect.end - rect.start}
          x={rect.start}
          y={height * 0.2}
          fill={rect.color || color}
          onClick={() => handleClick(rect)}
          onMouseOver={(e) => handleMouseOver(rect, e)}
          onMouseOut={() => handleMouseOut(rect)}
        />
      ))}
    </g>
  );
}
export default DenseBigBed;
