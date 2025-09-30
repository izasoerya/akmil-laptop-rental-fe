import React, { useState } from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  Button,
  CloseButton,
  Portal,
  IconButton,
  Field,
  Input,
  Dialog,
  Icon,
} from "@chakra-ui/react";
import { CgAdd } from "react-icons/cg";
import SupabaseService from "@/services/supabase_service";
import { FaSun, FaMoon } from "react-icons/fa";

interface CustomTableHeaderProps {
  lastUpdate?: string;
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

const CustomTableHeader: React.FC<CustomTableHeaderProps> = ({
  lastUpdate,
  toggleDarkMode,
  isDarkMode,
}) => {
  const [laptopName, setLaptopName] = useState("");

  const handleAdd = async () => {
    if (!laptopName.trim()) return;
    try {
      await SupabaseService.insertLaptopAcc(laptopName);
      setLaptopName("");
    } catch (err) {
      console.error("Insert error:", err);
    }
  };

  return (
    <Box
      px={10}
      py={4}
      borderRadius="md"
      boxShadow={
        isDarkMode
          ? "0 40px 60px rgba(0, 0, 0, 0.1)"
          : "0 4px 6px rgba(0, 0, 0, 0.05)"
      }
      style={{
        width: "75%",
        margin: "auto",
        // Glassmorphism styles applied here
        background: isDarkMode
          ? "rgba(0, 0, 0, 0.5)" // Dark, semi-transparent
          : "rgba(255, 255, 255, 0.35)", // Light, semi-transparent
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)", // For Safari support
      }}
    >
      <Flex
        justify="space-between"
        align="center"
        direction={{ base: "column", md: "row" }}
        gap={4}
      >
        <Text
          fontSize="xl"
          fontWeight="bold"
          color={isDarkMode ? "#f9f9f9" : "#181818ff"} // Adjusted text color for better contrast
        >
          RealTime Dashboard
        </Text>
        <Flex gap="5" align="center">
          <VStack align="flex-end" gap={0}>
            <Text fontSize="sm" color={isDarkMode ? "white" : "black"}>
              Last update:
            </Text>
            <Text fontSize="sm" color={isDarkMode ? "white" : "black"}>
              {lastUpdate ? lastUpdate : "-"}
            </Text>
          </VStack>

          <Dialog.Root>
            <Dialog.Trigger asChild>
              <IconButton aria-label="Add laptop" bg="gray.900" color="white">
                <CgAdd color={"white"} />
              </IconButton>
            </Dialog.Trigger>
            <Portal>
              <Dialog.Backdrop />
              <Dialog.Positioner>
                <Dialog.Content>
                  <Dialog.Header>
                    <Dialog.Title>Add New Laptop</Dialog.Title>
                  </Dialog.Header>
                  <Dialog.Body>
                    <Field.Root required>
                      <Field.Label>
                        Laptop's Name <Field.RequiredIndicator />
                      </Field.Label>
                      <Input
                        placeholder="Enter Laptop's Name"
                        value={laptopName}
                        onChange={(e) => setLaptopName(e.target.value)}
                      />
                    </Field.Root>
                  </Dialog.Body>
                  <Dialog.Footer>
                    <Dialog.ActionTrigger asChild>
                      <Button variant="outline">Cancel</Button>
                    </Dialog.ActionTrigger>
                    <Button color="white" onClick={() => handleAdd()}>
                      Add
                    </Button>
                  </Dialog.Footer>
                  <Dialog.CloseTrigger asChild>
                    <CloseButton size="sm" />
                  </Dialog.CloseTrigger>
                </Dialog.Content>
              </Dialog.Positioner>
            </Portal>
          </Dialog.Root>

          <Button
            onClick={toggleDarkMode}
            colorScheme={isDarkMode ? "yellow" : "blue"}
          >
            {isDarkMode ? (
              <Icon as={FaSun} color="white" />
            ) : (
              <Icon as={FaMoon} color="white" />
            )}
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default CustomTableHeader;
