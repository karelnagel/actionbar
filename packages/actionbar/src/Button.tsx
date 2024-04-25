import { ReactNode, CSSProperties } from "react";
import { actionBarOpen } from "./state";

export const ActionBarButton = ({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) => {
  return (
    <div
      onClick={() => actionBarOpen.set(true)}
      className={`cursor-pointer ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};
