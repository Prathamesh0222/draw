import { Circle, Pencil, RectangleHorizontal } from "lucide-react";
import { ShapeButton } from "./ShapeButtton";
import { SelectType } from "./Canvas";

export const Toolbar = ({
  selectedTool,
  setSelectedTool,
}: {
  selectedTool: SelectType;
  setSelectedTool: (s: SelectType) => void;
}) => {
  return (
    <div className="absolute flex gap-2 m-4">
      <ShapeButton
        activated={selectedTool === SelectType.circle}
        onClick={() => {
          setSelectedTool(SelectType.circle);
        }}
        icon={<Circle />}
      />
      <ShapeButton
        activated={selectedTool === SelectType.rectangle}
        onClick={() => {
          setSelectedTool(SelectType.rectangle);
        }}
        icon={<RectangleHorizontal />}
      />
      <ShapeButton
        activated={selectedTool === SelectType.pencil}
        onClick={() => [setSelectedTool(SelectType.pencil)]}
        icon={<Pencil />}
      />
    </div>
  );
};
