"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrganizations,
  fetchOrEnsureDefault,
} from "@/provider/features/organizations/organizations.slice";
import AppNavbar from "@/common/components/app-navbar/app-navbar.component";
import AppSidebar from "@/common/components/app-sidebar/app-sidebar.component";
import ErrorBoundary from "@/common/components/error-boundary/error-boundary.component";
import NAVBAR_TITLE from "@/common/constants/navbar-title.constant";
import { checkExpiryDateOfToken } from "@/common/utils/access-token.util";
import { removeUser } from "@/common/utils/users.util";
import Loadar from "@/common/components/loadar/loadar.component";
import useNotificationsSocket from "@/common/hooks/use-notifications-socket.hook";

export default function Private({ component, title = NAVBAR_TITLE.DOCUMENTS }) {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useNotificationsSocket();
  const { logoutLoader } = useSelector((state) => state?.auth);
  const { organizations, currentOrganizationId } = useSelector(
    (state) => state?.organizations || {},
  );
  const router = useRouter();

  useEffect(() => {
    if (checkExpiryDateOfToken() !== true) {
      removeUser();
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    if (!organizations?.length && !currentOrganizationId) {
      dispatch(fetchOrEnsureDefault());
    } else if (!organizations?.length) {
      dispatch(fetchOrganizations());
    }
  }, [organizations?.length, currentOrganizationId, dispatch]);

  if (logoutLoader) {
    return <Loadar />;
  }

  return (
    <div className="dashboard-main">
      <a
        href="#main-content"
        className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:block focus:w-auto focus:h-auto focus:px-4 focus:py-2.5 focus:m-0 focus:overflow-visible focus:clip-auto focus:whitespace-normal focus:rounded-lg focus:bg-primary-600 focus:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      >
        Skip to main content
      </a>
      <div
        className={`fixed inset-0 z-40 bg-neutral-900/50 md:hidden ${sidebarOpen ? "block" : "hidden"}`}
        aria-hidden
        onClick={() => setSidebarOpen(false)}
      />
      <aside
        className={`dashboard-main__sidebar fixed inset-y-0 left-0 z-50 w-[280px] max-w-[85vw] transform border-r border-neutral-200 bg-white shadow-xl transition-transform duration-200 ease-out md:relative md:max-w-none md:w-[260px] md:translate-x-0 md:shadow-none ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        aria-label="Main navigation"
      >
        <AppSidebar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      </aside>
      <main
        id="main-content"
        className="dashboard-main__main flex min-w-0 flex-1 flex-col bg-background-secondary"
        role="main"
      >
        <div className="navbar-main">
          <AppNavbar
            title={title}
            onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          />
        </div>
        <div className="scroll-content scrollbar-thin min-h-0 flex-1 bg-background-secondary">
          <ErrorBoundary
            onRetry={() => window.location.reload()}
            onGoHome={() => router.push("/")}
          >
            {component}
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}

Private.propTypes = {
  component: PropTypes.element.isRequired,
  title: PropTypes.string,
};
