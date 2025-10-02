import { IconButton, Portal } from "@chakra-ui/react";
import { Menu } from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

export const SettingsMenu = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the authentication token
    sessionStorage.removeItem("token");
    // Redirect to login page
    navigate("/");
    // Refresh the page
    window.location.reload();
  };

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <IconButton
          aria-label="Settings menu"
          variant="ghost"
          color="current"
          style={{ zIndex: 600 }}
        >
          <BsThreeDotsVertical color="white" />
        </IconButton>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner style={{ zIndex: 600 }}>
          <Menu.Content style={{ zIndex: 600 }}>
            <Menu.Item value="logout" onClick={handleLogout}>
              Log Out
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};
