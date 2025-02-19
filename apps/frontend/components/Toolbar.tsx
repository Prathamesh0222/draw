import {
  Circle,
  Droplet,
  Pencil,
  RectangleHorizontal,
  Type,
} from "lucide-react";
import { ShapeButton } from "./ShapeButtton";
import { SelectType } from "./Canvas";
import { useState } from "react";

const COLORS = [
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FFA500",
  "#800080",
  "#FFC0CB",
  "#FFFFFF",
];

export const Toolbar = ({
  selectedTool,
  setSelectedTool,
  color,
  setColor,
}: {
  selectedTool: SelectType;
  setSelectedTool: (s: SelectType) => void;
  color: string;
  setColor: (c: string) => void;
}) => {
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  return (
    <div className="absolute flex gap-2 m-4">
      <div className="flex flex-col gap-2 p-2 rounded-lg bg-white/10 backdrop-blur-lg border border-white/20">
        <ShapeButton
          activated={isColorPickerOpen}
          onClick={() => {
            setIsColorPickerOpen(!isColorPickerOpen);
          }}
          icon={
            <div className="relative">
              <Droplet className="text-white" />
              <div
                className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white/50"
                style={{ backgroundColor: color }}
              />
            </div>
          }
        />

        {isColorPickerOpen && (
          <div className="absolute left-16 top-0 bg-white/10 backdrop-blur-lg p-5 rounded-lg border border-white/20 space-y-2">
            {COLORS.map((colorOption) => (
              <button
                key={colorOption}
                onClick={() => {
                  setColor(colorOption);
                  setIsColorPickerOpen(false);
                }}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  color === colorOption
                    ? "border-white scale-110"
                    : "border-transparent hover:border-white/50"
                }`}
                style={{ backgroundColor: colorOption }}
                title={`Select ${colorOption}`}
              />
            ))}
          </div>
        )}

        <div className="w-full h-px bg-white/20" />

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
        <ShapeButton
          activated={selectedTool === SelectType.text}
          onClick={() => [setSelectedTool(SelectType.text)]}
          icon={<Type />}
        />
      </div>
    </div>
  );
};
