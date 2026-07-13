import React from "react";
import { StyleSheet, View } from "react-native";
import { Skeleton } from "~/common";
import { useTheme } from "~/hooks/useTheme";

const ReservationMaintenanceDetailSkeleton = () => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {[1].map((i) => (
          <View
            key={i}
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                padding: 12,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: colors.border,
                minHeight: 80,
                justifyContent: "center",
              },
            ]}
          >
            <View style={{ gap: 12 }}>
              <Skeleton width={120} height={16} radius={4} />
              <Skeleton width={"90%"} height={20} radius={4} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  tabs: {
    paddingHorizontal: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
  },
  content: {
    marginTop: 5,
    paddingHorizontal: 5,
  },
  card: {
    marginBottom: 10,
  },
});

export default ReservationMaintenanceDetailSkeleton;
