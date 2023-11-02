"use client"

import { HomeLayout } from "@/components/layouts/home"
import React, { useEffect } from "react"

export default function Home() {
  const [isMounted, setIsMounted] = React.useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return isMounted ? <HomeLayout /> : null
}
