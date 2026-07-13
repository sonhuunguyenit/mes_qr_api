import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Row, Skeleton, Spacer } from "~/common";
import { useTheme } from "~/hooks/useTheme";

const NotificationSkeleton = () => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {Array.from({ length: 6 }).map((_, index) => (
        <Card
          key={index}
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.divider,
            },
          ]}
        >
          <Row align="center" style={styles.row}>
            {/* Unread indicator placeholder */}
            <View style={styles.indicatorContainer} />

            {/* Notification Circle placeholder */}
            <Skeleton circle width={42} height={42} />

            <Spacer size={12} horizontal />

            {/* Text details placeholders */}
            <View style={styles.textContainer}>
              <Row justify="space-between" align="center">
                <Skeleton width={80} height={14} radius={4} />
                <Skeleton width={80} height={12} radius={4} />
              </Row>

              <Spacer size={4} />
              <Skeleton width="90%" height={14} radius={4} />

              <Spacer size={4} />
              <Skeleton width="60%" height={12} radius={4} />
            </View>
          </Row>
        </Card>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  card: {
    paddingHorizontal: 8,
    paddingVertical: 10,
    marginVertical: 4,
    borderWidth: 1,
    borderRadius: 12,
    height: 82,
  },
  row: {
    paddingRight: 8,
  },
  indicatorContainer: {
    width: 12,
    marginTop: 5,
    alignSelf: "flex-start",
  },
  textContainer: {
    flex: 1,
  },
});

export default NotificationSkeleton;
