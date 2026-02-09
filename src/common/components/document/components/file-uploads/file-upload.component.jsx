import PropTypes from "prop-types";
import FileInput from "@/common/components/file-input/file-input.component";

function FileUpload({ rowData, moduleName }) {
  return (
    <div className="min-w-0 border-r border-solid border-r-disabled-input p-2">
      <FileInput
        module={rowData}
        moduleName={moduleName}
        fileWidth="w-[363px]"
        fileNameWidth="max-w-[220px]"
      />
    </div>
  );
}

FileUpload.propTypes = {
  rowData: PropTypes.object.isRequired,
  moduleName: PropTypes.string,
};

export default FileUpload;
