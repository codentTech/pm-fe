"use client";

import { useState, useCallback } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function useCustomInput(onChange, type, endIcon) {
  const [showPassword, setShowPassword] = useState(false);

  const borderErrorStyle = {
    border: "1px solid red",
  };

  const borderSuccessStyle = {
    border: "1px solid gray",
  };

  const passwordMouseDownHandler = (event) => {
    event.preventDefault();
  };

  const inputChangeHandler = (e) => {
    if (onChange) onChange(e);
  };

  const getInputEndAdornment = useCallback(() => {
    if (type === "password") {
      return (
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          onMouseDown={passwordMouseDownHandler}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            padding: 0,
          }}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      );
    }
    return endIcon;
  }, [type, showPassword, endIcon]);

  return {
    showPassword,
    inputChangeHandler,
    getInputEndAdornment,
    borderErrorStyle,
    borderSuccessStyle,
  };
}
