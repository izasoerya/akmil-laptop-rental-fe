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
} from "@chakra-ui/react";
import { CgAdd } from "react-icons/cg";
import SupabaseService from "@/services/supabase_service";

interface CustomTableHeaderProps {
  lastUpdate?: string;
}

const CustomTableHeader: React.FC<CustomTableHeaderProps> = ({
  lastUpdate,
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
    <Box bg="gray.800" px={10} py={4} borderRadius="md" boxShadow="sm">
      <Flex
        justify="space-between"
        align="center"
        direction={{ base: "column", md: "row" }}
        gap={4}
      >
        <Text fontSize="xl" fontWeight="bold" color="white">
          RealTime Dashboard
        </Text>
        <Flex gap="5">
          <VStack align="flex-end" gap={0}>
            <Text fontSize="sm" color="white">
              Last update:
            </Text>
            <Text fontSize="sm" color="white">
              {lastUpdate ? lastUpdate : "-"}
            </Text>
          </VStack>

          <Dialog.Root>
            <Dialog.Trigger asChild>
              <IconButton aria-label="Add laptop">
                <CgAdd color="white" />
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
        </Flex>
      </Flex>
    </Box>
  );
};

export default CustomTableHeader;
