import { Dialog, Portal } from "@chakra-ui/react";
import { LuCheck, LuX } from "react-icons/lu";

interface NotificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: "success" | "error";
  onSuccess?: () => void;
}

export const NotificationDialog: React.FC<NotificationDialogProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type,
  onSuccess,
}) => {
  const handleClose = () => {
    if (type === "success" && onSuccess) {
      onSuccess();
    }
    onClose();
  };
  return (
    <Dialog.Root open={isOpen}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content
            style={{
              padding: "24px",
              borderRadius: "8px",
              maxWidth: "400px",
              textAlign: "center",
              zIndex: 9999, // Ensure it's above other content
            }}
          >
            <div style={{ marginBottom: "16px" }}>
              {type === "success" ? (
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    background: "#4CAF50",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto",
                  }}
                >
                  <LuCheck size={24} color="white" />
                </div>
              ) : (
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    background: "#F44336",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto",
                  }}
                >
                  <LuX size={24} color="white" />
                </div>
              )}
            </div>
            <Dialog.Title
              style={{
                fontSize: "20px",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              {title}
            </Dialog.Title>
            <Dialog.Description
              style={{
                color: "#666",
                marginBottom: "24px",
              }}
            >
              {message}
            </Dialog.Description>
            <button
              onClick={handleClose}
              style={{
                padding: "8px 24px",
                background: type === "success" ? "#4CAF50" : "#F44336",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              OK
            </button>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
