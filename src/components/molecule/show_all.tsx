import { Dialog, Stack, Table, IconButton, Portal } from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";
import { NotificationDialog } from "./notification_dialog";
import SupabaseService from "../../services/supabase_service";
import { useEffect, useState } from "react";
import type { UserAcc } from "../../models/user_acc";
import { BiArrowBack, BiTrash } from "react-icons/bi";

export const ShowAll = () => {
  const [userData, setUserData] = useState<UserAcc[]>([]);
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

  useEffect(() => {
    const fetchData = async () => {
      const users = await SupabaseService.fetchUserTable();
      setUserData(users);
    };
    fetchData();
  }, []);

  const handleDelete = async (userId: number) => {
    try {
      // Delete from Supabase first
      await SupabaseService.deleteUser(userId);
      // Then update local state
      setUserData((prev) => prev.filter((user) => user.id !== userId));
      // Show success notification
      setNotification({
        isOpen: true,
        title: "Success",
        message: "User has been successfully deleted!",
        type: "success",
      });
    } catch (error) {
      // Show error notification
      setNotification({
        isOpen: true,
        title: "Error",
        message:
          error instanceof Error ? error.message : "Failed to delete user",
        type: "error",
      });
    }
  };

  return (
    <Stack gap="10">
      <Dialog.Root scrollBehavior="inside">
        <Dialog.Trigger asChild>
          <IconButton
            aria-label="Search database"
            bg="gray.700"
            color={"white"}
            _hover={{ bg: "gray.600" }} // Added hover state for better UX
          >
            <LuSearch />
          </IconButton>
        </Dialog.Trigger>
        <Portal>
          {" "}
          {/* Use Portal to ensure the dialog renders at the root level */}
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>List Nama</Dialog.Title>
                <Dialog.CloseTrigger asChild>
                  <IconButton
                    aria-label="Close dialog"
                    variant="ghost"
                    size="sm"
                  >
                    <BiArrowBack />
                  </IconButton>
                </Dialog.CloseTrigger>
              </Dialog.Header>
              <Dialog.Body>
                {/* The table now lives inside the scrollable body */}
                <Table.Root size="sm" variant="outline">
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader>ID</Table.ColumnHeader>
                      <Table.ColumnHeader>Name</Table.ColumnHeader>
                      <Table.ColumnHeader>NRP</Table.ColumnHeader>
                      <Table.ColumnHeader>Pangkat</Table.ColumnHeader>
                      <Table.ColumnHeader>Kelas</Table.ColumnHeader>
                      <Table.ColumnHeader>Actions</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {userData.map((user) => (
                      <Table.Row key={user.id}>
                        <Table.Cell>{user.id}</Table.Cell>
                        <Table.Cell>{user.name}</Table.Cell>
                        <Table.Cell>{user.nrp || "N/A"}</Table.Cell>
                        <Table.Cell>{user.pangkat || "N/A"}</Table.Cell>
                        <Table.Cell>{user.kelas || "N/A"}</Table.Cell>
                        <Table.Cell>
                          <IconButton
                            aria-label={`Delete user ${user.name}`}
                            colorScheme="red"
                            bg={"red"}
                            onClick={() => handleDelete(user.id)}
                          >
                            <BiTrash color="white"></BiTrash>
                          </IconButton>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Dialog.Body>
              <Dialog.Footer>
                {/* You can add buttons like "Close" here if needed */}
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
      <NotificationDialog
        isOpen={notification.isOpen}
        onClose={() => setNotification((prev) => ({ ...prev, isOpen: false }))}
        title={notification.title}
        message={notification.message}
        type={notification.type}
      />
    </Stack>
  );
};
