import { PADDING_HORIZONTAL } from "~/constants";

const globalStyle = {
  container: {
    flex: 1,
    paddingHorizontal: PADDING_HORIZONTAL,
  },
  scroll: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    marginTop: 5,
    paddingHorizontal: 8,
  },
  scrollContainerDetail: {
    paddingBottom: 50,
  },
  flatlist: {
    flex: 1,
    width: "100%",
  },
  flatlistContent: {
    marginTop: 5,
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  collapseContainer: {
    paddingHorizontal: 5,
    paddingBottom: 0,
  },
  item: {
    marginBottom: 8,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingIndicator: {
    transform: [{ scale: 0.85 }],
  },
} as const;

export default globalStyle;
