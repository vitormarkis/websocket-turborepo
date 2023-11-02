"use client"
import React from "react"
import { cn } from "@/lib/utils"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useUser } from "@/hooks/user"
import { useEffect, useState } from "react"
import { socket } from "@/socket"
import { IConnect, IFarmingUsers, IStopFarmingUsers, IUserFindGold } from "@shared"
import { toast } from "react-toastify"

export type HomeLayoutProps = React.ComponentPropsWithoutRef<"div"> & {}

export const HomeLayout = React.forwardRef<React.ElementRef<"div">, HomeLayoutProps>(
  function HomeLayoutComponent({ className, ...props }, ref) {
    const [username, setUsername] = useState("")
    const { user, setUser } = useUser()

    const [isConnected, setIsConnected] = useState(socket.connected)
    const [farmingUsers, setFarmingUsers] = useState<IFarmingUsers[]>([])

    const handleSetUser = () => {
      const payload: IConnect = { username }
      socket.emit("user set credentials", payload)
      setUser({ username })
    }

    const handleStartFarm = async () => {
      if (!user) return
      const response = await fetch(`http://localhost:3099/farming/start/${user.username}`, { method: "POST" })
      if (response.headers.get("content-type") === "application/json") {
        const data = await response.json()
        return console.log(data)
      }
      console.log({
        response,
      })
    }

    const handleStopFarm = async () => {
      if (!user) return
      const response = await fetch(`http://localhost:3099/farming/stop/${user.username}`, { method: "POST" })
      if (response.headers.get("content-type") === "application/json") {
        const data = await response.json()
        return console.log(data)
      }
      console.log({
        response,
      })
    }

    useEffect(() => {
      function onConnect() {
        setIsConnected(true)
      }

      function onDisconnect() {
        setIsConnected(false)
      }

      function onUserFarming(newUserFarming: IFarmingUsers) {
        setFarmingUsers(prevState => [...prevState, newUserFarming])
      }

      function onUserStopFarming(stopFarmingUser: IStopFarmingUsers) {
        setFarmingUsers(prevState => prevState.filter(st => st.username !== stopFarmingUser.username))
      }

      function onUserUsageMaximum() {
        toast.error("Seu pacote acabou.", {
          containerId: "SERIOUS",
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        })
      }

      function onUserFindGold({ username }: IUserFindGold) {
        console.log(`🎇 ${username} found gold!`)
        toast.success(`🎇 ${username} found gold!`, {
          containerId: "HAPPY",
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        })
      }

      socket.on("connect", onConnect)
      socket.on("disconnect", onDisconnect)
      socket.on("user farming", onUserFarming)
      socket.on("user stop farming", onUserStopFarming)
      socket.on("user usage maximum", onUserUsageMaximum)
      socket.on("user found gold", onUserFindGold)

      return () => {
        socket.off("connect", onConnect)
        socket.off("disconnect", onDisconnect)
        socket.off("user farming", onUserFarming)
        socket.off("user stop farming", onUserStopFarming)
        socket.off("user usage maximum", onUserUsageMaximum)
        socket.off("user found gold", onUserFindGold)
      }
    }, [])

    return (
      <div {...props} className={cn("", className)} ref={ref}>
        <div className="h-screen flex flex-col">
          <pre className="absolute right-0 left-0 top-0">
            {JSON.stringify({ isConnected, user }, null, 2)}
          </pre>
          <div className="right-8 top-8 absolute flex flex-col gap-2 rounded-md py-1 px-2 max-w-[15rem] w-full border bg-background">
            <span>
              Currently: {farmingUsers.length} user{farmingUsers.length === 1 ? "" : "s"} farming.
            </span>
            {/* {farmingUsers.length <= 0 && (
              <div className="leading-none py-1.5 text-sm px-2 rounded-md bg-neutral-800 text-white">
                <span>there is no one farming</span>
              </div>
            )}
            {farmingUsers.length > 0 &&
              farmingUsers.map(farmingUser => (
                <div className="leading-none py-1.5 text-sm px-2 rounded-md bg-sky-600 text-white">
                  <span>{farmingUser.username} is farming...</span>
                </div>
              ))} */}
          </div>
          <div className="my-auto max-w-7xl px-8 w-full">
            <div className="flex flex-col gap-8">
              <div className="max-w-sm w-full mx-auto p-4 rounded-md border">
                <Label htmlFor="">Your name:</Label>
                <div className="flex gap-8">
                  <Input
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="bg-neutral-800"
                  />
                  <Button onClick={handleSetUser}>Enviar</Button>
                </div>
              </div>
              <div className="max-w-sm w-full mx-auto p-4 flex justify-between rounded-md border">
                <Button onClick={handleStartFarm}>Start Farm</Button>
                <Button onClick={handleStopFarm} variant="ghost">
                  Stop Farm
                </Button>
              </div>
              <div className="max-w-sm w-full mx-auto p-4 flex justify-between rounded-md border">
                <Button onClick={() => socket.connect()}>Connect</Button>
                <Button onClick={() => socket.disconnect()} variant="ghost">
                  Disconnect
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

HomeLayout.displayName = "HomeLayout"
