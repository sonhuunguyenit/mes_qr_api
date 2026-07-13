import { Icon } from "@rneui/base";
import { LinearGradient } from "expo-linear-gradient";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  LayoutChangeEvent,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";

import { sizes } from "~/constants/sizes";
import { useTheme } from "~/hooks/useTheme";
import { Text } from "../Text";

// ─── Types ────────────────────────────────────────────────────────────────────

type RowType = "Header" | "Content";
type AlignSide = "left" | "center" | "right";

export type ColumnTable =
  | number
  | string
  | React.ReactNode
  | { text: string; style?: TextStyle };

export type RowTable = {
  rowStyle?: ViewStyle;
  cellStyle?: ViewStyle;
  cells: ColumnTable[];
};

interface LayoutTable {
  headerHeight: number;
  rowHeights: number[];
}

export interface PaginationConfig {
  /** Bật/tắt pagination. Default: false */
  enabled: boolean;
  /** Số dòng mỗi trang. Default: 5 */
  defaultPageSize?: number;
  /** Các lựa chọn số dòng/trang. Default: [5, 10, 20] */
  pageSizeOptions?: number[];
  /** Hiện "1–5 / 20 dòng". Default: true */
  showTotal?: boolean;
  /** Callback mỗi khi đổi trang hoặc pageSize */
  onPageChange?: (page: number, pageSize: number) => void;
}

interface TableCustomProps {
  columns: ColumnTable[];
  headerRowStyle?: ViewStyle;
  headerTextStyle?: TextStyle;
  headerColumnAlign?: AlignSide[];
  rows: RowTable[];
  containerStyle?: ViewStyle;
  cellTextStyle?: TextStyle;
  horizontalScroll?: boolean;
  columnWidths?: (number | "auto")[];
  columnFlexValues?: number[];
  columnAlignments?: AlignSide[];
  columnTextAlignments?: AlignSide[];
  stickyColumn?: "left" | "right";
  onRowPress?: (rowIndex: number) => void;
  onRowDoublePress?: (rowIndex: number) => void;
  /** Không truyền → không hiện pagination (backward-compatible) */
  pagination?: PaginationConfig;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const HEADER_ROW_INDEX = -1;
const DEFAULT_ROW_HEIGHT = 55;
const MAX_VISIBLE_PAGES = 5;

const DEFAULT_PAGINATION: PaginationConfig = {
  enabled: true,
  defaultPageSize: 5,
  pageSizeOptions: [],
  showTotal: false,
};

const AlignItem: Record<AlignSide, ViewStyle> = {
  left: { alignItems: "flex-start" },
  center: { alignItems: "center" },
  right: { alignItems: "flex-end" },
};

const AlignText: Record<AlignSide, TextStyle> = {
  left: { textAlign: "left" },
  center: { textAlign: "center" },
  right: { textAlign: "right" },
};

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 1 — usePagination (hook)
// ═══════════════════════════════════════════════════════════════════════════════

interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  isFirstPage: boolean;
  isLastPage: boolean;
}

interface PaginationActions {
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setPageSize: (size: number) => void;
}

type UsePaginationReturn = PaginationState & PaginationActions;

/**
 * usePagination — client-side pagination logic.
 * - totalItems tăng/giảm → giữ nguyên trang nếu còn hợp lệ, ngược lại clamp về cuối
 * - pageSize thay đổi → reset về trang 1
 */
const usePagination = (
  totalItems: number,
  options: {
    defaultPageSize?: number;
    onPageChange?: (page: number, pageSize: number) => void;
  } = {},
): UsePaginationReturn => {
  const { defaultPageSize = 5, onPageChange } = options;

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(defaultPageSize);

  const onPageChangeRef = useRef(onPageChange);
  useEffect(() => {
    onPageChangeRef.current = onPageChange;
  }, [onPageChange]);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    if (totalItems === 0) {
      setCurrentPage(1);
      return;
    }
    const newTotalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    setCurrentPage((prev) => (prev > newTotalPages ? newTotalPages : prev));
  }, [totalItems, pageSize]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  const goToPage = useCallback(
    (page: number) => {
      const clamped = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(clamped);
      onPageChangeRef.current?.(clamped, pageSize);
    },
    [totalPages, pageSize],
  );

  const nextPage = useCallback(
    () => goToPage(currentPage + 1),
    [goToPage, currentPage],
  );

  const prevPage = useCallback(
    () => goToPage(currentPage - 1),
    [goToPage, currentPage],
  );

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size);
    setCurrentPage(1);
    onPageChangeRef.current?.(1, size);
  }, []);

  return {
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    startIndex,
    endIndex,
    isFirstPage: currentPage === 1,
    isLastPage: currentPage === totalPages,
    goToPage,
    nextPage,
    prevPage,
    setPageSize,
  };
};

// ─── Style Hooks (memoized per theme change, not per render) ─────────────────

const useTableStyles = () => {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        tableContainer: {
          borderRadius: 10,
          borderWidth: 1,
          overflow: "hidden",
        },
        layout: { flexDirection: "row" },
        fixedSection: { zIndex: 2 },
        stickyLeftShadowGradient: {
          position: "absolute",
          right: -4,
          top: 0,
          bottom: 0,
          width: 4,
        },
        stickyRightShadowGradient: {
          position: "absolute",
          left: -4,
          top: 0,
          bottom: 0,
          width: 4,
        },
        rowContainer: { borderBottomWidth: 0.8 },
        headerRowContainer: {},
        activeRowContainer: {
          backgroundColor: colors.gray200 as string,
          marginHorizontal: 4,
          borderRadius: 8,
          marginVertical: 2,
        },
        defaultRow: { flexDirection: "row" },
        defaultHeaderStyle: {
          minHeight: DEFAULT_ROW_HEIGHT,
          paddingVertical: 10,
          justifyContent: "center",
          alignItems: "center",
        },
        defaultContentStyle: {
          minHeight: DEFAULT_ROW_HEIGHT,
          paddingVertical: 10,
          justifyContent: "center",
          alignItems: "center",
        },
        defaultHeaderText: {
          fontSize: 13,
          fontWeight: "600",
          color: colors.title as string,
        },
        defaultContentText: {
          fontSize: sizes.fontSize.base,
          fontWeight: "400",
          color: colors.text as string,
        },
        noDataContainer: {
          height: 100,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 8,
          marginVertical: 4,
        },
        noDataText: {
          fontSize: sizes.fontSize.base,
          fontWeight: "500",
          color: colors.label as string,
        },
        hintText: {
          fontSize: 11,
          fontWeight: "400",
          color: colors.neutral700Alt as string,
          alignSelf: "flex-end",
          marginVertical: 8,
          marginRight: 10,
        },
        filterButton: {
          padding: 6,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.gray200 as string,
          borderRadius: 5,
        },
        filterDot: {
          position: "absolute",
          top: 6,
          right: 6,
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: colors.accentRed as string,
        },
        eyeButton: {
          height: 50,
          width: 50,
          justifyContent: "center",
          alignItems: "center",
        },
        scrollTrack: {
          height: 8,
          backgroundColor: colors.gray100 as string,
          borderRadius: 4,
          marginHorizontal: 8,
          marginTop: 5,
          marginBottom: 4,
          overflow: "hidden",
        },
        scrollThumb: {
          height: "100%",
          backgroundColor: colors.gray400 as string,
          borderRadius: 4,
        },
      }),
    [colors],
  );
  return { styles, colors };
};

const usePaginationStyles = () => {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          paddingHorizontal: 12,
          gap: 8,
          borderTopWidth: 1,
          borderColor: colors.border as string,
        },
        topRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
        bottomRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
        },
        totalText: {
          fontSize: sizes.fontSize.base,
          fontWeight: "500",
          color: colors.text as string,
        },
        totalTextMuted: {
          fontSize: sizes.fontSize.base,
          fontWeight: "400",
          color: colors.label as string,
        },
        pageSizeRow: { flexDirection: "row", gap: 4 },
        pageSizeBtn: {
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 6,
          borderWidth: 1,
          borderColor: colors.border as string,
        },
        pageSizeBtnActive: {
          borderColor: (colors.primary ?? colors.brandBlue) as string,
          backgroundColor: (colors.primary ?? colors.brandBlue) as string,
        },
        pageSizeBtnText: {
          fontSize: sizes.fontSize.sm,
          fontWeight: "500",
          color: colors.label as string,
        },
        pageSizeBtnTextActive: { color: colors.white as string },
        navBtn: {
          width: 35,
          height: 35,
          borderRadius: 35,
          borderWidth: 1,
          borderColor: colors.border as string,
          justifyContent: "center",
          alignItems: "center",
        },
        navBtnDisabled: { opacity: 0.4 },
        pageNumbersRow: { flexDirection: "row", alignItems: "center", gap: 4 },
        pageBtn: {
          minWidth: 35,
          height: 35,
          paddingHorizontal: 6,
          borderRadius: 35,
          borderWidth: 1,
          borderColor: colors.border as string,
          justifyContent: "center",
          alignItems: "center",
        },
        pageBtnActive: {
          borderColor: colors.brandBlue as string,
          backgroundColor: colors.brandBlue as string,
        },
        pageBtnText: {
          fontSize: sizes.fontSize.base,
          fontWeight: "500",
          color: colors.text as string,
        },
        pageBtnTextActive: { color: colors.white as string },
        ellipsis: {
          width: 28,
          height: 32,
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 4,
        },
        ellipsisText: {
          fontSize: sizes.fontSize.base,
          color: colors.label as string,
          letterSpacing: 1,
        },
      }),
    [colors],
  );
  return { styles, colors };
};

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 2 — TablePagination (UI)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * buildPageWindows — tính danh sách trang cần render, chèn null cho ellipsis.
 * Ví dụ (current=5, total=10): [1, null, 4, 5, 6, null, 10]
 */
const buildPageWindows = (
  currentPage: number,
  totalPages: number,
): (number | null)[] => {
  if (totalPages <= MAX_VISIBLE_PAGES) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages: (number | null)[] = [];
  const delta = 1;
  const left = Math.max(2, currentPage - delta);
  const right = Math.min(totalPages - 1, currentPage + delta);

  pages.push(1);
  if (left > 2) pages.push(null);
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < totalPages - 1) pages.push(null);
  pages.push(totalPages);

  return pages;
};

const PageSizeSelector = React.memo(
  ({
    pageSize,
    pageSizeOptions,
    setPageSize,
  }: {
    pageSize: number;
    pageSizeOptions: number[];
    setPageSize: (size: number) => void;
  }) => {
    const { styles: paginationStyles } = usePaginationStyles();
    return (
      <View style={paginationStyles.pageSizeRow}>
        {pageSizeOptions.map((size) => (
          <TouchableOpacity
            key={size}
            style={[
              paginationStyles.pageSizeBtn,
              pageSize === size && paginationStyles.pageSizeBtnActive,
            ]}
            onPress={() => setPageSize(size)}
          >
            <Text
              style={[
                paginationStyles.pageSizeBtnText,
                pageSize === size && paginationStyles.pageSizeBtnTextActive,
              ]}
            >
              {size}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  },
);

const PageButton = React.memo(
  ({
    page,
    isActive,
    onPress,
  }: {
    page: number;
    isActive: boolean;
    onPress: (page: number) => void;
  }) => {
    const { styles: paginationStyles, colors } = usePaginationStyles();
    return (
      <TouchableOpacity
        style={[
          paginationStyles.pageBtn,
          isActive && [
            paginationStyles.pageBtnActive,
            {
              backgroundColor: colors.brandBlue,
              borderColor: colors.brandBlue,
            },
          ],
        ]}
        onPress={() => onPress(page)}
      >
        <Text
          style={[
            paginationStyles.pageBtnText,
            isActive && paginationStyles.pageBtnTextActive,
          ]}
        >
          {page}
        </Text>
      </TouchableOpacity>
    );
  },
);

interface TablePaginationProps extends PaginationState, PaginationActions {
  pageSizeOptions?: number[];
  showTotal?: boolean;
  containerStyle?: ViewStyle;
}

const TablePagination = ({
  currentPage,
  pageSize,
  totalItems,
  totalPages,
  startIndex,
  endIndex,
  isFirstPage,
  isLastPage,
  goToPage,
  nextPage,
  prevPage,
  setPageSize,
  pageSizeOptions = [5, 10, 20],
  showTotal = true,
  containerStyle,
}: TablePaginationProps) => {
  const { styles: paginationStyles, colors } = usePaginationStyles();
  const pageWindows = useMemo(
    () => buildPageWindows(currentPage, totalPages),
    [currentPage, totalPages],
  );

  const handlePagePress = useCallback(
    (page: number) => goToPage(page),
    [goToPage],
  );

  if (totalItems === 0) return null;

  return (
    <View
      style={[
        paginationStyles.container,
        { backgroundColor: colors.card, borderColor: colors.border },
        containerStyle,
      ]}
    >
      {/* Dòng trên: Tổng dòng + PageSize selector */}
      <View style={paginationStyles.topRow}>
        {showTotal && (
          <Text weight="500" style={paginationStyles.totalText}>
            {startIndex + 1}–{endIndex}{" "}
            <Text weight="400" style={paginationStyles.totalTextMuted}>
              / {totalItems} dòng
            </Text>
          </Text>
        )}
        <PageSizeSelector
          pageSize={pageSize}
          pageSizeOptions={pageSizeOptions}
          setPageSize={setPageSize}
        />
      </View>

      {/* Dòng dưới: Prev · Số trang · Next */}
      {totalPages > 1 && (
        <View style={paginationStyles.bottomRow}>
          <TouchableOpacity
            style={[
              paginationStyles.navBtn,
              { borderColor: colors.border },
              isFirstPage && paginationStyles.navBtnDisabled,
            ]}
            onPress={prevPage}
            disabled={isFirstPage}
          >
            <Icon
              name="chevron-left"
              type="feather"
              size={16}
              color={isFirstPage ? colors.label : colors.text}
            />
          </TouchableOpacity>

          <View style={paginationStyles.pageNumbersRow}>
            {pageWindows.map((page, idx) =>
              page === null ? (
                <View key={`ellipsis-${idx}`} style={paginationStyles.ellipsis}>
                  <Text style={paginationStyles.ellipsisText}>···</Text>
                </View>
              ) : (
                <PageButton
                  key={page}
                  page={page}
                  isActive={page === currentPage}
                  onPress={handlePagePress}
                />
              ),
            )}
          </View>

          <TouchableOpacity
            style={[
              paginationStyles.navBtn,
              { borderColor: colors.border },
              isLastPage && paginationStyles.navBtnDisabled,
            ]}
            onPress={nextPage}
            disabled={isLastPage}
          >
            <Icon
              name="chevron-right"
              type="feather"
              size={16}
              color={isLastPage ? colors.label : colors.text}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 3 — Table helpers (pure functions)
// ═══════════════════════════════════════════════════════════════════════════════

const createDefaultLayout = (rowCount: number): LayoutTable => ({
  headerHeight: DEFAULT_ROW_HEIGHT,
  rowHeights: Array(rowCount).fill(DEFAULT_ROW_HEIGHT),
});

const computeColumnWidth = (
  columnIndex: number,
  totalColumns: number,
  layoutWidth: number,
  columnFlexValues?: number[],
  columnWidths?: (number | "auto")[],
): number => {
  if (columnFlexValues?.[columnIndex] != null) {
    const totalFlex = columnFlexValues.reduce((acc, cur) => acc + cur, 0);
    if (totalFlex > 0) {
      return (layoutWidth / totalFlex) * columnFlexValues[columnIndex];
    }
  }
  const specifiedWidth = columnWidths?.[columnIndex];
  if (specifiedWidth != null && specifiedWidth !== "auto") {
    return Number(specifiedWidth);
  }
  return totalColumns > 0 ? layoutWidth / totalColumns : 0;
};

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 4 — Sub-components (ButtonFilterTable, EyeDetailRow)
// ═══════════════════════════════════════════════════════════════════════════════

export const ButtonFilterTable = ({
  onPress,
  isFiltered,
}: {
  onPress: () => void;
  isFiltered?: boolean;
}) => {
  const { styles: tableStyles, colors } = useTableStyles();
  return (
    <TouchableOpacity style={tableStyles.filterButton} onPress={onPress}>
      <Icon name="sliders" size={20} type="feather" color={colors.text} />
      {isFiltered && (
        <View
          style={[tableStyles.filterDot, { backgroundColor: colors.accentRed }]}
        />
      )}
    </TouchableOpacity>
  );
};

export const EyeDetailRow = ({
  iconName = "eye",
  onPress,
}: {
  iconName?: string;
  onPress: () => void;
}) => {
  const { styles: tableStyles, colors } = useTableStyles();
  return (
    <TouchableOpacity style={tableStyles.eyeButton} onPress={onPress}>
      <Icon name={iconName} size={20} type="feather" color={colors.text} />
    </TouchableOpacity>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 5 — Row components
// ═══════════════════════════════════════════════════════════════════════════════

interface RowTableItemProps {
  rowType: RowType;
  rowIndex: number;
  children: React.ReactNode;
  rowStyle?: ViewStyle;
  onRowPress?: (rowIndex: number) => void;
  onRowDoublePress?: (rowIndex: number) => void;
  onLayout: (rowType: RowType, rowIndex: number, height: number) => void;
  isLeftMost?: boolean;
  isRightMost?: boolean;
}

/** Tạo animation chỉ khi row thực sự pressable → tránh useSharedValue dư thừa */
const PressableRow = React.memo(
  ({
    rowIndex,
    children,
    rowStyle,
    onRowPress,
    onRowDoublePress,
    onLayout,
    isHeader,
    isLeftMost,
    isRightMost,
  }: Omit<RowTableItemProps, "rowType" | "onLayout"> & {
    isHeader: boolean;
    onLayout: (e: any) => void;
  }) => {
    const { styles: tableStyles, colors } = useTableStyles();
    const scaleValue = useSharedValue(1);
    const flashOpacity = useSharedValue(0);
    const lastTap = useRef<number>(0);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: withTiming(scaleValue.value, { duration: 150 }) }],
    }));

    const flashStyle = useAnimatedStyle(() => ({
      opacity: flashOpacity.value,
    }));

    const handlePress = useCallback(() => {
      const now = Date.now();
      const DOUBLE_PRESS_DELAY = 300;

      if (
        onRowDoublePress &&
        lastTap.current &&
        now - lastTap.current < DOUBLE_PRESS_DELAY
      ) {
        onRowDoublePress(rowIndex);
        flashOpacity.value = withSequence(
          withTiming(1, { duration: 50, easing: Easing.out(Easing.ease) }),
          withTiming(0, { duration: 500, easing: Easing.in(Easing.ease) }),
        );
        lastTap.current = 0;
      } else {
        onRowPress?.(rowIndex);
        lastTap.current = now;
      }
    }, [onRowDoublePress, onRowPress, rowIndex]);
    return (
      <Animated.View
        style={[
          tableStyles.rowContainer,
          { borderBottomColor: colors.border },
          isHeader && tableStyles.headerRowContainer,
          isHeader && { backgroundColor: colors.orangeHeader },
          isHeader &&
            isLeftMost && {
              borderLeftWidth: 0.8,
              borderTopLeftRadius: 10,
              borderLeftColor: colors.border,
            },
          isHeader &&
            isRightMost && {
              borderRightWidth: 0.8,
              borderTopRightRadius: 10,
              borderRightColor: colors.border,
            },
          isHeader && (isLeftMost || isRightMost) && { overflow: "hidden" },
          animatedStyle,
        ]}
      >
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            tableStyles.activeRowContainer,
            flashStyle,
          ]}
          pointerEvents="none"
        />
        <TouchableOpacity
          onPress={handlePress}
          onPressIn={() => {
            scaleValue.value = 0.98;
          }}
          onPressOut={() => {
            scaleValue.value = 1;
          }}
          style={[
            tableStyles.defaultRow,
            isHeader && { backgroundColor: "transparent" },
            { backgroundColor: isHeader ? "transparent" : colors.card },
            rowStyle,
          ]}
          onLayout={onLayout}
        >
          {children}
        </TouchableOpacity>
      </Animated.View>
    );
  },
);

const StaticRow = React.memo(
  ({
    children,
    rowStyle,
    onLayout,
    isHeader,
    isLeftMost,
    isRightMost,
  }: {
    children: React.ReactNode;
    rowStyle?: ViewStyle;
    isHeader: boolean;
    isLeftMost?: boolean;
    isRightMost?: boolean;
    onLayout: (e: any) => void;
  }) => {
    const { styles: tableStyles, colors } = useTableStyles();
    return (
      <View
        style={[
          tableStyles.rowContainer,
          { borderBottomColor: colors.border },
          isHeader && tableStyles.headerRowContainer,
          isHeader && { backgroundColor: colors.orangeHeader },
          isHeader &&
            isLeftMost && {
              borderLeftWidth: 0.8,
              borderTopLeftRadius: 10,
              borderLeftColor: colors.border,
            },
          isHeader &&
            isRightMost && {
              borderRightWidth: 0.8,
              borderTopRightRadius: 10,
              borderRightColor: colors.border,
            },
          isHeader && (isLeftMost || isRightMost) && { overflow: "hidden" },
        ]}
      >
        <View
          style={[
            tableStyles.defaultRow,
            isHeader && { backgroundColor: "transparent" },
            { backgroundColor: isHeader ? "transparent" : colors.card },
            rowStyle,
          ]}
          onLayout={onLayout}
        >
          {children}
        </View>
      </View>
    );
  },
);

const RowTableItem = React.memo(
  ({
    rowType,
    rowIndex,
    children,
    rowStyle,
    onRowPress,
    onRowDoublePress,
    onLayout,
    isLeftMost,
    isRightMost,
  }: RowTableItemProps) => {
    const isHeader = rowType === "Header";
    const handleLayout = useCallback(
      (e: any) => onLayout(rowType, rowIndex, e.nativeEvent.layout.height),
      [rowType, rowIndex, onLayout],
    );

    if (onRowPress || onRowDoublePress) {
      return (
        <PressableRow
          rowIndex={rowIndex}
          rowStyle={rowStyle}
          onRowPress={onRowPress}
          onRowDoublePress={onRowDoublePress}
          onLayout={handleLayout}
          isHeader={isHeader}
          isLeftMost={isLeftMost}
          isRightMost={isRightMost}
        >
          {children}
        </PressableRow>
      );
    }

    return (
      <StaticRow
        rowStyle={rowStyle}
        onLayout={handleLayout}
        isHeader={isHeader}
        isLeftMost={isLeftMost}
        isRightMost={isRightMost}
      >
        {children}
      </StaticRow>
    );
  },
);

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 6 — CellItem
// ═══════════════════════════════════════════════════════════════════════════════

interface CellItemProps {
  rowType: RowType;
  rowIndex: number;
  columnIndex: number;
  column: ColumnTable;
  customCellStyle?: ViewStyle;
  fixedHeight?: number;
  columnStyle: ViewStyle;
  textStyle: TextStyle;
  isRendered: boolean;
}

const CellItem = React.memo(
  ({
    rowType,
    column,
    customCellStyle,
    fixedHeight,
    columnStyle,
    textStyle,
    isRendered,
  }: CellItemProps) => {
    const containerStyle: ViewStyle = {
      ...columnStyle,
      ...(fixedHeight != null
        ? { [isRendered ? "height" : "minHeight"]: fixedHeight }
        : {}),
      ...customCellStyle,
    };

    const renderContent = () => {
      if (column === null || column === undefined) return null;

      if (typeof column === "string" || typeof column === "number") {
        const isHeader = rowType === "Header";
        return (
          <Text style={textStyle} weight={isHeader ? "600" : "400"}>
            {column}
          </Text>
        );
      }

      if (
        typeof column === "object" &&
        !React.isValidElement(column) &&
        "text" in (column as object)
      ) {
        const col = column as { text: string; style?: TextStyle };
        const isHeader = rowType === "Header";
        return (
          <Text
            style={[textStyle, col.style]}
            weight={isHeader ? "600" : "400"}
          >
            {col.text}
          </Text>
        );
      }

      if (React.isValidElement(column)) return column;

      return null;
    };

    return <View style={containerStyle}>{renderContent()}</View>;
  },
);

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 7 — Table (main component)
// ═══════════════════════════════════════════════════════════════════════════════

const Table = ({
  columns,
  headerRowStyle,
  headerTextStyle,
  headerColumnAlign,
  rows = [],
  containerStyle,
  cellTextStyle,
  horizontalScroll,
  columnWidths,
  columnFlexValues,
  columnAlignments,
  columnTextAlignments,
  stickyColumn,
  onRowPress,
  onRowDoublePress,
  pagination,
}: TableCustomProps) => {
  const { styles: tableStyles, colors } = useTableStyles();
  const paginationConfig = useMemo(() => {
    if (!pagination) return DEFAULT_PAGINATION;
    return { ...DEFAULT_PAGINATION, ...pagination };
  }, [pagination]);

  // ─── Pagination ─────────────────────────────────────────────────────────────

  const paginationState = usePagination(rows.length, {
    defaultPageSize: paginationConfig.defaultPageSize,
    onPageChange: paginationConfig.onPageChange,
  });

  /**
   * Nếu pagination bật → slice rows theo trang.
   * Nếu không → dùng toàn bộ rows (backward-compatible).
   */
  const visibleRows = paginationConfig.enabled
    ? rows.slice(paginationState.startIndex, paginationState.endIndex)
    : rows;

  // ─── Layout tracking ─────────────────────────────────────────────────────────

  const [layoutWidth, setLayoutWidth] = useState(0);
  const [layout, setLayout] = useState<LayoutTable>(() =>
    createDefaultLayout(visibleRows.length),
  );
  const layoutRef = useRef<LayoutTable>(
    createDefaultLayout(visibleRows.length),
  );
  const isRendered = useRef(false);
  const layoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Reset layout mỗi khi visibleRows thay đổi (đổi trang hoặc đổi data).
   * Đảm bảo chiều cao được đo lại chính xác cho mỗi trang.
   */
  useEffect(() => {
    isRendered.current = false;
    const freshLayout = createDefaultLayout(visibleRows.length);
    layoutRef.current = freshLayout;
    setLayout(freshLayout);
  }, [visibleRows.length, paginationState.currentPage]);

  useEffect(() => {
    return () => {
      if (layoutTimerRef.current) clearTimeout(layoutTimerRef.current);
    };
  }, []);

  const handleLayout = useCallback(
    (rowType: RowType, rowIndex: number, height: number) => {
      if (isRendered.current || layoutWidth === 0) return;

      if (rowType === "Header") {
        if (height > layoutRef.current.headerHeight) {
          layoutRef.current.headerHeight = height;
        }
      } else {
        const current =
          layoutRef.current.rowHeights[rowIndex] ?? DEFAULT_ROW_HEIGHT;
        if (height > current) layoutRef.current.rowHeights[rowIndex] = height;
      }

      if (rowIndex === visibleRows.length - 1) {
        if (layoutTimerRef.current) clearTimeout(layoutTimerRef.current);
        layoutTimerRef.current = setTimeout(() => {
          isRendered.current = true;
          setLayout({ ...layoutRef.current });
        }, 300);
      }
    },
    [visibleRows.length],
  );

  const onContainerLayout = useCallback((e: any) => {
    const width = e.nativeEvent?.layout?.width;
    if (width) setLayoutWidth(width);
  }, []);

  // ─── Custom Scrollbar Logic ──────────────────────────────────────────────────

  const scrollX = useSharedValue(0);
  const contentWidthShared = useSharedValue(0);
  const scrollViewWidthShared = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const onContentSizeChange = useCallback((w: number) => {
    contentWidthShared.value = w;
  }, []);

  const onScrollViewLayout = useCallback((e: LayoutChangeEvent) => {
    scrollViewWidthShared.value = e.nativeEvent.layout.width;
  }, []);

  const thumbStyle = useAnimatedStyle(() => {
    const sw = scrollViewWidthShared.value;
    const cw = contentWidthShared.value;

    if (cw <= sw || sw === 0) {
      return { width: 0, opacity: 0 };
    }

    const ratio = sw / cw;
    const thumbWidth = sw * ratio;
    const translateX = scrollX.value * ratio;

    return {
      width: thumbWidth,
      transform: [{ translateX }],
      opacity: 1,
    };
  });

  // ─── Style builders ──────────────────────────────────────────────────────────

  const buildColumnStyle = useCallback(
    (rowType: RowType, columnIndex: number): ViewStyle => {
      const base: ViewStyle =
        rowType === "Header"
          ? { ...tableStyles.defaultHeaderStyle }
          : { ...tableStyles.defaultContentStyle };

      const alignment =
        rowType === "Header"
          ? (headerColumnAlign?.[columnIndex] ??
            columnAlignments?.[columnIndex])
          : columnAlignments?.[columnIndex];

      const withAlign: ViewStyle = alignment
        ? { ...base, ...AlignItem[alignment] }
        : base;

      const width = computeColumnWidth(
        columnIndex,
        columns.length,
        layoutWidth,
        columnFlexValues,
        columnWidths,
      );

      return {
        ...withAlign,
        width: Number.isFinite(width) ? width : 0,
        borderRightWidth: 0.8,
        borderRightColor: colors.border,
      };
    },
    [
      layoutWidth,
      columns.length,
      columnAlignments,
      headerColumnAlign,
      columnFlexValues,
      columnWidths,
    ],
  );

  const buildTextStyle = useCallback(
    (rowType: RowType, columnIndex: number): TextStyle => {
      const base: TextStyle =
        rowType === "Header"
          ? { ...tableStyles.defaultHeaderText, ...headerTextStyle }
          : { ...tableStyles.defaultContentText, ...cellTextStyle };

      const align = columnTextAlignments?.[columnIndex];
      return align
        ? { ...base, ...AlignText[align] }
        : { ...base, textAlign: "center" };
    },
    [headerTextStyle, cellTextStyle, columnTextAlignments, tableStyles],
  );

  // ─── Render helpers ──────────────────────────────────────────────────────────

  const getFixedHeight = useCallback(
    (rowType: RowType, rowIndex: number): number | undefined => {
      if (rowType === "Header") return layout.headerHeight;
      return layout.rowHeights[rowIndex];
    },
    [layout],
  );

  const renderCells = useCallback(
    (
      rowType: RowType,
      rowIndex: number,
      cells: ColumnTable[],
      startIndex: number,
      cellStyle?: ViewStyle,
    ) =>
      cells.map((cell, idx) => {
        const colIndex = startIndex + idx;
        return (
          <CellItem
            key={`${rowType}-Cell-${rowIndex}-${colIndex}`}
            rowType={rowType}
            rowIndex={rowIndex}
            columnIndex={colIndex}
            column={cell}
            customCellStyle={cellStyle}
            fixedHeight={getFixedHeight(rowType, rowIndex)}
            columnStyle={buildColumnStyle(rowType, colIndex)}
            textStyle={buildTextStyle(rowType, colIndex)}
            isRendered={isRendered.current}
          />
        );
      }),
    [getFixedHeight, buildColumnStyle, buildTextStyle],
  );

  // ─── Sticky column slicing ───────────────────────────────────────────────────

  const getSlicedColumns = useCallback(
    (isFixed: boolean): { cells: ColumnTable[]; startIndex: number } => {
      if (isFixed) {
        const idx = stickyColumn === "left" ? 0 : columns.length - 1;
        return { cells: [columns[idx]], startIndex: idx };
      }
      if (stickyColumn === "left")
        return { cells: columns.slice(1), startIndex: 1 };
      if (stickyColumn === "right")
        return { cells: columns.slice(0, columns.length - 1), startIndex: 0 };
      return { cells: columns, startIndex: 0 };
    },
    [columns, stickyColumn],
  );

  const getSlicedRowCells = useCallback(
    (
      row: RowTable,
      isFixed: boolean,
    ): { cells: ColumnTable[]; startIndex: number } => {
      if (isFixed) {
        const idx = stickyColumn === "left" ? 0 : row.cells.length - 1;
        return { cells: [row.cells[idx]], startIndex: idx };
      }
      if (stickyColumn === "left")
        return { cells: row.cells.slice(1), startIndex: 1 };
      if (stickyColumn === "right")
        return {
          cells: row.cells.slice(0, row.cells.length - 1),
          startIndex: 0,
        };
      return { cells: row.cells, startIndex: 0 };
    },
    [stickyColumn],
  );

  // ─── Header ──────────────────────────────────────────────────────────────────

  const HeaderTable = useCallback(
    ({
      isFixed,
      isLeftMost,
      isRightMost,
    }: {
      isFixed: boolean;
      isLeftMost?: boolean;
      isRightMost?: boolean;
    }) => {
      const { cells, startIndex } = getSlicedColumns(isFixed);
      return (
        <RowTableItem
          rowType="Header"
          rowIndex={HEADER_ROW_INDEX}
          rowStyle={headerRowStyle}
          onRowPress={undefined}
          onLayout={handleLayout}
          isLeftMost={isLeftMost}
          isRightMost={isRightMost}
        >
          {renderCells("Header", 0, cells, startIndex)}
        </RowTableItem>
      );
    },
    [getSlicedColumns, headerRowStyle, handleLayout, renderCells],
  );

  // ─── Content ─────────────────────────────────────────────────────────────────

  const ContentTable = useCallback(
    ({
      isFixed,
      isLeftMost,
      isRightMost,
    }: {
      isFixed: boolean;
      isLeftMost?: boolean;
      isRightMost?: boolean;
    }) => (
      <View>
        {visibleRows.map((row, rowIndex) => {
          const { cells, startIndex } = getSlicedRowCells(row, isFixed);
          return (
            <RowTableItem
              key={`Content-${isFixed ? "Fixed" : "Dynamic"}-${rowIndex}`}
              rowType="Content"
              rowIndex={rowIndex}
              rowStyle={row?.rowStyle}
              onRowPress={onRowPress}
              onRowDoublePress={onRowDoublePress}
              onLayout={handleLayout}
              isLeftMost={isLeftMost}
              isRightMost={isRightMost}
            >
              {renderCells(
                "Content",
                rowIndex,
                cells,
                startIndex,
                row?.cellStyle,
              )}
            </RowTableItem>
          );
        })}
      </View>
    ),
    [
      visibleRows,
      getSlicedRowCells,
      onRowPress,
      onRowDoublePress,
      handleLayout,
      renderCells,
    ],
  );

  // ─── Layout section ───────────────────────────────────────────────────────────

  const LayoutSection = useCallback(
    ({
      isFixed,
      isLeftMost,
      isRightMost,
    }: {
      isFixed: boolean;
      isLeftMost?: boolean;
      isRightMost?: boolean;
    }) => (
      <View
        style={[
          isFixed && tableStyles.fixedSection,
          isFixed && { backgroundColor: colors.card },
        ]}
      >
        <HeaderTable
          isFixed={isFixed}
          isLeftMost={isLeftMost}
          isRightMost={isRightMost}
        />
        {visibleRows.length > 0 && (
          <ContentTable
            isFixed={isFixed}
            isLeftMost={isLeftMost}
            isRightMost={isRightMost}
          />
        )}

        {isFixed && stickyColumn === "left" && (
          <LinearGradient
            colors={[colors.blackAlpha8 as string, "transparent"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={tableStyles.stickyLeftShadowGradient}
          />
        )}
        {isFixed && stickyColumn === "right" && (
          <LinearGradient
            colors={["transparent", colors.blackAlpha8 as string]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={tableStyles.stickyRightShadowGradient}
          />
        )}
      </View>
    ),
    [HeaderTable, ContentTable, visibleRows.length, stickyColumn],
  );

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <View
      style={[
        tableStyles.tableContainer,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
        containerStyle,
      ]}
      onLayout={onContainerLayout}
    >
      <View style={tableStyles.layout}>
        {stickyColumn === "left" && (
          <LayoutSection isFixed isLeftMost key="sticky-left" />
        )}

        <View style={{ flex: 1 }} onLayout={onScrollViewLayout}>
          <Animated.ScrollView
            horizontal={horizontalScroll}
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
            onScroll={scrollHandler}
            onContentSizeChange={onContentSizeChange}
          >
            <LayoutSection
              isFixed={false}
              isLeftMost={!stickyColumn || stickyColumn === "right"}
              isRightMost={!stickyColumn || stickyColumn === "left"}
              key="scrollable"
            />
          </Animated.ScrollView>

          {horizontalScroll && rows.length > 0 && (
            <View style={tableStyles.scrollTrack}>
              <Animated.View style={[tableStyles.scrollThumb, thumbStyle]} />
            </View>
          )}
        </View>

        {stickyColumn === "right" && (
          <LayoutSection isFixed isRightMost key="sticky-right" />
        )}
      </View>

      {rows.length === 0 && (
        <View style={tableStyles.noDataContainer}>
          <Text style={tableStyles.noDataText}>Không có dữ liệu</Text>
        </View>
      )}

      {paginationConfig.enabled && rows.length > 0 && (
        <TablePagination
          {...paginationState}
          pageSizeOptions={paginationConfig.pageSizeOptions}
          showTotal={paginationConfig.showTotal}
        />
      )}
      {horizontalScroll && rows.length > 0 && (
        <Text style={[tableStyles.hintText, { color: colors.neutral700Alt }]}>
          * Chạm 2 lần để xem chi tiết và vuốt sang trái để xem thêm
        </Text>
      )}
    </View>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 8 — Styles
// ═══════════════════════════════════════════════════════════════════════════════

// tableStyles and paginationStyles are now provided via useTableStyles() and usePaginationStyles() hooks above.

// ─── Static Methods ───────────────────────────────────────────────────────────

Table.EyeDetailRow = EyeDetailRow;
Table.ButtonFilterTable = ButtonFilterTable;

export default Table;
