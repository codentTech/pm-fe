"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AppNavbar from "@/common/components/app-navbar/app-navbar.component";
import AppSidebar from "@/common/components/app-sidebar/app-sidebar.component";
import NAVBAR_TITLE from "@/common/constants/navbar-title.constant";
import { checkExpiryDateOfToken } from "@/common/utils/access-token.util";
import { removeUser } from "@/common/utils/users.util";
import Loadar from "@/common/components/loadar/loadar.component";
import useAutoRedirection from "@/common/hooks/use-auto-redirection.hook";

export default function Private({ component, title = NAVBAR_TITLE.DOCUMENTS }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logoutLoader } = useSelector((state) => state?.auth);
  const router = useRouter();

  useEffect(() => {
    if (checkExpiryDateOfToken() !== true) {
      removeUser();
      router.push("/");
    }
  }, [router]);

  if (logoutLoader) {
    return <Loadar />;
  }

  return (
    <div className="dashboard-main">
      <div
        className={`fixed inset-0 z-40 bg-neutral-900/50 md:hidden ${sidebarOpen ? "block" : "hidden"}`}
        aria-hidden
        onClick={() => setSidebarOpen(false)}
      />
      <div
        className={`fixed inset-y-0 left-0 z-50 w-[260px] transform bg-white transition-transform duration-200 md:relative md:block ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <AppSidebar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col bg-background-secondary">
        <div className="navbar-main">
          <AppNavbar title={title} />
        </div>
        <div className="scroll-content scrollbar-thin">{component}</div>
      </div>
    </div>
  );
}

Private.propTypes = {
  component: PropTypes.element.isRequired,
  title: PropTypes.string,
};
