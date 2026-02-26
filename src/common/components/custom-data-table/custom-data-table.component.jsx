"use client";

import PropTypes from "prop-types";
import React from "react";
import SimpleSelect from "../dropdowns/simple-select/simple-select";
import { useCustomDataTable } from "./use-custom-data-table.hook";
import { MoreVertical } from "lucide-react";

const CustomDataTable = ({
  // Core data props
  columns,
  data,
  loading = false,

  // Sorting props
  initialSortConfig = { key: null, direction: "asc" },
  onSortChange,
  externalSort = false,

  // Selection props
  selectable = false,
  selectedIds = [],
  onSelectionChange,

  // Search props
  searchable = true,
  searchValue = "",
  onSearchChange,
  externalSearch = false,

  // Pagination props
  paginated = true,
  currentPage = 1,
  pageSize = 10,
  totalRecords = 0,
  onPageChange,
  onPageSizeChange,
  externalPagination = false,

  // Actions props
  actions = [],
  getActions, // Function to get actions for a specific row
  onActionClick,

  // Status props
  statusField,
  statusOptions = [],
  onStatusChange,

  // Customization props
  customCellRenderer = {},
  className = "",
  tableClassName = "",
  headerClassName = "",
  rowClassName = "",

  // Display options
  showHeader = true,
  emptyMessage = "No data found",
  height,
}) => {
  const {
    paginatedData,
    totalRecordsCount,
    sortConfig,
    handleSort,
    currentPage: internalCurrentPage,
    pageSize: internalPageSize,
    totalPages,
    handlePageChange,
    handlePageSizeChange,
    isAllSelected,
    isIndeterminate,
    handleSelectAll,
    handleRowSelect,
    dropdownPosition,
    setDropdownPosition,
    activeActionRowId,
    setActiveActionRowId,
    activeActionRow,
    actionRef,
    handleActionRowToggle,
    handleActionClick,
    actionButtonRefs,
  } = useCustomDataTable({
    actions,
    data,
    columns,
    initialSortConfig,
    onSortChange,
    externalSort,
    searchValue,
    externalSearch,
    currentPage,
    pageSize,
    totalRecords,
    onPageChange,
    onPageSizeChange,
    externalPagination,
    selectedIds,
    onSelectionChange,
  });

  // Helper function to get nested value from object
  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  };

  // Render cell content
  const renderCell = (column, row) => {
    // If there's a custom renderer, use it
    if (column.customRender) {
      return column.customRender(row);
    }

    // If there's a render function, use it
    if (column.render) {
      const value = getNestedValue(row, column.key);
      return column.render(value, row);
    }

    // If there's a global custom renderer for this column, use it
    if (customCellRenderer[column.key]) {
      return customCellRenderer[column.key](row[column.key], row);
    }

    // Get the value using the column key (supports nested keys like 'category.name')
    const value = getNestedValue(row, column.key);

    // Handle null/undefined values
    if (value === null || value === undefined) {
      return <span className="text-gray-400">---</span>;
    }

    // Handle different data types
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }

    if (typeof value === "object") {
      // If it's an object, try to render it as JSON or return a placeholder
      try {
        return <span className="text-gray-400 text-xs">Object</span>;
      } catch (e) {
        return <span className="text-gray-400">---</span>;
      }
    }

    // For strings, numbers, and other primitive types
    return String(value);
  };

  // Render sort icon
  const renderSortIcon = (column) => {
    if (!column.sortable) return null;

    const isActive = sortConfig.key === column.key;
    const isAsc = sortConfig.direction === "asc";

    return (
      <svg width="9" height="15" viewBox="0 0 9 15" className="ml-1">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0 6.3326L4.03846 0.499268L8.07692 6.3326H0Z"
          fill={isActive && isAsc ? "#000" : "#BDBDBD"}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0 8.66724L4.03846 14.5006L8.07692 8.66724H0Z"
          fill={isActive && !isAsc ? "#000" : "#BDBDBD"}
        />
      </svg>
    );
  };

  const calculateColSpan = () => {
    const hasActions = getActions ? true : actions.length > 0;
    return (
      columns.length +
      (selectable ? 1 : 0) +
      (statusField ? 1 : 0) +
      (hasActions ? 1 : 0)
    );
  };

  const hasColumnWidths = columns.some((col) => col.width);

  return (
    <div className={`bg-white ${className}`}>
      {/* Table */}
      <div
        className="w-full overflow-x-auto overflow-y-visible relative border border-gray-300 rounded-lg"
        style={{ height }}
      >
        <table
          className={`${tableClassName}`}
          style={
            hasColumnWidths
              ? { tableLayout: "fixed", minWidth: "100%" }
              : { minWidth: "100%" }
          }
        >
          {/* Header */}
          {showHeader && (
            <thead
              className={`z-10 bg-gray-50 border-b rounded-full ${headerClassName}`}
            >
              <tr>
                {/* Selection checkbox */}
                {selectable && (
                  <th className="w-12 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = isIndeterminate;
                      }}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="border border-gray-300 text-blue-600 rounded-full focus:ring-blue-500"
                    />
                  </th>
                )}

                {/* Column headers */}
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 text-left text-sm font-medium text-gray-900"
                    style={
                      column.width
                        ? {
                            width: column.width,
                            maxWidth: column.width,
                            minWidth: column.width,
                          }
                        : {}
                    }
                  >
                    <div
                      className={`flex items-center ${column.width ? "" : "whitespace-nowrap"} ${
                        column.sortable
                          ? "cursor-pointer hover:text-gray-700"
                          : ""
                      }`}
                      onClick={() => column.sortable && handleSort(column.key)}
                      title={column.title}
                    >
                      <span
                        className={
                          column.width ? "truncate flex-1 min-w-0" : ""
                        }
                      >
                        {column.title}
                      </span>
                      {renderSortIcon(column)}
                    </div>
                  </th>
                ))}

                {/* Status column */}
                {statusField && (
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                    Status
                  </th>
                )}

                {/* Actions column */}
                {((getActions &&
                  paginatedData.some((row) => getActions(row).length > 0)) ||
                  actions.length > 0) && (
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
          )}

          {/* Body */}
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td
                  colSpan={calculateColSpan()}
                  className="px-4 py-8 text-center"
                >
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={calculateColSpan()}
                  className="p-4 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <React.Fragment key={row.id || index}>
                  <tr className={`hover:bg-gray-50 ${rowClassName}`}>
                    {/* Selection checkbox */}
                    {selectable && (
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(row.id)}
                          onChange={(e) =>
                            handleRowSelect(row.id, e.target.checked)
                          }
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                    )}

                    {/* Data cells */}
                    {columns.map((column, colIndex) => {
                      const cellContent = renderCell(column, row);

                      return (
                        <td
                          key={colIndex}
                          className={`px-4 py-3 text-sm text-gray-900 ${column.width ? "" : "whitespace-nowrap"}`}
                          style={
                            column.width
                              ? {
                                  width: column.width,
                                  maxWidth: column.width,
                                  minWidth: column.width,
                                }
                              : {}
                          }
                        >
                          {column.width ? (
                            <div className="truncate block w-full">
                              {cellContent}
                            </div>
                          ) : (
                            cellContent
                          )}
                        </td>
                      );
                    })}

                    {/* Status cell */}
                    {statusField && (
                      <td className="px-4 py-3">
                        <select
                          value={row[statusField]}
                          onChange={(e) =>
                            onStatusChange?.(row.id, e.target.value)
                          }
                          className="rounded border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                          {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </td>
                    )}

                    {/* Actions cell */}
                    {(() => {
                      const rowActions = getActions ? getActions(row) : actions;
                      return (
                        rowActions.length > 0 && (
                          <td className="px-4 py-3 relative">
                            <button
                              onClick={(e) => handleActionRowToggle(row.id, e)}
                              ref={(el) => {
                                if (el) actionButtonRefs.current[row.id] = el;
                              }}
                              className="p-2 rounded hover:bg-gray-100 transition-colors duration-150"
                            >
                              <MoreVertical />
                            </button>
                          </td>
                        )
                      );
                    })()}
                  </tr>
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>

        {/* Action Dropdown */}
        {activeActionRowId && (
          <div
            className="action-dropdown-container fixed z-[9999]"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
            }}
          >
            <div className="rounded-lg border border-indigo-100 bg-white/95 shadow-xl backdrop-blur-sm py-2 min-w-[200px]">
              {(() => {
                const row = paginatedData.find(
                  (r) => r.id === activeActionRowId,
                );
                const rowActions = getActions ? getActions(row) : actions;
                return rowActions.map((action, index) => (
                  <button
                    key={action.key}
                    onClick={() => {
                      handleActionClick(action.key, row, onActionClick);
                      setActiveActionRowId(null);
                    }}
                    className={`flex items-center w-full px-4 py-1 text-sm text-neutral-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-150 ${
                      index === 0 ? "rounded-t-lg" : ""
                    } ${index === rowActions.length - 1 ? "rounded-b-lg" : ""}`}
                  >
                    {action.icon && (
                      <span className="mr-2 flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                        {action.icon}
                      </span>
                    )}
                    <span className="truncate">{action.label}</span>
                  </button>
                ));
              })()}
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {paginated && totalRecordsCount > 0 && (
        <div className="z-10 py-2 sm:py-3 bg-gray-50 border-b border-gray-200 rounded-b-lg flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Left: Page size + results info */}
          <div className="flex items-center text-xs sm:text-sm text-gray-700 w-full sm:w-auto justify-center sm:justify-start gap-2">
            <span className="hidden sm:inline">Rows per page:</span>

            <SimpleSelect
              size="sm"
              variant="minimal"
              className="min-w-[64px]"
              menuPosition="bottom"
              options={[
                { value: 10, label: "10" },
                { value: 25, label: "25" },
                { value: 50, label: "50" },
                { value: 100, label: "100" },
              ]}
              value={internalPageSize}
              onChange={(value) => handlePageSizeChange(Number(value))}
            />

            <span className="text-gray-500 hidden sm:inline">·</span>

            <span className="whitespace-nowrap">
              Showing{" "}
              <span className="font-medium">
                {(internalCurrentPage - 1) * internalPageSize + 1}–
                {Math.min(
                  internalCurrentPage * internalPageSize,
                  totalRecordsCount,
                )}
              </span>{" "}
              of <span className="font-medium">{totalRecordsCount}</span>
            </span>
          </div>

          {/* Right: Pagination controls */}
          <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto justify-center sm:justify-end">
            <button
              onClick={() => handlePageChange(internalCurrentPage - 1)}
              disabled={internalCurrentPage <= 1}
              className="px-2 sm:px-3 py-1 rounded-md border border-gray-300 text-xs sm:text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition"
            >
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </button>

            <span className="text-xs sm:text-sm text-gray-700 px-2 whitespace-nowrap">
              Page <span className="font-medium">{internalCurrentPage}</span> of{" "}
              <span className="font-medium">{totalPages}</span>
            </span>

            <button
              onClick={() => handlePageChange(internalCurrentPage + 1)}
              disabled={internalCurrentPage >= totalPages}
              className="px-2 sm:px-3 py-1 rounded-md border border-gray-300 text-xs sm:text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

CustomDataTable.propTypes = {
  // Core data
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      sortable: PropTypes.bool,
      customRender: PropTypes.func,
      width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool,

  // Sorting
  initialSortConfig: PropTypes.shape({
    key: PropTypes.string,
    direction: PropTypes.oneOf(["asc", "desc"]),
  }),
  onSortChange: PropTypes.func,
  externalSort: PropTypes.bool,

  // Selection
  selectable: PropTypes.bool,
  selectedIds: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ),
  onSelectionChange: PropTypes.func,

  // Search
  searchable: PropTypes.bool,
  searchValue: PropTypes.string,
  onSearchChange: PropTypes.func,
  externalSearch: PropTypes.bool,

  // Pagination
  paginated: PropTypes.bool,
  currentPage: PropTypes.number,
  pageSize: PropTypes.number,
  totalRecords: PropTypes.number,
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  externalPagination: PropTypes.bool,

  // Actions
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.node,
    }),
  ),
  onActionClick: PropTypes.func,

  // Status
  statusField: PropTypes.string,
  statusOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ),
  onStatusChange: PropTypes.func,

  // Customization
  customCellRenderer: PropTypes.object,
  className: PropTypes.string,
  tableClassName: PropTypes.string,
  headerClassName: PropTypes.string,
  rowClassName: PropTypes.string,

  // Display options
  showHeader: PropTypes.bool,
  emptyMessage: PropTypes.string,
  height: PropTypes.string,
};

export default CustomDataTable;
