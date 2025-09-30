import React from "react";
import {
  Dialog,
  Portal,
  Button,
  CloseButton,
  Field,
  Input,
  VStack,
} from "@chakra-ui/react";

// Define the shape of a user object
interface UserData {
  id?: number;
  name: string;
  nrp?: string;
  pangkat?: string;
  kelas?: string;
}

interface ReusableDialogProps {
  logo: React.ReactNode;
  logoText: string;
  label: string;
  placeholder?: string;
  onSubmit: (value: any) => void;
  isUser?: boolean; // New prop to determine the form type
}

const ReusableDialog: React.FC<ReusableDialogProps> = ({
  logo,
  logoText,
  label,
  placeholder,
  onSubmit,
  isUser = false, // Default to false
}) => {
  // State for the default single-input form
  const [inputValue, setInputValue] = React.useState("");

  // State for the multi-field user form
  const [userFields, setUserFields] = React.useState({
    id: "",
    name: "",
    nrp: "",
    pangkat: "",
    kelas: "",
  });

  // A single handler for all user form inputs
  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (isUser) {
      if (!userFields.name.trim()) return; // Require at least a name
      const userData: UserData = {
        name: userFields.name,
        // Only include optional fields if they are not empty
        ...(userFields.id && { id: parseInt(userFields.id, 10) }),
        ...(userFields.nrp && { nrp: userFields.nrp }),
        ...(userFields.pangkat && { pangkat: userFields.pangkat }),
        ...(userFields.kelas && { kelas: userFields.kelas }),
      };
      onSubmit(userData);
      // Reset user form
      setUserFields({ id: "", name: "", nrp: "", pangkat: "", kelas: "" });
    } else {
      if (!inputValue.trim()) return;
      onSubmit(inputValue);
      setInputValue(""); // Reset default form
    }
  };

  const renderUserForm = () => (
    <VStack>
      <Field.Root>
        <Field.Label>ID (Optional)</Field.Label>
        <Input
          name="id"
          placeholder="e.g., 123"
          value={userFields.id}
          onChange={handleUserChange}
        />
      </Field.Root>
      <Field.Root required>
        <Field.Label>
          Name <Field.RequiredIndicator />
        </Field.Label>
        <Input
          name="name"
          placeholder="Enter full name"
          value={userFields.name}
          onChange={handleUserChange}
        />
      </Field.Root>
      <Field.Root>
        <Field.Label>NRP (Optional)</Field.Label>
        <Input
          name="nrp"
          placeholder="Enter NRP"
          value={userFields.nrp}
          onChange={handleUserChange}
        />
      </Field.Root>
      <Field.Root>
        <Field.Label>Pangkat (Optional)</Field.Label>
        <Input
          name="pangkat"
          placeholder="Enter rank"
          value={userFields.pangkat}
          onChange={handleUserChange}
        />
      </Field.Root>
      <Field.Root>
        <Field.Label>Kelas (Optional)</Field.Label>
        <Input
          name="kelas"
          placeholder="Enter class"
          value={userFields.kelas}
          onChange={handleUserChange}
        />
      </Field.Root>
    </VStack>
  );

  const renderDefaultForm = () => (
    <Field.Root required>
      <Field.Label>
        {label} <Field.RequiredIndicator />
      </Field.Label>
      <Input
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
    </Field.Root>
  );

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "#1a1a1a",
            padding: "0.5rem",
            borderRadius: "10px",
            color: "white",
            cursor: "pointer",
          }}
        >
          {logo}
          <span>{logoText}</span>
        </div>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{label}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              {isUser ? renderUserForm() : renderDefaultForm()}
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button color="white" onClick={handleSubmit}>
                Submit
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default ReusableDialog;
