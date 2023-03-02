import {
  AppShell,
  Burger,
  Header,
  MediaQuery,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useState } from "react";
import Nav from "./Nav";

const PageLayout = ({ children }: any) => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(true);

  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      navbar={
        <Nav opened={opened} hiddenBreakpoint="sm" setOpened={setOpened} />
      }
      header={
        <Header height={70} p="md">
          <div
            style={{ display: "flex", alignItems: "center", height: "100%" }}
          >
            <MediaQuery largerThan={"sm"} styles={{ display: "none" }}>
              <Burger
                opened={!opened}
                onClick={() => setOpened(!opened)}
                size="md"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>
            <Text>Inventory ONI App</Text>
          </div>
        </Header>
      }
    >
      {children}
    </AppShell>
  );
};

export default PageLayout;
