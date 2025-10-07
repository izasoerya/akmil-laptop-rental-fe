import React from "react";
import { Box, Flex, Text, Button, Icon } from "@chakra-ui/react";
import { FaSun, FaMoon } from "react-icons/fa";
import { CgAdd, CgUserAdd } from "react-icons/cg"; // Added CgUserAdd for clarity
import SupabaseService from "@/services/supabase_service";
import ReusableDialog from "./ReusableDialog"; // Make sure this path is correct
import { ShowAll } from "./show_all";
import { SettingsMenu } from "./settings_menu";

// A type for the user data object for better code safety
interface UserData {
  id?: number;
  name: string;
  nrp?: string;
  pangkat?: string;
  kelas?: string;
}

interface CustomTableHeaderProps {
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

const CustomTableHeader: React.FC<CustomTableHeaderProps> = ({
  toggleDarkMode,
  isDarkMode,
}) => {
  // State is no longer needed here; it's managed by ReusableDialog.

  // Handler for adding a LAPTOP (expects a string)
  const handleAddLaptop = async (laptopName: string) => {
    if (!laptopName.trim()) return; // Validation for the string
    try {
      await SupabaseService.insertLaptopAcc(laptopName);
      console.log("Laptop added successfully!");
    } catch (err) {
      console.error("Insert laptop error:", err);
    }
  };

  // Handler for adding a USER (expects an object)
  const handleAddUser = async (userData: UserData) => {
    // No .trim() needed; validation is handled in the dialog
    try {
      await SupabaseService.insertUserAcc(userData);
      console.log("User added successfully!");
    } catch (err) {
      console.error("Insert user error:", err);
    }
  };

  return (
    <Box
      px={10}
      py={4}
      borderRadius="md"
      boxShadow={
        isDarkMode
          ? "0 4px 6px rgba(0, 0, 0, 0.1)"
          : "0 4px 6px rgba(0, 0, 0, 0.05)"
      }
      style={{
        width: "75%",
        margin: "auto",
        background: isDarkMode
          ? "rgba(0, 0, 0, 0.5)"
          : "rgba(255, 255, 255, 0.35)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
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
          color={isDarkMode ? "#f9f9f9" : "rgba(0, 0, 0, 1.0)"}
        >
          RealTime Dashboard
        </Text>
        <Flex gap="5" align="center">
          <ShowAll></ShowAll>
          {/* Dialog for Adding a NEW LAPTOP */}
          <ReusableDialog
            logo={<CgAdd color={"white"} size="1rem" />}
            logoText="Tambahkan Laptop"
            label="Add New Laptop"
            placeholder="Enter Laptop's Name"
            onSubmit={handleAddLaptop}
            isUser={false} // This dialog is NOT for users
          />
          {/* Dialog for Adding a NEW USER */}
          <ReusableDialog
            logo={<CgUserAdd color={"white"} size="1rem" />}
            logoText="Tambahkan User"
            label="Add New User"
            onSubmit={handleAddUser}
            isUser={true} // This dialog IS for users
          />
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
          <SettingsMenu></SettingsMenu>
        </Flex>
      </Flex>
    </Box>
  );
};

export default CustomTableHeader;
