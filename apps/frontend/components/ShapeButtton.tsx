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
        className={`rounded-full p-3 ${activated ? "text-red-500 bg-accent-foreground/10 hover:text-red-500" : "text-white hover:text-red-500"}`}
        onClick={onClick}
      >
        {icon}
      </Button>
    </div>
  );
};
