"use client";
import React, { useState } from "react";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { Brain, Menu, X } from "lucide-react";

function Header() {
  const path = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Questions", path: "/questions" },
    { name: "Upgrade", path: "/dashboard/upgrade" },
    { name: "How it Works?", path: "/how" },
  ];

  return (
    <header className="sticky top-0 z-30 bg-gradient-to-r from-blue-50 via-white to-purple-100 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent select-none">
            AI Interview Mocker
          </span>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-6 ml-8">
          {navLinks.map((link) => (
            <li
              key={link.path}
              onClick={() => router.push(link.path)}
              className={`relative px-3 py-1 rounded-lg cursor-pointer transition-all duration-200
                ${
                  path === link.path
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold scale-105 shadow"
                    : "text-blue-700 hover:bg-blue-100 hover:scale-105 hover:shadow font-medium"
                }
              `}
            >
              {link.name}
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 ml-2"
          onClick={() => setIsMenuOpen((v) => !v)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* User Button */}
        <div className="ml-4">
          <UserButton />
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur shadow-lg border-t border-gray-200">
          <ul className="flex flex-col gap-2 px-4 py-4">
            {navLinks.map((link) => (
              <li
                key={link.path}
                onClick={() => {
                  setIsMenuOpen(false);
                  router.push(link.path);
                }}
                className={`px-3 py-2 rounded-lg cursor-pointer transition-all duration-200
                  ${
                    path === link.path
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold scale-105 shadow"
                      : "text-blue-700 hover:bg-blue-100 hover:scale-105 hover:shadow font-medium"
                  }
                `}
              >
                {link.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}

export default Header;
