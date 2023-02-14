import React from "react";
import { TabList, Tabs, Tab, TabPanels, TabPanel } from "@chakra-ui/react";

const FeatureTabs = (props) => {
  const tabs = props.features.map((feature) => {
    return <Tab>{feature.title}</Tab>;
  });

  const tabPanels = props.features.map((feature) => {
    return <TabPanel>{feature.component}</TabPanel>;
  });

  return (
    <Tabs align="center">
      <TabList>{tabs}</TabList>
      <TabPanels>{tabPanels}</TabPanels>
    </Tabs>
  );
};

export default FeatureTabs;
