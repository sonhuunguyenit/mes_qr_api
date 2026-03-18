import React from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { Spacer, Skeleton } from "~/common";
import { useTheme } from "~/hooks/useTheme";

const { width } = Dimensions.get("window");

const MenuBlockSkeleton = ({
  width: itemWidth,
  noBorder = false,
}: {
  width: number;
  noBorder?: boolean;
}) => {
  return (
    <View
      style={[
        styles.menuBlockSkeleton,
        { width: Math.max(0, Math.floor(itemWidth)) },
        noBorder && { borderWidth: 0, backgroundColor: "#F8FAFC" },
      ]}
    >
      <View style={styles.iconPlaceholder}>
        <Skeleton radius={10} height="100%" width="100%" />
      </View>
      <Spacer size={10} />
      <Skeleton width="75%" height={10} radius={4} />
    </View>
  );
};

export const HomeSkeleton = () => {
  const { spacing } = useTheme();

  const horizontalGap = 10;
  const columns = 3;
  const totalGapWidth = horizontalGap * (columns - 1);
  const homePadding = 10 * 2;
  const blockPadding = spacing.sm * 2;

  // Calculate width for 3 items per row
  const itemWidth =
    Math.floor((width - homePadding - blockPadding - totalGapWidth) / columns) -
    0.5;

  const collapsePadding = 16 * 2;
  const itemWidthCollapse =
    Math.floor(
      (width - homePadding - collapsePadding - totalGapWidth) / columns,
    ) - 0.5;

  return (
    <View style={{ flex: 1 }}>
      {/* 1. Quick Access Section (Non-group types: PR, PAYMENT, PO, BUSINESSPLAN, etc.) */}
      <View style={styles.blockGhost}>
        <View style={styles.blockHeaderSkeleton}>
          <Skeleton circle height={18} width={18} />
          <Spacer horizontal size={10} />
          <Skeleton width="30%" height={14} radius={4} />
        </View>
        <View style={styles.gridContainer}>
          {/* Show PR and PO items only in Quick Access skeleton */}
          {[1, 2].map((i) => (
            <MenuBlockSkeleton key={i} width={itemWidth} />
          ))}
        </View>
      </View>

      {/* 2. Expanded Group (SUPPLIER - Nhà cung cấp) */}
      <View style={[styles.collapseSkeleton, { height: "auto" }]}>
        <View style={styles.collapseHeaderSkeleton}>
          <View style={styles.headerInfo}>
            <Skeleton circle height={24} width={24} />
            <Spacer horizontal size={12} />
            <Skeleton width="45%" height={16} radius={4} />
          </View>
          <Skeleton circle height={20} width={20} />
        </View>

        <View
          style={[
            styles.gridContainer,
            { marginTop: 10, padding: 0, rowGap: 15 },
          ]}
        >
          {/* Match ~8 children in Supplier group */}
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <MenuBlockSkeleton key={i} width={itemWidthCollapse} noBorder />
          ))}
        </View>
      </View>

      {/* 3. Collapsed Group (BID - Duyệt gói thầu) */}
      <View style={styles.collapseHeaderGhost}>
        <View style={styles.headerInfo}>
          <Skeleton circle height={24} width={24} />
          <Spacer horizontal size={12} />
          <Skeleton width="40%" height={16} radius={4} />
        </View>
        <Skeleton circle height={20} width={20} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  blockGhost: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    overflow: "hidden",
  },
  blockHeaderSkeleton: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 15,
    paddingBottom: 5,
    paddingLeft: 20,
  },
  gridContainer: {
    padding: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  menuBlockSkeleton: {
    aspectRatio: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 10,
  },
  iconPlaceholder: {
    width: "50%",
    aspectRatio: 1,
    opacity: 0.6,
  },
  collapseHeaderGhost: {
    height: 64,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  collapseSkeleton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  collapseHeaderSkeleton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  headerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
});
