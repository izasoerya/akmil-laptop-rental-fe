import styles from "./DashboardPage.module.css";
import { useEffect, useState } from "react";
import supabaseService from "../../services/supabase_service";
import {
  Box,
  Flex,
  Table,
  Spinner,
  IconButton,
  Dialog,
  Portal,
  Button,
  CloseButton,
} from "@chakra-ui/react";
import CustomTableHeader from "../../components/molecule/custom_table_header";
import type { LaptopAcc } from "../../models/laptop_data";
import { BiTrash } from "react-icons/bi";
import ListName from "../../models/lookup_table_name";

function Dashboard() {
  const [items, setItems] = useState<LaptopAcc[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const containerStyle = {
    background: isDarkMode
      ? "linear-gradient(135deg, #222 0%, #444 100%)"
      : "linear-gradient(135deg, #1976d2 0%, #e3f2fd 100%)",
    color: isDarkMode ? "#fff" : "#000",
    minHeight: "100vh",
    padding: "1rem",
  };

  useEffect(() => {
    let unsub: { unsubscribe: () => void } | null = null;

    const fetchData = async () => {
      try {
        const data = await supabaseService.fetchLaptopAcc();
        setItems(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchData();

    unsub = supabaseService.subscribeLaptopAccChanges(
      (payload: { eventType: string; new?: LaptopAcc; old?: LaptopAcc }) => {
        setItems((prevItems) => {
          if (payload.eventType === "INSERT") {
            return [...prevItems, payload.new as LaptopAcc];
          }
          if (payload.eventType === "UPDATE") {
            return prevItems.map((item) =>
              item.id === (payload.new as LaptopAcc).id
                ? (payload.new as LaptopAcc)
                : item
            );
          }
          if (payload.eventType === "DELETE") {
            return prevItems.filter(
              (item) => item.id !== (payload.old as LaptopAcc).id
            );
          }
          return prevItems;
        });
      }
    );

    return () => {
      unsub?.unsubscribe();
    };
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await supabaseService.deleteLaptopAcc(id);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className={styles.container} style={containerStyle}>
      <Flex gap="2" direction="column">
        <CustomTableHeader
          toggleDarkMode={() => setIsDarkMode((prev) => !prev)}
          isDarkMode={isDarkMode}
        />

        {loading ? (
          <Spinner size="xl" alignSelf="center" />
        ) : (
          <div
            style={{
              width: "75%",
              margin: "auto",
              background: isDarkMode
                ? "rgba(0, 0, 0, 0.5)"
                : "rgba(255, 255, 255, 0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.25)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              overflow: "hidden",
              padding: "2rem",
              borderTopLeftRadius: "12px",
              borderBottomLeftRadius: "12px",
              borderTopRightRadius: "12px",
              borderBottomRightRadius: "12px",
            }}
          >
            <Table.Root
              size="md"
              interactive
              style={{
                width: "100%",
                height: "100%",
                borderCollapse: "separate",
                borderSpacing: "0 10px",
                background: "transparent",
                color: isDarkMode ? "#fff" : "#000",
              }}
            >
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader
                    style={{
                      borderTopLeftRadius: "12px",
                      borderBottomLeftRadius: "12px",
                    }}
                  >
                    Product
                  </Table.ColumnHeader>
                  <Table.ColumnHeader>Last Interact</Table.ColumnHeader>
                  <Table.ColumnHeader>Rented By</Table.ColumnHeader>
                  <Table.ColumnHeader
                    textAlign="center"
                    style={{
                      borderTopRightRadius: "12px",
                      borderBottomRightRadius: "12px",
                    }}
                  >
                    Status
                  </Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body style={{ background: "transparent" }}>
                {items.map((item) => (
                  <Table.Row
                    key={item.id}
                    style={{ background: "transparent" }}
                  >
                    {/* First Cell */}
                    <Table.Cell
                      style={{
                        background: isDarkMode
                          ? "rgba(51, 51, 51, 0.4)"
                          : "#F0F8FF",
                        border: "none",
                        borderTopLeftRadius: "12px",
                        borderBottomLeftRadius: "12px",
                      }}
                    >
                      {item.name}
                    </Table.Cell>

                    {/* Middle Cells */}
                    <Table.Cell
                      style={{
                        background: isDarkMode
                          ? "rgba(51, 51, 51, 0.4)"
                          : "#F0F8FF",
                        border: "none",
                      }}
                    >
                      {item.last_rented
                        ? new Date(item.last_rented).toLocaleString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
                    </Table.Cell>
                    <Table.Cell
                      style={{
                        background: isDarkMode
                          ? "rgba(51, 51, 51, 0.4)"
                          : "#F0F8FF",
                        border: "none",
                      }}
                    >
                      {item.user_id
                        ? (ListName as { [index: number]: string })[
                            item.user_id
                          ]
                        : "-"}
                    </Table.Cell>

                    {/* Last Cell */}
                    <Table.Cell
                      style={{
                        background: isDarkMode
                          ? "rgba(51, 51, 51, 0.4)"
                          : "#F0F8FF",
                        border: "none",
                        borderTopRightRadius: "12px",
                        borderBottomRightRadius: "12px",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Flex gap="2" align="center">
                        <Box
                          borderRadius="md"
                          fontWeight="bold"
                          color={item.user_id ? "white" : "green.100"}
                          bg={item.user_id ? "red.600" : "green.700"}
                          boxShadow="sm"
                          display="flex"
                          alignItems="center"
                          minWidth="80px"
                          height="40px"
                          justifyContent="center"
                        >
                          {item.user_id ? "Rented" : "Available"}
                        </Box>
                        <Dialog.Root>
                          <Dialog.Trigger asChild>
                            <IconButton bg="red">
                              <BiTrash color="white" />
                            </IconButton>
                          </Dialog.Trigger>
                          <Portal>
                            <Dialog.Backdrop />
                            <Dialog.Positioner>
                              <Dialog.Content>
                                <Dialog.Header>
                                  <Dialog.Title>Delete Item</Dialog.Title>
                                </Dialog.Header>
                                <Dialog.Body>
                                  <p>Are you sure? This is irreversible.</p>
                                </Dialog.Body>
                                <Dialog.Footer>
                                  <Dialog.ActionTrigger asChild>
                                    <Button variant="outline">Cancel</Button>
                                  </Dialog.ActionTrigger>
                                  <Button
                                    color="white"
                                    onClick={() =>
                                      handleDelete(Number(item.id))
                                    }
                                  >
                                    Delete
                                  </Button>
                                </Dialog.Footer>
                                <Dialog.CloseTrigger asChild>
                                  <CloseButton size="sm" />
                                </Dialog.CloseTrigger>
                              </Dialog.Content>
                            </Dialog.Positioner>
                          </Portal>
                        </Dialog.Root>
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </div>
        )}
      </Flex>
    </div>
  );
}

export default Dashboard;
