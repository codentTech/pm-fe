"use client";

import PropTypes from "prop-types";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import useInlineEditInput from "./use-inline-edit-input.hook";

export default function InlineEditInput({
  name,
  value,
  onChange,
  onSave,
  onCancel,
  loading,
  placeholder,
  className,
  wrapperClassName,
  size,
}) {
  const { inputRef, handleKeyDown } = useInlineEditInput();

  return (
    <div className={wrapperClassName}>
      <CustomInput
        name={name}
        value={value}
        onChange={(e) => onChange(e?.target?.value ?? e)}
        onBlur={() => (loading ? null : onCancel())}
        onKeyDown={(e) => handleKeyDown(e, onSave, onCancel)}
        disabled={loading}
        placeholder={placeholder}
        customRef={inputRef}
        size={size}
        className={className}
      />
    </div>
  );
}

InlineEditInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  wrapperClassName: PropTypes.string,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
};

InlineEditInput.defaultProps = {
  loading: false,
  placeholder: "",
  className: "",
  wrapperClassName: "form-group !mb-0",
  size: "sm",
};
