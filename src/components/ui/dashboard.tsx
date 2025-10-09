import styles from "./DashboardPage.module.css";
import { useEffect, useState } from "react";
import supabaseService from "../../services/supabase_service";
import { Box, Flex, Table, Spinner, IconButton } from "@chakra-ui/react";
import CustomTableHeader from "../../components/molecule/custom_table_header";
import type { LaptopAcc } from "../../models/laptop_data";
import { BiTrash } from "react-icons/bi";
import type { UserAcc } from "../../models/user_acc";
import { NotificationDialog } from "../molecule/notification_dialog";

const Dashboard = () => {
  const [items, setItems] = useState<LaptopAcc[]>([]);
  const [users, setUsers] = useState<UserAcc[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notification, setNotification] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "success" | "error";
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
  });

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
      setLoading(true);
      try {
        const [laptopData, userData] = await Promise.all([
          supabaseService.fetchLaptopAcc(),
          supabaseService.fetchUserTable(),
        ]);
        setItems(laptopData);
        setUsers(userData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchData();

    unsub = supabaseService.subscribeLaptopAccChanges(
      (payload: {
        eventType: string;
        new?: LaptopAcc;
        old?: { id: number };
      }) => {
        setItems((prevItems) => {
          if (payload.eventType === "INSERT" && payload.new) {
            return [...prevItems, payload.new];
          }
          if (payload.eventType === "UPDATE" && payload.new) {
            return prevItems.map((item) =>
              item.id === payload.new!.id ? payload.new! : item
            );
          }
          if (payload.eventType === "DELETE" && payload.old) {
            return prevItems.filter((item) => item.id !== payload.old!.id);
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
      // Delete laptop first
      await supabaseService.deleteLaptopAcc(id);

      // Then delete the corresponding user with the same ID
      await supabaseService.deleteUser(id);

      setNotification({
        isOpen: true,
        title: "Success",
        message: "Laptop and user have been successfully deleted!",
        type: "success",
      });
    } catch (err) {
      console.error("Delete error:", err);
      setNotification({
        isOpen: true,
        title: "Error",
        message:
          err instanceof Error
            ? err.message
            : "Failed to delete laptop and user",
        type: "error",
      });
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
              borderRadius: "12px",
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
                    Nama Laptop
                  </Table.ColumnHeader>
                  <Table.ColumnHeader>Interaksi Terakhir</Table.ColumnHeader>
                  <Table.ColumnHeader>Pemilik</Table.ColumnHeader>
                  <Table.ColumnHeader>Kondisi</Table.ColumnHeader>
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
                      {users.find((u) => u.id === item.id)?.name ||
                        "Unknown User"}
                    </Table.Cell>
                    <Table.Cell
                      style={{
                        background: isDarkMode
                          ? "rgba(51, 51, 51, 0.4)"
                          : "#F0F8FF",
                        border: "none",
                      }}
                    >
                      {item.condition}
                    </Table.Cell>
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
                          {item.user_id ? "Dipinjam" : "Tersedia"}
                        </Box>
                        <IconButton
                          bg="red"
                          onClick={() => handleDelete(item.id)}
                          aria-label="Delete item"
                        >
                          <BiTrash color="white" />
                        </IconButton>
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </div>
        )}
      </Flex>
      <NotificationDialog
        isOpen={notification.isOpen}
        onClose={() => setNotification((prev) => ({ ...prev, isOpen: false }))}
        title={notification.title}
        message={notification.message}
        type={notification.type}
      />
    </div>
  );
};

export default Dashboard;
