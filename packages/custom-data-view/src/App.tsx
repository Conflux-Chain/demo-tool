import "@mantine/core/styles.css";
import { useDisclosure } from "@mantine/hooks";
import {
  Anchor,
  Box,
  Container,
  CopyButton,
  Flex,
  LoadingOverlay,
  MantineProvider,
  Skeleton,
  Table,
  Text,
  Title,
} from "@mantine/core";
import "./App.css";
import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import { IconCopy, IconCopyCheck } from "@tabler/icons-react";

export interface TableData {
  title: string;
  body: TableDataBody[];
}

export interface TableDataBody {
  key: string;
  value: string;
  color?: string;
  url?: string;
  timestamp?: boolean;
  clipboard?: boolean;
  spanLevel?: number;
}

function App() {
  const [data, setData] = useState<TableData>();
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

  const renderValue = useCallback((item: TableDataBody) => {
    const value = item.timestamp
      ? dayjs.unix(Number(item.value)).format("YYYY-MM-DD HH:mm:ss Z")
      : item.value;
    let ShowValue = (
      <Text size="sm" c={item.color}>
        {value}
      </Text>
    );

    if (item.url) {
      ShowValue = (
        <Anchor
          href={item.url}
          target="_blank"
          underline="always"
          c={"#1e3de4"}
        >
          {ShowValue}
        </Anchor>
      );
    }

    if (item.clipboard) {
      ShowValue = (
        <Flex gap={10} align={"center"}>
          {ShowValue}
          <CopyButton value={item.value}>
            {({ copied, copy }) =>
              copied ? (
                <IconCopyCheck color="#74798c" size={16} />
              ) : (
                <IconCopy onClick={copy} color="#74798c" size={16} />
              )
            }
          </CopyButton>
        </Flex>
      );
    }

    return ShowValue;
  }, []);

  return (
    <MantineProvider>
      <Container size={"lg"} miw={500} pt={"lg"}>
        {data?.title && (
          <Title mb={20} c={"#1a1a1a"}>
            {data.title}
          </Title>
        )}
        <Box
          pos="relative"
          h={loading ? 400 : "auto"}
          className="box"
          p={10}
          bg={"white"}
        >
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
            <Table highlightOnHover>
              <Table.Tbody>
                {data?.body.map((item) => (
                  <Table.Tr key={item.key}>
                    <Table.Td w={350}>
                      <Text size="sm" c="#74798c">
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
