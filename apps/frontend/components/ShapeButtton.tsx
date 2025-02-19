import { ReactNode } from "react";
import { Button } from "./ui/button";

export const ShapeButton = ({
  onClick,
  icon,
  activated,
}: {
  onClick?: () => void;
  icon: ReactNode;
  activated: boolean;
}) => {
  return (
    <div>
      <Button
        variant={"ghost"}
        className={`p-2 rounded-md hover:bg-white/20 transition-colors3 ${activated ? "bg-white/20" : "bg-transparent"}`}
        onClick={onClick}
      >
        {icon}
      </Button>
    </div>
  );
};
