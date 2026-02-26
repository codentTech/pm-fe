import { ErrorOutline } from "@mui/icons-material";
import PropTypes from "prop-types";

export default function FieldError({ className = "", error = "" }) {
  return (
    <p
      className={`flex flex-row typography-caption text-danger ${className} items-center justify-start align-middle`}
    >
      <ErrorOutline className="mr-[4px] w-4 h-4" /> {error}
    </p>
  );
}

FieldError.propTypes = {
  className: PropTypes.string,
  error: PropTypes.string,
};
