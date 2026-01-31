"use client";

import PropTypes from "prop-types";

export default function AppNavbar({ title }) {
  return (
    <header className="flex h-16 shrink-0 items-center border-b border-neutral-200 bg-white px-6 shadow-sm">
      <h1 className="text-xl font-semibold text-neutral-800">{title}</h1>
    </header>
  );
}

AppNavbar.propTypes = {
  title: PropTypes.string.isRequired,
};
