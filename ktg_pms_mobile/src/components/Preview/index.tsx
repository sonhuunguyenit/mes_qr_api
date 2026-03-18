import { Icon } from "@rneui/base";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Block,
  Button,
  Card,
  Column,
  DatePicker,
  Divider,
  Empty,
  Header,
  InfoRow,
  Input,
  Linear,
  Row,
  SelectPicker,
  Spacer,
  Text,
  SearchBox,
  Skeleton,
  Tabs,
  Tag,
  Checkbox,
  Radio,
  RadioGroup,
  Switch as SwitchCustom,
  Slider,
} from "~/common";
import { useTheme } from "~/hooks/useTheme";

const Preview = () => {
  const { colors, spacing, appTheme, setAppTheme, isDark } = useTheme();

  // Separate states for different tab groups to show independence
  const [activeTabUnderline, setActiveTabUnderline] = useState(0);
  const [activeTabPill, setActiveTabPill] = useState(0);
  const [date, setDate] = useState(new Date());

  // States for new components
  const [checked, setChecked] = useState(true);
  const [radioValue, setRadioValue] = useState("apple");
  const [isSwitchOn, setIsSwitchOn] = useState(true);
  const [sliderValue, setSliderValue] = useState(45);

  const toggleTheme = () => {
    setAppTheme(isDark ? "light" : "dark");
  };

  const Section = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <Column align="stretch" margin={[0, 0, 24, 0]}>
      <Text title color={colors.primary} style={{ marginBottom: spacing.xs }}>
        {title}
      </Text>
      <Divider bottom={spacing.md} />
      {children}
    </Column>
  );

  return (
    <Column full background={colors.background}>
      <Header
        title="UI Kit Preview"
        rightSide={
          <TouchableOpacity onPress={toggleTheme}>
            <Icon
              name={isDark ? "sunny" : "moon"}
              type="ionicon"
              size={24}
              color={colors.title}
            />
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Card style={{ marginBottom: 24 }}>
          <Row justify="space-between">
            <Column align="flex-start">
              <Text title>Theme Mode</Text>
              <Text label>Current: {appTheme.toUpperCase()}</Text>
            </Column>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </Row>
        </Card>

        <Section title="Typography (Text)">
          <Column gap={8} align="flex-start">
            <Text header>Header Text</Text>
            <Text title>Title Text</Text>
            <Text label>Label Text</Text>
            <Text value>Value Text</Text>
            <Text bold>Bold Text</Text>
            <Text type="success">Success Type Text</Text>
            <Text type="info">Info Type Text</Text>
            <Text type="warning">Warning Type Text</Text>
            <Text type="error">Error Type Text</Text>
            <Text type="disabled">Disabled Type Text</Text>
            <Text primary>Primary Colored Text</Text>
            <Text size={20}>Custom Size Text (20px)</Text>
          </Column>
        </Section>

        <Section title="Buttons">
          <Column gap={12} align="stretch">
            <Button title="Primary Button" />
            <Button
              title="Outline Button"
              type="outline"
              buttonStyle={{ backgroundColor: "transparent" }}
              titleStyle={{ color: colors.primary }}
            />
            <Button title="Clear Button" type="clear" />
            <Row gap={8}>
              <Button
                title="Full Width Button"
                full
                containerStyle={{ flex: 1 }}
              />
            </Row>
            <Button title="Loading..." loading />
            <Button title="Disabled" disabled />
          </Column>
        </Section>

        <Section title="Input & Selection">
          <Column gap={16} align="stretch">
            <Input label="Basic Input" placeholder="Type something..." />
            <SearchBox placeholder="Search for anything..." />
            <Row gap={12}>
              <Column full>
                <DatePicker
                  label="Date Picker"
                  value={date}
                  onChange={setDate}
                />
              </Column>
              <Column full>
                <SelectPicker
                  label="Select Picker"
                  placeholder="Choose..."
                  listSelection={[
                    { id: 1, name: "Option 1" },
                    { id: 2, name: "Option 2" },
                  ]}
                />
              </Column>
            </Row>

            <Divider top={12} bottom={12} />

            <Text label style={{ marginBottom: 10 }}>
              Checkbox & Radio
            </Text>
            <Checkbox
              label="Accept Terms & Conditions"
              description="By checking this, you agree to our policies"
              checked={checked}
              onPress={() => setChecked(!checked)}
            />

            <Spacer size={16} />

            <RadioGroup
              value={radioValue}
              onChange={setRadioValue}
              options={[
                {
                  value: "apple",
                  label: "Apple",
                  description: "Fresh and healthy",
                },
                {
                  value: "banana",
                  label: "Banana",
                  description: "Great for energy",
                },
              ]}
              direction="horizontal"
              gap={20}
            />

            <Divider top={12} bottom={12} />

            <Text label style={{ marginBottom: 10 }}>
              Form Controls (Switch & Slider)
            </Text>
            <SwitchCustom
              label="Push Notifications"
              description="Receive alerts for new messages"
              value={isSwitchOn}
              onValueChange={setIsSwitchOn}
            />

            <Spacer size={12} />

            <Slider
              label="Brightness Level"
              showValue
              unit="%"
              value={sliderValue}
              onValueChange={setSliderValue}
              minimumValue={0}
              maximumValue={100}
              step={1}
            />
          </Column>
        </Section>

        <Section title="Blocks & Layout">
          <Column gap={12} align="stretch">
            <Block
              title="Block Component"
              icon={{ name: "cube-outline", type: "material-community" }}
            >
              <Text>This is a standard Block with a title and icon.</Text>
            </Block>

            <Row gap={8}>
              <Column
                full
                background={colors.primary}
                border={{ radius: 8 }}
                height={60}
                center
              >
                <Text color="white" bold>
                  Column 1
                </Text>
              </Column>
              <Column
                full
                background={colors.secondary}
                border={{ radius: 8 }}
                height={60}
                center
              >
                <Text color="white" bold>
                  Column 2
                </Text>
              </Column>
            </Row>

            <InfoRow label="Label" value="Value Detail" />
            <Divider />
            <InfoRow
              label="Status"
              value="Active"
              valueColor={colors.success}
            />
          </Column>
        </Section>

        <Section title="Tabs (Switchable)">
          <Text label style={{ marginBottom: 8 }}>
            Underline Mode:
          </Text>
          <Tabs
            value={activeTabUnderline}
            onChange={setActiveTabUnderline}
            mode="underline"
          >
            <Tabs.Item label="Tab 1" />
            <Tabs.Item label="Tab 2" />
            <Tabs.Item label="Tab 3" iconName="cog" />
          </Tabs>

          <Tabs.View
            value={activeTabUnderline}
            onChange={setActiveTabUnderline}
          >
            <Tabs.Content>
              <Column center padding={20}>
                <Text>Content for Tab 1</Text>
              </Column>
            </Tabs.Content>
            <Tabs.Content>
              <Column center padding={20}>
                <Text>Content for Tab 2</Text>
              </Column>
            </Tabs.Content>
            <Tabs.Content>
              <Column center padding={20}>
                <Text>Content for Tab 3 (Settings)</Text>
              </Column>
            </Tabs.Content>
          </Tabs.View>

          <View style={{ height: 24 }} />

          <Text label style={{ marginBottom: 8 }}>
            Pill Mode:
          </Text>
          <Tabs value={activeTabPill} onChange={setActiveTabPill} mode="pill">
            <Tabs.Item label="Pill 1" />
            <Tabs.Item label="Pill 2" />
            <Tabs.Item label="Pill 3" />
          </Tabs>

          <View style={{ height: 24 }} />

          <Text label style={{ marginBottom: 8 }}>
            Scrollable Mode:
          </Text>
          <Tabs
            value={activeTabPill}
            onChange={setActiveTabPill}
            mode="underline"
            scrollable
          >
            <Tabs.Item label="Category 1" />
            <Tabs.Item label="Category 2" />
            <Tabs.Item label="Category 3" />
            <Tabs.Item label="Category 4" />
            <Tabs.Item label="Category 5" />
          </Tabs>
        </Section>

        <Section title="Tags & Status">
          <Row gap={10} wrap>
            <Tag icon="user" label="Role" value="Administrator" />
            <Tag
              icon="clock"
              label="Time"
              value="13:21"
              color={colors.primary}
            />
            <Tag
              icon="alert-circle"
              label="Priority"
              value="High"
              color={colors.error}
            />
          </Row>
          <Spacer size={12} />
          <Tag
            icon="map-pin"
            label="Location"
            value="Ho Chi Minh City, Vietnam"
            fullWidth
          />
        </Section>

        <Section title="Feedback & Indicators">
          <Column gap={16} align="stretch">
            <Skeleton style={{ height: 20, width: "100%" }} />
            <Skeleton style={{ height: 40, width: "80%" }} />
            <Row gap={12}>
              <Skeleton circle height={50} width={50} />
              <Column full gap={8} align="stretch">
                <Skeleton height={20} width="100%" />
                <Skeleton height={20} width="60%" />
              </Column>
            </Row>
            <Empty title="No Data Found" />
            <Linear
              colors={[colors.primary, colors.secondary]}
              style={{
                height: 50,
                borderRadius: 8,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text color="white" bold>
                Linear Gradient Block
              </Text>
            </Linear>
          </Column>
        </Section>

        <View style={{ height: 40 }} />
      </ScrollView>
    </Column>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
  },
});

export default Preview;
