import { useState, useEffect, useRef, useMemo } from "react";

export const useCustomDataTable = ({
  actions = [],
  data = [],
  columns = [],
  initialSortConfig = { key: null, direction: "asc" },
  onSortChange,
  externalSort = false,
  searchValue = "",
  externalSearch = false,
  currentPage = 1,
  pageSize = 10,
  totalRecords = 0,
  onPageChange,
  onPageSizeChange,
  externalPagination = false,
  selectedIds = [],
  onSelectionChange,
}) => {
  // Internal state
  const [sortConfig, setSortConfig] = useState(initialSortConfig);
  const [activeActionRow, setActiveActionRow] = useState(null);
  const [internalCurrentPage, setInternalCurrentPage] = useState(currentPage);
  const [internalPageSize, setInternalPageSize] = useState(pageSize);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [activeActionRowId, setActiveActionRowId] = useState(null);
  const actionButtonRefs = useRef({});

  // Update internal state when external props change
  useEffect(() => {
    setInternalCurrentPage(currentPage);
  }, [currentPage]);

  useEffect(() => {
    setInternalPageSize(pageSize);
  }, [pageSize]);

  // Handle action dropdown positioning and toggle
  const handleActionRowToggle = (rowId, event) => {
    if (activeActionRowId === rowId) {
      setActiveActionRowId(null);
      return;
    }

    const button = event.currentTarget;
    const buttonRect = button.getBoundingClientRect();

    // Dropdown dimensions (approximate)
    const dropdownWidth = 200;
    const dropdownHeight = actions.length * 40; // approximate height per action

    // Calculate position relative to viewport (for fixed positioning)
    let top = buttonRect.bottom + 4; // 4px offset below button
    let left = buttonRect.right - dropdownWidth; // Align to right edge of button

    // Adjust horizontal position if dropdown would overflow viewport
    if (left < 10) {
      left = buttonRect.left; // Align to left of button
    }
    if (left + dropdownWidth > window.innerWidth - 10) {
      left = window.innerWidth - dropdownWidth - 10; // 10px margin from edge
    }

    // Adjust vertical position if dropdown would overflow viewport
    if (top + dropdownHeight > window.innerHeight - 10) {
      top = buttonRect.top - dropdownHeight - 4; // Show above button
    }

    // Ensure dropdown doesn't go above viewport
    if (top < 10) {
      top = 10; // Small margin from top
    }

    setDropdownPosition({ top, left });
    setActiveActionRowId(rowId);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        activeActionRowId &&
        !event.target.closest(".action-dropdown-container")
      ) {
        setActiveActionRowId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeActionRowId]);

  // Handle sorting
  const handleSort = (columnKey) => {
    const column = columns.find((col) => col.key === columnKey);
    if (!column?.sortable) return;

    let direction = "asc";
    if (sortConfig.key === columnKey && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const newSortConfig = { key: columnKey, direction };
    setSortConfig(newSortConfig);

    // If external sorting is enabled, call the external handler
    if (externalSort && onSortChange) {
      onSortChange(newSortConfig);
    }
  };

  // Process data based on search, sort, and pagination
  const processedData = useMemo(() => {
    // Ensure data is an array
    const dataArray = Array.isArray(data) ? data : [];
    let result = [...dataArray];

    // Apply search filter (if not external)
    if (!externalSearch && searchValue) {
      result = result.filter((row) =>
        columns.some((column) => {
          const value = row[column.key];
          if (value == null) return false;
          return String(value)
            .toLowerCase()
            .includes(searchValue.toLowerCase());
        }),
      );
    }

    // Apply sorting (if not external)
    if (!externalSort && sortConfig.key) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        // Handle null/undefined values
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return sortConfig.direction === "asc" ? 1 : -1;
        if (bValue == null) return sortConfig.direction === "asc" ? -1 : 1;

        // Handle different data types
        if (typeof aValue === "string" && typeof bValue === "string") {
          const comparison = aValue.localeCompare(bValue);
          return sortConfig.direction === "asc" ? comparison : -comparison;
        }

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchValue, sortConfig, columns, externalSearch, externalSort]);

  // Calculate pagination
  const totalRecordsCount = externalPagination
    ? totalRecords
    : processedData.length;
  const totalPages = Math.ceil(totalRecordsCount / internalPageSize);

  // Apply pagination (if not external)
  const paginatedData = useMemo(() => {
    if (externalPagination) {
      return processedData;
    }

    const startIndex = (internalCurrentPage - 1) * internalPageSize;
    return processedData.slice(startIndex, startIndex + internalPageSize);
  }, [
    processedData,
    internalCurrentPage,
    internalPageSize,
    externalPagination,
  ]);

  // Handle page change
  const handlePageChange = (newPage) => {
    const validPage = Math.max(1, Math.min(newPage, totalPages));
    setInternalCurrentPage(validPage);

    if (externalPagination && onPageChange) {
      onPageChange(validPage);
    }
  };

  // Handle page size change
  const handlePageSizeChange = (newPageSize) => {
    setInternalPageSize(newPageSize);
    setInternalCurrentPage(1); // Reset to first page when changing page size

    if (externalPagination && onPageSizeChange) {
      onPageSizeChange(newPageSize);
    }
    if (externalPagination && onPageChange) {
      onPageChange(1);
    }
  };

  // Handle selection
  const handleSelectAll = (checked) => {
    const currentPageIds = paginatedData.map((row) => row.id);
    onSelectionChange?.(checked ? currentPageIds : []);
  };

  const handleRowSelect = (id, checked) => {
    if (checked) {
      onSelectionChange?.([...selectedIds, id]);
    } else {
      onSelectionChange?.(
        selectedIds.filter((selectedId) => selectedId !== id),
      );
    }
  };

  useEffect(() => {
    if (selectedIds.length > 0) {
      onSelectionChange?.([]);
    }
  }, [
    internalCurrentPage,
    internalPageSize,
    sortConfig.key,
    sortConfig.direction,
    searchValue,
  ]);

  const handleActionClick = (actionKey, row, onActionClick) => {
    onActionClick?.(actionKey, row);
    setActiveActionRow(null);
  };

  // Selection state calculations
  const currentPageIds = paginatedData.map((row) => row.id);
  const selectedCurrentPageIds = selectedIds.filter((id) =>
    currentPageIds.includes(id),
  );
  const isAllSelected =
    currentPageIds.length > 0 &&
    selectedCurrentPageIds.length === currentPageIds.length;
  const isIndeterminate =
    selectedCurrentPageIds.length > 0 &&
    selectedCurrentPageIds.length < currentPageIds.length;

  return {
    // Data
    paginatedData,
    processedData,
    totalRecordsCount,

    // Sorting
    sortConfig,
    handleSort,

    // Pagination
    currentPage: internalCurrentPage,
    pageSize: internalPageSize,
    totalPages,
    handlePageChange,
    handlePageSizeChange,

    // Selection
    selectedIds,
    isAllSelected,
    isIndeterminate,
    handleSelectAll,
    handleRowSelect,

    // Actions
    actionButtonRefs,
    dropdownPosition,
    setDropdownPosition,
    activeActionRowId,
    setActiveActionRowId,
    activeActionRow,
    handleActionRowToggle,
    handleActionClick,

    // Search
    searchValue,
  };
};
