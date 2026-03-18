import { PADDING_HORIZONTAL } from "~/constants";
import { colors } from "~/constants/colors";

const globalStyle = {
  container: {
    flex: 1,
    paddingHorizontal: PADDING_HORIZONTAL,
  },
  scroll: {
    flex: 1,
    width: "100%",
  },
  flat: {
    flex: 1,
    width: "100%",
  },
  card: {
    flex: 1,
    width: "100%",
  },
  collapse: {},
  spacer: 20,
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    justifyContent: "center",
    paddingHorizontal: 11,
    backgroundColor: "#fff",
  },
  legendBar: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingTop: 16,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingHorizontal: 10,
    gap: 10,
  },
  legendItem: {
    width: "33.33%",
    marginBottom: 10,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  rowInfo: {
    height: 60,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#F1F5F9",
    gap: 10,
  },
} as const;

export default globalStyle;
