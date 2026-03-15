"use client";

import React from "react";
import { Theme } from "@/domain/types/types";

interface FooterProps {
  theme: Theme;
}

const Footer: React.FC<FooterProps> = ({ theme }) => {
  return (
    <footer
      className="border-t px-4 sm:px-6 md:px-8 py-6"
      style={{
        borderColor: theme.border.medium,
        backgroundColor: theme.background.primary,
      }}
    >
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-xs" style={{ color: theme.text.tertiary }}>
          © {new Date().getFullYear()} VitaLink. All rights reserved. Data provided for demonstration purposes.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
