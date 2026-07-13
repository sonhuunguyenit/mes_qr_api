import React from "react";
import { useTheme } from "~/hooks/useTheme";
import { ModuleItem } from "../types";
import { MenuBlock } from "./MenuGrid";

export const CollapseItem = ({
  item,
  index = 0,
  total = 0,
  onPress,
}: {
  item: ModuleItem;
  index?: number;
  total?: number;
  onPress?: () => void;
}) => {
  return (
    <MenuBlock
      title={item.title}
      icon={item.icon as any}
      iconType={item.iconType}
      count={item.count}
      columns={4}
      iconColor={item.iconColor}
      iconContainerColor={item.iconContainerColor}
      index={index}
      total={total}
      iconSize={item.iconSize || 32}
      onPress={onPress}
    />
  );
};
