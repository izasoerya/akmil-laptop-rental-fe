import "./App.css";
import { useEffect, useState } from "react";
import supabaseService from "./services/supabase_service";
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
import CustomTableHeader from "./components/molecule/custom_table_header";
import type { LaptopAcc } from "./models/laptop_data";
import { BiTrash } from "react-icons/bi";

function App() {
  const [items, setItems] = useState<LaptopAcc[]>([]);
  const [loading, setLoading] = useState(true);

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

    unsub = supabaseService.subscribeLaptopAccChanges((payload) => {
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
    });

    return () => {
      unsub?.unsubscribe();
    };
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await supabaseService.deleteLaptopAcc(id);
    } catch (err) {
      console.error("Insert error:", err);
    }
  };

  return (
    <Flex gap="2" direction="column">
      <CustomTableHeader lastUpdate={new Date().toLocaleString()} />

      {loading ? (
        <Spinner size="xl" alignSelf="center" />
      ) : (
        <Table.Root size="md" interactive>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Product</Table.ColumnHeader>
              <Table.ColumnHeader>Last Interact</Table.ColumnHeader>
              <Table.ColumnHeader>Rented By</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Status</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {items.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>
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
                <Table.Cell>{item.user_id ? item.user_id : "-"}</Table.Cell>
                <Table.Cell justifyItems={"center"}>
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
                          <BiTrash color="white"></BiTrash>
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
                                onClick={() => handleDelete(Number(item.id))}
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
      )}
    </Flex>
  );
}

export default App;
