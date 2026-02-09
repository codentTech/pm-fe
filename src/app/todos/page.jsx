"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import NAVBAR_TITLE from "@/common/constants/navbar-title.constant";
import TodoTracker from "@/components/todos/todo-tracker/todo-tracker.component";

export default function TodosPage() {
  return (
    <Auth
      component={<TodoTracker />}
      type={AUTH.PRIVATE}
      title={NAVBAR_TITLE.TODOS}
    />
  );
}
