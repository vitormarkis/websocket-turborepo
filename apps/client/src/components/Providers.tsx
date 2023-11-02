"use client"
import React from "react"

import { ThemeProvider } from "next-themes"
import { UserProvider } from "@/hooks/user"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export type ProvidersProps = {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider defaultTheme="dark" attribute="class">
      <UserProvider>{children}</UserProvider>
      <ToastContainer
        enableMultiContainer
        containerId="SERIOUS"
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <ToastContainer
        enableMultiContainer
        containerId="HAPPY"
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </ThemeProvider>
  )
}
