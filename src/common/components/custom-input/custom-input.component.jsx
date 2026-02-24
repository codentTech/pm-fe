/* eslint-disable react/forbid-prop-types */

"use client";

import FieldError from "@/common/components/field-error/field-error.component";
import { Input, InputAdornment } from "@mui/material";
import PropTypes from "prop-types";
import FieldLabel from "../field-label/field-label.component";
import useCustomInput from "./use-custom-input.hook";

/**
 * CustomInput component with new theme system integration
 * @param type - The type of input (text, email, password, number, date, etc.)
 * @param placeholder - The placeholder text
 * @param onChange - The function to call when the input changes
 * @param name - The name of input to get value in onSubmit
 * @param defaultValue - The value that will be displayed on input field on first time
 * @param value - The value of the input
 * @param className - Additional CSS classes
 * @param endIcon - The icon to display at the end of the input
 * @param startIcon - The icon to display at the start of the input
 * @param disabled - Whether the input is disabled
 * @param errors - Form validation errors object
 * @param register - React Hook Form register function
 * @param label - Label text for the input
 * @param isRequired - Whether the field is required
 * @param inlineLabel - Whether to display label inline
 * @param labelClassName - Additional classes for label
 * @param readOnly - Whether the input is read-only
 * @param onClick - Click handler function
 * @param onKeyPress - Key press handler function
 * @param onKeyDown - Key down handler function
 * @param customRef - Custom ref for the input
 * @param onBlur - Blur handler function
 * @param onFocus - Focus handler function
 * @param size - Size variant (sm, md, lg)
 * @param variant - Visual variant (default, bordered, minimal)
 * @param helperText - Helper text displayed below the input
 * @returns A custom input component
 */

export default function CustomInput({
  type = "text",
  placeholder = "",
  name,
  onChange = null,
  defaultValue = null,
  value = null,
  className = "",
  endIcon = null,
  startIcon = null,
  disabled = false,
  errors = null,
  register = null,
  label = null,
  isRequired = false,
  inlineLabel = false,
  labelClassName = "",
  readOnly = false,
  onClick = null,
  onKeyPress = null,
  onKeyDown = null,
  customRef = null,
  onBlur = null,
  onFocus = null,
  size = "md",
  variant = "default",
  helperText = null,
  escapeKey = null,
}) {
  const {
    inputChangeHandler,
    showPassword,
    getInputEndAdornment,
    borderErrorStyle,
    borderSuccessStyle,
  } = useCustomInput(onChange, type, endIcon);

  // Get error state
  const hasError = errors && errors[name];
  const errorMessage = hasError ? errors[name].message : null;

  // Get input classes based on new theme system
  const getInputClasses = () => {
    const baseClasses = "form-input";

    // Size classes
    const sizeClasses = {
      sm: "text-sm py-2 px-3 h-9",
      md: "text-sm py-3 px-4 h-11", // default
      lg: "text-base py-4 px-4 h-12",
    };

    // Variant classes
    const variantClasses = {
      default: "",
      bordered: "border-2",
      minimal: "border-0 border-b-2 rounded-none bg-transparent",
    };

    // State classes
    const stateClasses = hasError ? "form-input-error" : "";
    const disabledClasses = disabled ? "opacity-60 cursor-not-allowed" : "";
    const readOnlyClasses = readOnly ? "bg-neutral-50" : "";

    // Special type classes
    const typeClasses = type === "number" ? "numArrowNotShow" : "";

    return `${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${variantClasses[variant]} ${stateClasses} ${disabledClasses} ${readOnlyClasses} ${typeClasses} ${className}`.trim();
  };

  // Container classes
  const containerClasses = inlineLabel
    ? "grid w-full grid-cols-[130px_1fr] items-center gap-4"
    : "form-group";

  const hasStartIcon = !!startIcon;
  const hasEndIcon = !!endIcon || !!getInputEndAdornment();

  // Match input line-height to size so placeholder/text are vertically centered
  const inputLineHeight =
    { sm: "2.25rem", md: "2.75rem", lg: "3rem" }[size] ?? "2.75rem";

  return (
    <div className={containerClasses}>
      {label && (
        <div className="w-full flex justify-between items-center">
          <FieldLabel
            label={label}
            isRequired={isRequired}
            className={`${inlineLabel ? "mt-0" : ""} ${labelClassName}`}
          />

          {/* Helper text */}
          {helperText && (
            <p className="min-w-24 typography-caption text-neutral-600 whitespace-nowrap truncate">
              {helperText}
            </p>
          )}
        </div>
      )}

      <div className="relative w-full">
        <Input
          {...(register &&
            register(name, {
              required: isRequired
                ? `${label || "This field"} is required`
                : false,
            }))}
          {...(onClick && { onClick })}
          {...(onKeyPress && { onKeyPress })}
          {...(onKeyDown && { onKeyDown })}
          {...(escapeKey && {
            onKeyDown: (e) => {
              if (e.key === "Escape") {
                escapeKey();
              }
            },
          })}
          name={name}
          onFocus={onFocus}
          type={showPassword ? "text" : type}
          placeholder={placeholder}
          className={getInputClasses()}
          {...(defaultValue !== null &&
            defaultValue !== undefined && { defaultValue })}
          {...(value !== null && value !== undefined && { value })}
          {...(customRef && { inputRef: customRef })}
          disabled={disabled}
          variant="standard"
          disableUnderline={true}
          startAdornment={
            startIcon ? (
              <InputAdornment
                position="start"
                sx={{ marginRight: 0, marginLeft: "4px" }}
              >
                {startIcon}
              </InputAdornment>
            ) : null
          }
          endAdornment={
            getInputEndAdornment() ? (
              <InputAdornment
                position="end"
                sx={{ marginLeft: 0, marginRight: "4px" }}
              >
                {getInputEndAdornment()}
              </InputAdornment>
            ) : null
          }
          {...(onChange && { onChange: inputChangeHandler })}
          readOnly={readOnly}
          {...(onBlur && { onBlur })}
          sx={{
            "&.MuiInputBase-root": {
              outline: "none",
              display: "flex",
              alignItems: "center",
              flexWrap: "nowrap",
              minHeight: "inherit",
              "&:focus": { outline: "none", boxShadow: "none" },
              "&:focus-within": { outline: "none", boxShadow: "none" },
              "&::before": { display: "none" },
              "&::after": { display: "none" },
            },
            "& .MuiInputBase-input": {
              padding: 0,
              paddingLeft: hasStartIcon ? "8px" : undefined,
              paddingRight: hasEndIcon ? "8px" : undefined,
              outline: "none",
              border: "none",
              boxShadow: "none",
              lineHeight: inputLineHeight,
              "&:focus": { outline: "none", border: "none", boxShadow: "none" },
              "&:focus-visible": {
                outline: "none",
                border: "none",
                boxShadow: "none",
              },
            },
            "& .MuiOutlinedInput-notchedOutline": { display: "none" },
            "& fieldset": { display: "none" },
            "& .MuiInputAdornment-root": {
              color: "inherit",
              alignSelf: "center",
            },
            "& .MuiInputAdornment-positionStart": {
              marginRight: "4px",
            },
            "& .MuiInputAdornment-positionEnd": {
              marginLeft: "4px",
            },
            "& .MuiIconButton-root": {
              padding: "4px",
            },
          }}
        />

        {/* Error message */}
        {errorMessage && (
          <div className="mt-1">
            <FieldError className="normal-case" error={errorMessage} />
          </div>
        )}
      </div>
    </div>
  );
}

CustomInput.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  onKeyPress: PropTypes.func,
  onKeyDown: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  endIcon: PropTypes.element,
  startIcon: PropTypes.element,
  disabled: PropTypes.bool,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  register: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  errors: PropTypes.object,
  label: PropTypes.string,
  isRequired: PropTypes.bool,
  inlineLabel: PropTypes.bool,
  labelClassName: PropTypes.string,
  readOnly: PropTypes.bool,
  customRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any }),
  ]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  variant: PropTypes.oneOf(["default", "bordered", "minimal"]),
  helperText: PropTypes.string,
};

// Export size and variant constants for easy usage
export const INPUT_SIZES = {
  SMALL: "sm",
  MEDIUM: "md",
  LARGE: "lg",
};

export const INPUT_VARIANTS = {
  DEFAULT: "default",
  BORDERED: "bordered",
  MINIMAL: "minimal",
};

export const INPUT_TYPES = {
  TEXT: "text",
  EMAIL: "email",
  PASSWORD: "password",
  NUMBER: "number",
  DATE: "date",
  TIME: "time",
  DATETIME_LOCAL: "datetime-local",
  TEL: "tel",
  URL: "url",
  SEARCH: "search",
};
