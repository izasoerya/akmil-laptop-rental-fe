import React, { useState } from "react";
import supabaseService from "../../services/supabase_service";
import styles from "./LoginPage.module.css";
import DarkModeToggle from "../molecule/dark_mode";
import { NotificationDialog } from "../molecule/notification_dialog";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isValid = await supabaseService.loginAdmin(email, password);
      if (isValid) {
        sessionStorage.setItem("token", "your-auth-token"); // Mock token storage
        window.location.reload(); // Refresh the page
      } else {
        setNotification({
          isOpen: true,
          title: "Login Failed",
          message: "Invalid email or password.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setNotification({
        isOpen: true,
        title: "Error",
        message: "An error occurred during login.",
        type: "error",
      });
    }
  };

  return (
    <div
      className={styles.container}
      style={{
        background: isDarkMode
          ? "linear-gradient(135deg, #404040ff 0%, #444 100%)"
          : "linear-gradient(135deg, #1976d2 0%, #e3f2fd 100%)",
        color: isDarkMode ? "#fff" : "#000",
      }}
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <div
          className={styles.header}
          style={{
            textAlign: "left",
            position: "relative",
            display: "flex",
            alignItems: "left",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h2>Admin Login</h2>
            <p>Peminjaman Laptop AAU</p>
          </div>
          <div style={{ position: "absolute", top: 0, right: 0 }}>
            <DarkModeToggle
              toggleDarkMode={() => setIsDarkMode((prev) => !prev)}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>

        <div className={styles.inputGroup} style={{ textAlign: "left" }}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            placeholder="admin@example.com"
          />
        </div>

        <div className={styles.inputGroup} style={{ textAlign: "left" }}>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <div className={styles.passwordWrapper}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className={styles.showPasswordButton}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <button type="submit" className={styles.submitButton}>
          Login
        </button>
      </form>
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

export default LoginPage;
