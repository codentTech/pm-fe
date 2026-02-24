"use client";

import { useMemo, useState } from "react";
import ConfirmationModal from "@/common/components/confirmation-modal/confirmation-modal.component";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import CustomDataTable from "@/common/components/custom-data-table/custom-data-table.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select.jsx";
import Loader from "@/common/components/loader/loader.component";
import Modal from "@/common/components/modal/modal.component";
import NoResultFound from "@/common/components/no-result-found/no-result-found.jsx";
import TextArea from "@/common/components/text-area/text-area.component";
import BoardDnd from "@/components/boards/board-dnd/board-dnd.component";
import SortableListColumn from "@/components/boards/board-dnd/components/sortable-list-column/sortable-list-column.component";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  LayoutGrid,
  Lock,
  Pencil,
  Play,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";
import useBoardDetail from "./use-board-detail.hook";
import { LIST_COLORS } from "@/common/constants/colors.constant";
import {
  TICKET_STATUS_BY_LIST_TITLE,
  TICKET_WIP_LIMITS_BY_STATUS,
} from "@/common/constants/ticket.constant";
import { TICKET_PRIORITY_OPTIONS } from "@/common/constants/ticket.constant";
import { PROJECT_STATUS_OPTIONS } from "@/common/constants/project.constant";
import {
  SPRINT_STATUS_LABELS,
  SPRINT_STATUS_CLASSES,
  SPRINT_STATUS_OPTIONS,
  SPRINT_STATUS_TRANSITIONS,
} from "@/common/constants/sprint.constant";
import { formatDate } from "@/common/utils/date.util";
import ReadMore from "@/common/components/readmore/readmore.component";

export default function BoardDetail({ projectId }) {
  const [bulkTargetSprintId, setBulkTargetSprintId] = useState("");
  const {
    currentProject,
    fetchState,
    deleteCardState,
    deleteListState,
    createListState,
    createCardState,
    showAddList,
    setShowAddList,
    addingCardListId,
    setAddingCardListId,
    activeCard,
    setActiveCard,
    activeListId,
    setActiveListId,
    activeDropTarget,
    setActiveDropTarget,
    listForm,
    lists,
    listIds,
    listToDeleteId,
    setListToDeleteId,
    cardToDeleteId,
    setCardToDeleteId,
    handleCreateList,
    handleCreateCard,
    handleMoveCard,
    handleMoveCardAt,
    handleReorderLists,
    requestDeleteList,
    requestDeleteCard,
    confirmDeleteCard,
    confirmDeleteList,
    handleCardClick,
    handleAssignSprint,
    activeView,
    setActiveView,
    activeBacklogTab,
    setActiveBacklogTab,
    productBacklog,
    sprintBacklog,
    bugBacklog,
    blockedBacklog,
    sprints,
    fetchSprintsState,
    createSprintState,
    updateSprintState,
    deleteSprintState,
    showCreateSprint,
    setShowCreateSprint,
    showEditSprint,
    setShowEditSprint,
    showPlanSprint,
    sprintForm,
    editSprintForm,
    handleCreateSprint,
    handleUpdateSprint,
    openPlanSprint,
    closePlanSprint,
    openEditSprint,
    closeEditSprint,
    editSprintId,
    sprintError,
    selectedSprintId,
    setSelectedSprintId,
    planSprintId,
    selectedProductIds,
    setSelectedProductIds,
    selectedSprintIds,
    setSelectedSprintIds,
    bulkAssignLoading,
    handleBulkAssignToSprint,
    handleBulkRemoveFromSprint,
    handleUpdateCardFields,
    requestDeleteSprint,
    confirmDeleteSprint,
    sprintToDeleteId,
    setSprintToDeleteId,
    currentUserRole,
    isReadOnly,
    orgMembers,
  } = useBoardDetail(projectId);

  const safeLists = lists || [];
  const safeSprints = sprints || [];

  const priorityLabelByValue = useMemo(
    () =>
      TICKET_PRIORITY_OPTIONS.reduce(
        (acc, option) => ({ ...acc, [option.value]: option.label }),
        {},
      ),
    [],
  );

  const capacityMembers = useMemo(
    () =>
      (orgMembers || []).map((m) => ({
        id: m.User?.Id || m.UserId,
        name: m.User?.FullName || "Unknown",
      })),
    [orgMembers],
  );

  const listToDeleteTitle =
    safeLists.find((l) => l.Id === listToDeleteId)?.Title ?? "this list";
  const sprintOptions = safeSprints.map((s) => ({
    value: s.Id,
    label: s.Name,
  }));
  const sprintNameById = sprintOptions.reduce(
    (acc, option) => ({ ...acc, [option.value]: option.label }),
    {},
  );
  const wipByListId = safeLists.reduce((acc, list) => {
    const statusKey =
      TICKET_STATUS_BY_LIST_TITLE[list?.Title?.trim().toLowerCase() ?? ""];
    const limit =
      statusKey && Number.isFinite(TICKET_WIP_LIMITS_BY_STATUS[statusKey])
        ? TICKET_WIP_LIMITS_BY_STATUS[statusKey]
        : null;
    const count = list?.Cards?.length ?? 0;
    acc[list.Id] = {
      status: statusKey || null,
      limit,
      count,
      isBlocked: !!limit && count >= limit,
    };
    return acc;
  }, {});

  const projectStatusLabel =
    PROJECT_STATUS_OPTIONS.find((s) => s.value === currentProject?.Status)
      ?.label ||
    currentProject?.Status ||
    "—";
  const projectStatusKey = (currentProject?.Status || "").toLowerCase();
  const isProjectReadOnly =
    projectStatusKey === "paused" || projectStatusKey === "closed";
  const canManageSprints = !isReadOnly && projectStatusKey === "active";
  const canEditBacklog = !isReadOnly && !isProjectReadOnly;

  const CapacityEditor = ({ form, disabled = false }) => {
    const capacity = form.watch("CapacitySnapshot") || {};
    if (capacityMembers.length === 0) {
      return (
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-500">
          No members found. Add members to set capacity.
        </div>
      );
    }
    return (
      <div className="space-y-2">
        {capacityMembers.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-white px-3 py-2"
          >
            <div className="text-sm font-medium text-neutral-700">
              {member.name}
            </div>
            <CustomInput
              type="number"
              placeholder="Hours"
              className="w-28"
              value={capacity[member.id] ?? ""}
              onChange={(e) => {
                const next = { ...capacity };
                const value = e.target.value;
                if (!value) {
                  delete next[member.id];
                } else {
                  next[member.id] = Number(value);
                }
                form.setValue("CapacitySnapshot", next, { shouldDirty: true });
              }}
              disabled={disabled}
            />
          </div>
        ))}
      </div>
    );
  };

  const backlogColumns = useMemo(() => {
    const baseColumns = [
      {
        key: "Title",
        title: "Title",
        sortable: true,
        customRender: (row) => (
          <Link
            href={`/projects/${projectId}/cards/${row.Id}`}
            className="font-medium text-blue-600 hover:underline"
          >
            {row.Title || "—"}
          </Link>
        ),
      },
      { key: "TicketType", title: "Type", sortable: true },
      {
        key: "Priority",
        title: "Priority",
        sortable: true,
        customRender: (row) =>
          canEditBacklog ? (
            <SimpleSelect
              options={TICKET_PRIORITY_OPTIONS}
              value={row.Priority || ""}
              onChange={(value) =>
                handleUpdateCardFields(row.Id, { Priority: value })
              }
              placeholder="Priority"
              size="sm"
              variant="minimal"
              className="min-w-[120px]"
            />
          ) : (
            <span className="text-sm text-neutral-600">
              {priorityLabelByValue[row.Priority] || "—"}
            </span>
          ),
      },
      { key: "Status", title: "Status", sortable: true },
    ];

    const extraColumns = [];
    if (activeBacklogTab === "bugs") {
      extraColumns.push({
        key: "Severity",
        title: "Severity",
        sortable: true,
        customRender: (row) => (
          <span className="text-sm text-neutral-600">
            {row.Severity ? row.Severity.replace("_", " ") : "—"}
          </span>
        ),
      });
    }
    if (activeBacklogTab === "blocked") {
      extraColumns.push({
        key: "BlockedReason",
        title: "Blocked reason",
        sortable: false,
        customRender: (row) => (
          <span className="text-sm text-neutral-600">
            {row.BlockedReason || "—"}
          </span>
        ),
      });
    }

    const sprintColumn = {
      key: "SprintId",
      title: "Sprint",
      sortable: false,
      customRender: (row) =>
        activeBacklogTab === "sprint" ? (
          <span className="text-sm text-neutral-600">
            {row.SprintId ? sprintNameById[row.SprintId] || "—" : "—"}
          </span>
        ) : sprintOptions.length === 0 ? (
          <span className="text-xs text-neutral-400">No sprints</span>
        ) : (
          <SimpleSelect
            options={sprintOptions}
            value={row.SprintId || ""}
            onChange={(value) => handleAssignSprint(row.Id, value)}
            placeholder="Assign sprint…"
            size="sm"
            variant="minimal"
            className="min-w-[160px]"
            disabled={!canManageSprints}
          />
        ),
    };

    const actionColumn = {
      key: "BacklogAction",
      title: "",
      sortable: false,
      customRender: (row) =>
        activeBacklogTab === "sprint" ? (
          <CustomButton
            text="Remove"
            variant="cancel"
            size="sm"
            onClick={() => handleAssignSprint(row.Id, null)}
            disabled={!canManageSprints}
          />
        ) : null,
    };

    return [...baseColumns, ...extraColumns, sprintColumn, actionColumn];
  }, [
    activeBacklogTab,
    canEditBacklog,
    canManageSprints,
    handleAssignSprint,
    handleUpdateCardFields,
    priorityLabelByValue,
    projectId,
    sprintNameById,
    sprintOptions,
  ]);

  const backlogData =
    activeBacklogTab === "product"
      ? (productBacklog?.data?.items ?? [])
      : activeBacklogTab === "sprint"
        ? (sprintBacklog?.data?.items ?? [])
        : activeBacklogTab === "bugs"
          ? (bugBacklog?.data?.items ?? [])
          : (blockedBacklog?.data?.items ?? []);

  const planSprint = safeSprints.find((s) => s.Id === planSprintId);

  const backlogLoading =
    activeBacklogTab === "product"
      ? productBacklog?.isLoading
      : activeBacklogTab === "sprint"
        ? sprintBacklog?.isLoading
        : activeBacklogTab === "bugs"
          ? bugBacklog?.isLoading
          : blockedBacklog?.isLoading;

  if (fetchState?.isLoading && !currentProject) {
    return (
      <div className="flex min-h-[400px] items-center justify-center p-6">
        <Loader loading />
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="px-4 sm:px-5">
        <div className="flex flex-col items-center gap-4">
          <NoResultFound
            icon={LayoutGrid}
            title="Project not found"
            description="This project doesn't exist or you don't have access to it."
            variant="compact"
          />
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 typography-body font-medium text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <div className="sticky top-0 z-10 page-header-bar">
        <Link
          href="/projects"
          className="flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1.5 typography-body font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Projects</span>
        </Link>
        <div className="page-header-divider" />
        <div className="min-w-0 flex-1 overflow-hidden">
          <h1 className="font-bold !text-indigo-600 typography-h4 sm:typography-h3 max-w-[500px] truncate">
            {currentProject.Name}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {projectStatusLabel && (
            <span className="rounded-lg bg-black px-3 py-[5px] text-xs font-semibold text-white">
              {projectStatusLabel}
            </span>
          )}
          <CustomButton
            text="Create Wiki for this project"
            variant="primary"
            size="sm"
            onClick={() => router.push(`/projects/${projectId}/wiki`)}
          />
        </div>
      </div>

      <div className="page-separator" aria-hidden>
        <span className="page-separator-line" />
        <span className="flex gap-1">
          {LIST_COLORS.map((color, i) => (
            <span
              key={i}
              className={`page-separator-dot bg-gradient-to-br ${color}`}
            />
          ))}
        </span>
        <span className="page-separator-line" />
      </div>

      <div className="px-4 sm:px-5 mb-4 ">
        {currentProject.Description && (
          <p className="max-w-full break-words rounded-lg border border-neutral-200 p-2">
            <ReadMore text={currentProject.Description} size={300} />
          </p>
        )}
      </div>

      <div className="px-4 sm:px-5">
        <div className="flex flex-wrap gap-2 rounded-lg border border-neutral-200 bg-white/70 p-2 shadow-sm">
          {[
            { key: "kanban", label: "Kanban" },
            { key: "backlogs", label: "Backlogs" },
            { key: "sprints", label: "Sprints" },
          ].map((view) => (
            <button
              key={view.key}
              type="button"
              onClick={() => setActiveView(view.key)}
              className={`rounded-lg px-3.5 py-1 text-xs font-semibold transition-all ${
                activeView === view.key
                  ? "bg-indigo-600 text-white shadow-md ring-1 ring-indigo-500/40"
                  : "bg-neutral-200 text-neutral-600 hover:bg-indigo-50 hover:text-indigo-700"
              }`}
            >
              {view.label}
            </button>
          ))}
        </div>
      </div>

      {activeView === "kanban" && (
        <div className="flex gap-3 overflow-x-auto px-4 sm:px-5 pb-6 scrollbar-thin sm:gap-4 sm:p-4 [-webkit-overflow-scrolling:touch]">
          <BoardDnd
            listIds={listIds}
            lists={lists}
            onMoveCardAt={handleMoveCardAt}
            onReorderLists={handleReorderLists}
            activeCard={activeCard}
            setActiveCard={setActiveCard}
            setActiveListId={setActiveListId}
            setActiveDropTarget={setActiveDropTarget}
            wipByListId={wipByListId}
          >
            {lists.map((list, index) => (
              <SortableListColumn
                key={list.Id}
                list={list}
                listIndex={index}
                activeDropTarget={activeDropTarget}
                activeCard={activeCard}
                onAddCard={() => setAddingCardListId(list.Id)}
                showAddCard={addingCardListId === list.Id}
                onSaveCard={(payload) => handleCreateCard(list.Id, payload)}
                onCancelCard={() => setAddingCardListId(null)}
                isSavingCard={createCardState?.isLoading}
                onMoveCard={handleMoveCard}
                onRequestDeleteList={() => requestDeleteList(list.Id)}
                onDeleteCard={requestDeleteCard}
                onCardClick={handleCardClick}
                otherLists={lists.filter((l) => l.Id !== list.Id)}
                wipInfo={wipByListId[list.Id]}
                wipByListId={wipByListId}
              />
            ))}
          </BoardDnd>

          {!showAddList ? (
            <CustomButton
              type="button"
              text="Add another list"
              variant="ghost"
              startIcon={<Plus className="h-4 w-4 shrink-0" />}
              onClick={() => setShowAddList(true)}
              disabled={isProjectReadOnly || isReadOnly}
              className="h-fit min-w-[240px] shrink-0 justify-start rounded-lg border-2 border-dashed border-neutral-300 p-3 text-left font-medium text-neutral-600 typography-body transition-colors hover:border-neutral-400 hover:bg-neutral-100 hover:text-neutral-800 sm:min-w-[280px] sm:p-4 [&_.btn]:!justify-start"
            />
          ) : (
            <div className="min-w-[240px] shrink-0 rounded-lg border border-neutral-200 p-3 sm:min-w-[280px] sm:p-4">
              <form
                onSubmit={listForm.handleSubmit(handleCreateList)}
                className="space-y-3"
              >
                <CustomInput
                  name="Title"
                  placeholder="Enter list title…"
                  register={listForm.register}
                  errors={listForm.formState.errors}
                  disabled={isProjectReadOnly || isReadOnly}
                />
                <div className="flex gap-2">
                  <CustomButton
                    type="submit"
                    text="Add list"
                    variant="primary"
                    className="rounded-lg"
                    loading={createListState?.isLoading}
                    disabled={isProjectReadOnly || isReadOnly}
                  />
                  <CustomButton
                    type="button"
                    text="Cancel"
                    variant="cancel"
                    onClick={() => setShowAddList(false)}
                    className="rounded-lg"
                  />
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {activeView === "backlogs" && (
        <div className="px-4 sm:px-5 mt-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2 rounded-lg border border-neutral-200 bg-white/70 p-2 shadow-sm">
              {[
                { key: "product", label: "Product backlog" },
                { key: "sprint", label: "Sprint backlog" },
                { key: "bugs", label: "Bug backlog" },
                { key: "blocked", label: "Blocked backlog" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveBacklogTab(tab.key)}
                  className={`rounded-lg px-3.5 py-1 text-xs font-semibold transition-all ${
                    activeBacklogTab === tab.key
                      ? "bg-indigo-600 text-white shadow-md ring-1 ring-indigo-500/40"
                      : "bg-neutral-200 text-neutral-600 hover:bg-indigo-50 hover:text-indigo-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeBacklogTab === "sprint" && (
              <div className="min-w-[240px]">
                <SimpleSelect
                  options={(sprints || []).map((s) => ({
                    value: s.Id,
                    label: s.Name,
                  }))}
                  value={selectedSprintId}
                  onChange={(value) => setSelectedSprintId(value)}
                  placeholder="Select sprint"
                  size="sm"
                />
              </div>
            )}
          </div>

          <div className="mt-4">
            {activeBacklogTab === "product" && canEditBacklog && (
              <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm">
                <span className="font-medium text-neutral-700">
                  {selectedProductIds.length} selected
                </span>
                <div className="min-w-[200px]">
                  <SimpleSelect
                    options={sprintOptions}
                    value={bulkTargetSprintId}
                    onChange={(value) => setBulkTargetSprintId(value)}
                    placeholder="Select sprint…"
                    size="sm"
                    variant="minimal"
                    disabled={!canManageSprints}
                  />
                </div>
                <CustomButton
                  text="Add to sprint"
                  variant="primary"
                  size="sm"
                  onClick={() =>
                    handleBulkAssignToSprint(
                      selectedProductIds,
                      bulkTargetSprintId,
                    )
                  }
                  loading={bulkAssignLoading}
                  disabled={
                    !canManageSprints ||
                    selectedProductIds.length === 0 ||
                    !bulkTargetSprintId
                  }
                />
              </div>
            )}

            {activeBacklogTab === "sprint" &&
              canEditBacklog &&
              selectedSprintIds.length > 0 && (
                <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm">
                  <span className="font-medium text-neutral-700">
                    {selectedSprintIds.length} selected
                  </span>
                  <CustomButton
                    text="Remove from sprint"
                    variant="cancel"
                    size="sm"
                    onClick={() =>
                      handleBulkRemoveFromSprint(
                        selectedSprintIds,
                        selectedSprintId,
                      )
                    }
                    loading={bulkAssignLoading}
                    disabled={!canManageSprints || !selectedSprintId}
                  />
                </div>
              )}

            <CustomDataTable
              columns={backlogColumns}
              data={backlogData.map((c) => ({ ...c, id: c.Id }))}
              loading={!!backlogLoading}
              searchable={false}
              paginated={false}
              selectable={
                canEditBacklog &&
                (activeBacklogTab === "product" ||
                  activeBacklogTab === "sprint")
              }
              selectedIds={
                activeBacklogTab === "product"
                  ? selectedProductIds
                  : activeBacklogTab === "sprint"
                    ? selectedSprintIds
                    : []
              }
              onSelectionChange={
                activeBacklogTab === "product"
                  ? setSelectedProductIds
                  : activeBacklogTab === "sprint"
                    ? setSelectedSprintIds
                    : undefined
              }
              emptyMessage="No backlog items"
              tableClassName="min-w-full divide-y divide-neutral-200"
              headerClassName="border-neutral-200"
              rowClassName="transition-colors"
            />
          </div>
        </div>
      )}

      {activeView === "sprints" && (
        <div className="px-4 sm:px-5 mt-3">
          <div
            className={`${isProjectReadOnly || !canManageSprints ? "hidden" : "flex items-center justify-end"}`}
          >
            <CustomButton
              text="Create sprint"
              variant="primary"
              onClick={() => setShowCreateSprint(true)}
              disabled={!canManageSprints}
              size="sm"
            />
          </div>
          {(isProjectReadOnly || !canManageSprints) && (
            <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              {isProjectReadOnly
                ? "Project is paused or closed. Changes are disabled."
                : "Sprints are available only when project status is Active."}
            </div>
          )}

          <div className="mt-4">
            <CustomDataTable
              columns={[
                {
                  key: "Name",
                  title: "Name",
                  sortable: true,
                  customRender: (row) => (
                    <div className="flex flex-col">
                      <span className="font-medium text-neutral-900">
                        {row.Name || "—"}
                      </span>
                      {row.Goal ? (
                        <span className="text-xs text-neutral-500">
                          {row.Goal}
                        </span>
                      ) : null}
                    </div>
                  ),
                },
                {
                  key: "Status",
                  title: "Status",
                  sortable: true,
                  customRender: (row) => (
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                        SPRINT_STATUS_CLASSES[row.Status] ||
                        "bg-neutral-100 text-neutral-700"
                      }`}
                    >
                      {SPRINT_STATUS_LABELS[row.Status] || row.Status}
                    </span>
                  ),
                },
                {
                  key: "StartDate",
                  title: "Start date",
                  sortable: true,
                  customRender: (row) => (
                    <span className="text-sm text-neutral-600">
                      {formatDate(row.StartDate)}
                    </span>
                  ),
                },
                {
                  key: "EndDate",
                  title: "End date",
                  sortable: true,
                  customRender: (row) => (
                    <span className="text-sm text-neutral-600">
                      {formatDate(row.EndDate)}
                    </span>
                  ),
                },
                {
                  key: "CapacitySnapshot",
                  title: "Capacity",
                  sortable: false,
                  customRender: (row) => {
                    const snapshot = row.CapacitySnapshot || {};
                    const hours = Object.values(snapshot).reduce(
                      (sum, value) => sum + (Number(value) || 0),
                      0,
                    );
                    const members = Object.keys(snapshot).length;
                    return (
                      <span className="text-sm text-neutral-600">
                        {members > 0
                          ? `${hours}h / ${members} member${members > 1 ? "s" : ""}`
                          : "—"}
                      </span>
                    );
                  },
                },
                {
                  key: "Actions",
                  title: "",
                  sortable: false,
                  customRender: (row) => (
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <CustomButton
                        text="Plan"
                        variant="ghost"
                        size="sm"
                        startIcon={<Users className="h-4 w-4" />}
                        onClick={() => openPlanSprint(row.Id)}
                        disabled={!canManageSprints}
                      />
                      <CustomButton
                        text="Edit"
                        variant="ghost"
                        size="sm"
                        startIcon={<Pencil className="h-4 w-4" />}
                        onClick={() => openEditSprint(row)}
                        disabled={!canManageSprints}
                      />
                      {(SPRINT_STATUS_TRANSITIONS[row.Status] || []).includes(
                        "active",
                      ) && (
                        <CustomButton
                          text="Start"
                          variant="primary"
                          size="sm"
                          startIcon={<Play className="h-4 w-4" />}
                          onClick={() =>
                            handleUpdateSprint(row.Id, { Status: "active" })
                          }
                          disabled={
                            !canManageSprints ||
                            (!row.CapacitySnapshot && row.Status === "planned")
                          }
                        />
                      )}
                      {(SPRINT_STATUS_TRANSITIONS[row.Status] || []).includes(
                        "completed",
                      ) && (
                        <CustomButton
                          text="Complete"
                          variant="primary"
                          size="sm"
                          startIcon={<CheckCircle className="h-4 w-4" />}
                          onClick={() =>
                            handleUpdateSprint(row.Id, { Status: "completed" })
                          }
                          disabled={!canManageSprints}
                        />
                      )}
                      {(SPRINT_STATUS_TRANSITIONS[row.Status] || []).includes(
                        "closed",
                      ) && (
                        <CustomButton
                          text="Close"
                          variant="cancel"
                          size="sm"
                          startIcon={<Lock className="h-4 w-4" />}
                          onClick={() =>
                            handleUpdateSprint(row.Id, { Status: "closed" })
                          }
                          disabled={!canManageSprints}
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => requestDeleteSprint(row.Id)}
                        className="rounded p-1 text-danger-600 hover:bg-danger-50"
                        disabled={!canManageSprints}
                        aria-label="Delete sprint"
                        title="Delete sprint"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ),
                },
              ]}
              data={(sprints || []).map((s) => ({ ...s, id: s.Id }))}
              loading={!!fetchSprintsState?.isLoading}
              searchable={false}
              paginated={false}
              emptyMessage="No sprints yet"
              tableClassName="min-w-full divide-y divide-neutral-200"
              headerClassName="border-neutral-200"
              rowClassName="transition-colors"
            />
          </div>
        </div>
      )}

      <Modal
        show={showCreateSprint}
        onClose={() => setShowCreateSprint(false)}
        title="Create sprint"
        size="md"
      >
        <form
          onSubmit={sprintForm.handleSubmit(handleCreateSprint)}
          className="space-y-4"
        >
          <CustomInput
            label="Sprint name"
            name="Name"
            placeholder="e.g. Sprint 12"
            register={sprintForm.register}
            errors={sprintForm.formState.errors}
            isRequired
            disabled={!canManageSprints}
          />
          <CustomInput
            label="Start date"
            name="StartDate"
            type="date"
            register={sprintForm.register}
            errors={sprintForm.formState.errors}
            isRequired
            disabled={!canManageSprints}
          />
          <CustomInput
            label="End date"
            name="EndDate"
            type="date"
            register={sprintForm.register}
            errors={sprintForm.formState.errors}
            isRequired
            disabled={!canManageSprints}
          />
          <TextArea
            label="Goal (optional)"
            name="Goal"
            placeholder="Sprint goal"
            register={sprintForm.register}
            errors={sprintForm.formState.errors}
            disabled={!canManageSprints}
          />
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-neutral-700">
              <Users className="h-4 w-4" />
              Capacity snapshot (hours)
            </div>
            <CapacityEditor form={sprintForm} disabled={!canManageSprints} />
          </div>
          {sprintError && (
            <div className="rounded-lg border border-danger-200 bg-danger-50 px-3 py-2 text-sm text-danger-700">
              {sprintError}
            </div>
          )}
          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end sm:gap-3">
            <CustomButton
              type="button"
              text="Cancel"
              variant="cancel"
              onClick={() => setShowCreateSprint(false)}
              className="w-full sm:w-auto"
              disabled={createSprintState?.isLoading}
            />
            <CustomButton
              type="submit"
              text="Create"
              variant="primary"
              className="w-full sm:w-auto"
              loading={createSprintState?.isLoading}
              disabled={!canManageSprints}
            />
          </div>
        </form>
      </Modal>

      <Modal
        show={showEditSprint}
        onClose={closeEditSprint}
        title="Edit sprint"
        size="md"
      >
        <form
          onSubmit={editSprintForm.handleSubmit((values) =>
            handleUpdateSprint(editSprintId, values, () => closeEditSprint()),
          )}
          className="space-y-4"
        >
          <CustomInput
            label="Sprint name"
            name="Name"
            placeholder="e.g. Sprint 12"
            register={editSprintForm.register}
            errors={editSprintForm.formState.errors}
            isRequired
            disabled={!canManageSprints}
          />
          <CustomInput
            label="Start date"
            name="StartDate"
            type="date"
            register={editSprintForm.register}
            errors={editSprintForm.formState.errors}
            isRequired
            disabled={!canManageSprints}
          />
          <CustomInput
            label="End date"
            name="EndDate"
            type="date"
            register={editSprintForm.register}
            errors={editSprintForm.formState.errors}
            isRequired
            disabled={!canManageSprints}
          />
          <TextArea
            label="Goal (optional)"
            name="Goal"
            placeholder="Sprint goal"
            register={editSprintForm.register}
            errors={editSprintForm.formState.errors}
            disabled={!canManageSprints}
          />
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-neutral-700">
              <Users className="h-4 w-4" />
              Capacity snapshot (hours)
            </div>
            <CapacityEditor
              form={editSprintForm}
              disabled={
                editSprintForm.watch("Status") !== "planned" ||
                !canManageSprints
              }
            />
            {editSprintForm.watch("Status") !== "planned" && (
              <p className="text-xs text-neutral-500">
                Capacity is locked once the sprint starts.
              </p>
            )}
          </div>
          <SimpleSelect
            label="Status"
            options={SPRINT_STATUS_OPTIONS}
            value={editSprintForm.watch("Status")}
            onChange={(value) => editSprintForm.setValue("Status", value)}
            placeholder="Select status…"
            disabled={!canManageSprints}
          />
          {sprintError && (
            <div className="rounded-lg border border-danger-200 bg-danger-50 px-3 py-2 text-sm text-danger-700">
              {sprintError}
            </div>
          )}
          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end sm:gap-3">
            <CustomButton
              type="button"
              text="Cancel"
              variant="cancel"
              onClick={closeEditSprint}
              className="w-full sm:w-auto"
              disabled={updateSprintState?.isLoading}
            />
            <CustomButton
              type="submit"
              text="Save"
              variant="primary"
              className="w-full sm:w-auto"
              loading={updateSprintState?.isLoading}
              disabled={!canManageSprints}
            />
          </div>
        </form>
      </Modal>

      <Modal
        show={showPlanSprint}
        onClose={closePlanSprint}
        title={`Plan sprint ${planSprint?.Name ? `· ${planSprint.Name}` : ""}`}
        size="xl"
      >
        <div className="space-y-5">
          {planSprint?.Status && planSprint.Status !== "planned" && (
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-600">
              Capacity snapshot locked for active sprint.
            </div>
          )}
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-neutral-800">
                  Product backlog
                </h3>
                <CustomButton
                  text="Add selected"
                  variant="primary"
                  size="sm"
                  onClick={() =>
                    handleBulkAssignToSprint(selectedProductIds, planSprintId)
                  }
                  loading={bulkAssignLoading}
                  disabled={
                    !canManageSprints ||
                    selectedProductIds.length === 0 ||
                    !planSprintId
                  }
                />
              </div>
              <CustomDataTable
                columns={[
                  { key: "Title", title: "Title", sortable: true },
                  { key: "Priority", title: "Priority", sortable: true },
                  { key: "EstimateHours", title: "Estimate", sortable: true },
                ]}
                data={(productBacklog?.data?.items || []).map((c) => ({
                  ...c,
                  id: c.Id,
                }))}
                loading={!!productBacklog?.isLoading}
                searchable={false}
                paginated={false}
                selectable={canEditBacklog}
                selectedIds={selectedProductIds}
                onSelectionChange={setSelectedProductIds}
                emptyMessage="No product backlog items"
                tableClassName="min-w-full divide-y divide-neutral-200"
                headerClassName="border-neutral-200"
                rowClassName="transition-colors"
              />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-neutral-800">
                  Sprint backlog
                </h3>
                <CustomButton
                  text="Remove selected"
                  variant="cancel"
                  size="sm"
                  onClick={() =>
                    handleBulkRemoveFromSprint(selectedSprintIds, planSprintId)
                  }
                  loading={bulkAssignLoading}
                  disabled={
                    !canManageSprints ||
                    selectedSprintIds.length === 0 ||
                    !planSprintId
                  }
                />
              </div>
              <CustomDataTable
                columns={[
                  { key: "Title", title: "Title", sortable: true },
                  { key: "Priority", title: "Priority", sortable: true },
                  { key: "EstimateHours", title: "Estimate", sortable: true },
                ]}
                data={(sprintBacklog?.data?.items || []).map((c) => ({
                  ...c,
                  id: c.Id,
                }))}
                loading={!!sprintBacklog?.isLoading}
                searchable={false}
                paginated={false}
                selectable={canEditBacklog}
                selectedIds={selectedSprintIds}
                onSelectionChange={setSelectedSprintIds}
                emptyMessage="No sprint backlog items"
                tableClassName="min-w-full divide-y divide-neutral-200"
                headerClassName="border-neutral-200"
                rowClassName="transition-colors"
              />
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmationModal
        show={!!cardToDeleteId}
        onClose={() => setCardToDeleteId(null)}
        onConfirm={confirmDeleteCard}
        title="Delete card"
        description="This card will be permanently removed. This cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={deleteCardState?.isLoading}
      />

      <ConfirmationModal
        show={!!listToDeleteId}
        onClose={() => setListToDeleteId(null)}
        onConfirm={confirmDeleteList}
        title="Delete list"
        description={`Delete "${listToDeleteTitle}"? All cards in it will be removed.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={deleteListState?.isLoading}
      />

      <ConfirmationModal
        show={!!sprintToDeleteId}
        onClose={() => setSprintToDeleteId(null)}
        onConfirm={confirmDeleteSprint}
        title="Delete sprint"
        description="This sprint will be permanently removed. This cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={deleteSprintState?.isLoading}
      />
    </div>
  );
}
