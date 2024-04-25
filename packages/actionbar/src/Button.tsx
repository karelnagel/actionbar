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
    <button onClick={() => actionBarOpen.set(true)} className={className} style={style}>
      {children}
    </button>
  );
};
