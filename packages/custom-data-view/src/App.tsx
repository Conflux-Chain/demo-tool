import "@mantine/core/styles.css";
import { useDisclosure } from "@mantine/hooks";
import {
  Anchor,
  Box,
  Button,
  Container,
  CopyButton,
  Flex,
  LoadingOverlay,
  MantineProvider,
  Skeleton,
  Table,
  Text,
} from "@mantine/core";
import "./App.css";
import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";

export interface TableData {
  key: string;
  value: string;
  color?: string;
  url?: string;
  timestamp?: boolean;
  clipboard?: boolean;
  spanLevel?: number;
}

function App() {
  const [data, setData] = useState<TableData[]>([]);
  const [loading, { open, close }] = useDisclosure(true);

  useEffect(() => {
    open();
    fetch(import.meta.env.VITE_REQUEST_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) =>
        res.json().then((data) => {
          setData(data);
          close();
        })
      )
      .catch((e) => console.error(e));
  }, [open, close]);

  const renderValue = useCallback((item: TableData) => {
    const value = item.timestamp
      ? dayjs.unix(Number(item.value)).format("YYYY-MM-DD HH:mm:ss Z")
      : item.value;
    let ShowValue = <Text c={item.color}>{value}</Text>;

    if (item.url) {
      ShowValue = (
        <Anchor href={item.url} target="_blank" underline="always">
          {ShowValue}
        </Anchor>
      );
    }

    if (item.clipboard) {
      ShowValue = (
        <Flex gap={10} align={"center"}>
          {ShowValue}
          <CopyButton value={item.value}>
            {({ copied, copy }) => (
              <Button color={copied ? "teal" : "blue"} onClick={copy}>
                {copied ? "Copied" : "Copy"}
              </Button>
            )}
          </CopyButton>
        </Flex>
      );
    }

    return ShowValue;
  }, []);

  return (
    <MantineProvider>
      <Container size={"lg"} miw={500} pt={"lg"}>
        <Box pos="relative" h={loading ? 400 : "auto"} className="box" p={20}>
          <LoadingOverlay
            visible={loading}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
          />
          {loading ? (
            <Flex gap={20} direction={"column"}>
              <Skeleton h={20} />
              <Skeleton h={20} />
              <Skeleton h={20} />
              <Skeleton h={20} />
            </Flex>
          ) : (
            <Table striped highlightOnHover>
              <Table.Tbody>
                {data.map((item) => (
                  <Table.Tr key={item.key}>
                    <Table.Td w={350}>
                      <Text>
                        {item.spanLevel
                          ? `└${"─".repeat(Math.max(item.spanLevel - 1, 0))} `
                          : ""}
                        {item.key}
                      </Text>
                    </Table.Td>
                    <Table.Td>{renderValue(item)}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}
        </Box>
      </Container>
    </MantineProvider>
  );
}

export default App;
