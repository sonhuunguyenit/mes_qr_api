import { Icon } from "@rneui/base";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  ScrollView,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Text } from "../Text";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { colors } from "~/constants/colors";
import { sizes } from "~/constants/sizes";

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
  /** Không truyền → không hiện pagination (backward-compatible) */
  pagination?: PaginationConfig;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const HEADER_ROW_INDEX = -1;
const DEFAULT_ROW_HEIGHT = 60;
const MAX_VISIBLE_PAGES = 5;

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
  }) => (
    <View style={paginationStyles.pageSizeRow}>
      {pageSizeOptions.map((size) => (
        <TouchableOpacity
          key={size}
          style={[
            paginationStyles.pageSizeBtn,
            pageSize === size && paginationStyles.pageSizeBtnActive,
          ]}
          onPress={() => setPageSize(size)}
          activeOpacity={0.7}
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
  ),
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
  }) => (
    <TouchableOpacity
      style={[
        paginationStyles.pageBtn,
        isActive && paginationStyles.pageBtnActive,
      ]}
      onPress={() => onPress(page)}
      activeOpacity={0.7}
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
  ),
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
    <View style={[paginationStyles.container, containerStyle]}>
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
              isFirstPage && paginationStyles.navBtnDisabled,
            ]}
            onPress={prevPage}
            disabled={isFirstPage}
            activeOpacity={0.7}
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
              isLastPage && paginationStyles.navBtnDisabled,
            ]}
            onPress={nextPage}
            disabled={isLastPage}
            activeOpacity={0.7}
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
}) => (
  <TouchableOpacity style={tableStyles.filterButton} onPress={onPress}>
    <Icon name="sliders" size={20} type="feather" color={colors.text} />
    {isFiltered && <View style={tableStyles.filterDot} />}
  </TouchableOpacity>
);

export const EyeDetailRow = ({
  iconName = "eye",
  onPress,
}: {
  iconName?: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={tableStyles.eyeButton} onPress={onPress}>
    <Icon name={iconName} size={20} type="feather" color={colors.text} />
  </TouchableOpacity>
);

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 5 — Row components
// ═══════════════════════════════════════════════════════════════════════════════

interface RowTableItemProps {
  rowType: RowType;
  rowIndex: number;
  children: React.ReactNode;
  rowStyle?: ViewStyle;
  onRowPress?: (rowIndex: number) => void;
  onLayout: (rowType: RowType, rowIndex: number, height: number) => void;
}

/** Tạo animation chỉ khi row thực sự pressable → tránh useSharedValue dư thừa */
const PressableRow = React.memo(
  ({
    rowIndex,
    children,
    rowStyle,
    onRowPress,
    onLayout,
    isHeader,
  }: Omit<RowTableItemProps, "rowType" | "onLayout"> & {
    isHeader: boolean;
    onLayout: (e: any) => void;
  }) => {
    const scaleValue = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: withTiming(scaleValue.value, { duration: 150 }) }],
    }));

    return (
      <Animated.View
        style={[
          tableStyles.rowContainer,
          isHeader && tableStyles.headerRowContainer,
          animatedStyle,
        ]}
      >
        <TouchableOpacity
          onPress={() => onRowPress!(rowIndex)}
          onPressIn={() => {
            scaleValue.value = 0.98;
          }}
          onPressOut={() => {
            scaleValue.value = 1;
          }}
          style={[tableStyles.defaultRow, rowStyle]}
          onLayout={onLayout}
          activeOpacity={0.9}
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
  }: {
    children: React.ReactNode;
    rowStyle?: ViewStyle;
    isHeader: boolean;
    onLayout: (e: any) => void;
  }) => (
    <View
      style={[
        tableStyles.rowContainer,
        isHeader && tableStyles.headerRowContainer,
      ]}
    >
      <View style={[tableStyles.defaultRow, rowStyle]} onLayout={onLayout}>
        {children}
      </View>
    </View>
  ),
);

const RowTableItem = React.memo(
  ({
    rowType,
    rowIndex,
    children,
    rowStyle,
    onRowPress,
    onLayout,
  }: RowTableItemProps) => {
    const isHeader = rowType === "Header";

    const handleLayout = useCallback(
      (e: any) => onLayout(rowType, rowIndex, e.nativeEvent.layout.height),
      [rowType, rowIndex, onLayout],
    );

    if (onRowPress) {
      return (
        <PressableRow
          rowIndex={rowIndex}
          rowStyle={rowStyle}
          onRowPress={onRowPress}
          onLayout={handleLayout}
          isHeader={isHeader}
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
}

const CellItem = React.memo(
  ({
    rowType,
    column,
    customCellStyle,
    fixedHeight,
    columnStyle,
    textStyle,
  }: CellItemProps) => {
    const containerStyle: ViewStyle = {
      ...columnStyle,
      ...(fixedHeight != null ? { height: fixedHeight } : {}),
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
  pagination,
}: TableCustomProps) => {
  // ─── Pagination ─────────────────────────────────────────────────────────────

  const paginationState = usePagination(rows.length, {
    defaultPageSize: pagination?.defaultPageSize ?? 5,
    onPageChange: pagination?.onPageChange,
  });

  /**
   * Nếu pagination bật → slice rows theo trang.
   * Nếu không → dùng toàn bộ rows (backward-compatible).
   */
  const visibleRows = pagination?.enabled
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
      if (isRendered.current) return;

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

      return { ...withAlign, width: Number.isFinite(width) ? width : 0 };
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
    [headerTextStyle, cellTextStyle, columnTextAlignments],
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
    ({ isFixed }: { isFixed: boolean }) => {
      const { cells, startIndex } = getSlicedColumns(isFixed);
      return (
        <RowTableItem
          rowType="Header"
          rowIndex={HEADER_ROW_INDEX}
          rowStyle={headerRowStyle}
          onRowPress={undefined}
          onLayout={handleLayout}
        >
          {renderCells("Header", 0, cells, startIndex)}
        </RowTableItem>
      );
    },
    [getSlicedColumns, headerRowStyle, handleLayout, renderCells],
  );

  // ─── Content ─────────────────────────────────────────────────────────────────

  const ContentTable = useCallback(
    ({ isFixed }: { isFixed: boolean }) => (
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
              onLayout={handleLayout}
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
    [visibleRows, getSlicedRowCells, onRowPress, handleLayout, renderCells],
  );

  // ─── Layout section ───────────────────────────────────────────────────────────

  const LayoutSection = useCallback(
    ({ isFixed }: { isFixed: boolean }) => (
      <View>
        <HeaderTable isFixed={isFixed} />
        {visibleRows.length > 0 && <ContentTable isFixed={isFixed} />}
      </View>
    ),
    [HeaderTable, ContentTable, visibleRows.length],
  );

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <View
      style={[tableStyles.tableContainer, containerStyle]}
      onLayout={onContainerLayout}
    >
      <View style={tableStyles.layout}>
        {stickyColumn === "left" && <LayoutSection isFixed key="sticky-left" />}

        <View style={{ flex: 1 }} onLayout={onScrollViewLayout}>
          <Animated.ScrollView
            horizontal={horizontalScroll}
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
            onScroll={scrollHandler}
            onContentSizeChange={onContentSizeChange}
          >
            <LayoutSection isFixed={false} key="scrollable" />
          </Animated.ScrollView>

          {horizontalScroll && rows.length > 0 && (
            <View style={tableStyles.scrollTrack}>
              <Animated.View style={[tableStyles.scrollThumb, thumbStyle]} />
            </View>
          )}
        </View>

        {stickyColumn === "right" && (
          <LayoutSection isFixed key="sticky-right" />
        )}
      </View>

      {rows.length === 0 && (
        <View style={tableStyles.noDataContainer}>
          <Text style={tableStyles.noDataText}>Không có dữ liệu</Text>
        </View>
      )}
      {pagination?.enabled && rows.length > 0 && (
        <TablePagination
          {...paginationState}
          pageSizeOptions={pagination.pageSizeOptions}
          showTotal={pagination.showTotal ?? true}
        />
      )}

      {horizontalScroll && rows.length > 0 && (
        <Text style={tableStyles.hintText}>* Kéo sang trái để xem thêm</Text>
      )}
    </View>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 8 — Styles
// ═══════════════════════════════════════════════════════════════════════════════

const tableStyles = StyleSheet.create({
  tableContainer: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    overflow: "hidden",
  },
  layout: {
    flexDirection: "row",
  },
  rowContainer: {
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  headerRowContainer: {
    backgroundColor: colors.lgrayBg,
  },
  defaultRow: {
    flexDirection: "row",
    backgroundColor: colors.white,
  },
  defaultHeaderStyle: {
    height: DEFAULT_ROW_HEIGHT,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  defaultContentStyle: {
    height: DEFAULT_ROW_HEIGHT,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  defaultHeaderText: {
    fontSize: sizes.fontSize.base,
    fontWeight: "600",
    color: colors.label,
  },
  defaultContentText: {
    fontSize: sizes.fontSize.base,
    fontWeight: "400",
    color: colors.text,
  },
  noDataContainer: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 8,
    marginVertical: 4,
  },
  noDataText: {
    fontSize: sizes.fontSize.base,
    fontWeight: "500",
    color: colors.label,
  },
  hintText: {
    fontSize: sizes.fontSize.xs, // 10px or keep small
    fontWeight: "400",
    color: "#64748B",
    alignSelf: "flex-end",
    marginVertical: 8,
    marginRight: 10,
  },
  filterButton: {
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.gray200,
    borderRadius: 5,
  },
  filterDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#F80D53",
  },
  eyeButton: {
    height: 60,
    width: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollTrack: {
    height: 6,
    backgroundColor: colors.gray100,
    borderRadius: 3,
    marginHorizontal: 8,
    marginBottom: 4,
    overflow: "hidden",
  },
  scrollThumb: {
    height: "100%",
    backgroundColor: colors.gray400,
    borderRadius: 3,
  },
});

const paginationStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    gap: 8,
    borderTopWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
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
    color: colors.text,
  },
  totalTextMuted: {
    fontSize: sizes.fontSize.base,
    fontWeight: "400",
    color: colors.label,
  },
  pageSizeRow: {
    flexDirection: "row",
    gap: 4,
  },
  pageSizeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  pageSizeBtnActive: {
    borderColor: colors.primary ?? "#3B82F6",
    backgroundColor: colors.primary ?? "#3B82F6",
  },
  pageSizeBtnText: {
    fontSize: sizes.fontSize.sm, // sm is now 13
    fontWeight: "500",
    color: colors.label,
  },
  pageSizeBtnTextActive: {
    color: colors.white,
  },
  navBtn: {
    width: 35,
    height: 35,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  navBtnDisabled: {
    opacity: 0.4,
  },
  pageNumbersRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  pageBtn: {
    minWidth: 35,
    height: 35,
    paddingHorizontal: 6,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  pageBtnActive: {
    borderColor: colors.primary ?? "#3B82F6",
    backgroundColor: colors.primary ?? "#3B82F6",
  },
  pageBtnText: {
    fontSize: sizes.fontSize.base,
    fontWeight: "500",
    color: colors.text,
  },
  pageBtnTextActive: {
    color: colors.white,
  },
  ellipsis: {
    width: 28,
    height: 32,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 4,
  },
  ellipsisText: {
    fontSize: sizes.fontSize.base,
    color: colors.label,
    letterSpacing: 1,
  },
});

// ─── Static Methods ───────────────────────────────────────────────────────────

Table.EyeDetailRow = EyeDetailRow;
Table.ButtonFilterTable = ButtonFilterTable;

export default Table;
