import "express-async-errors"
import express, { NextFunction, Request, Response } from "express"
import { IConnect, IShowFarmingUsers } from "@shared"
import { UserRepositoryInMemory } from "./src/infra/repository/UsersRepositoryInMemory"
import { Farming } from "./src/infra/services/Farming"
import { createServer } from "node:http"
import { Server } from "socket.io"
import cors from "cors"

const usersRepository = new UserRepositoryInMemory()
const farming = new Farming(usersRepository)

export const usersSocketIDs = new Map()

const app = express()
app.use(cors())
app.use(express.json())
const server = createServer(app)
export const io = new Server({
  cors: {
    origin: "*",
  },
})

io.listen(4000)
io.on("connection", socket => {
  socket.on("user set credentials", (payload: IConnect) => {
    usersSocketIDs.set(payload.username, socket.id)
  })
  console.log(`SOCKET CONNECTED: ${socket.id}`)
})

app.get("/farming", (req, res) => {
  const users = usersRepository.getAll()
  const farmingUsers: IShowFarmingUsers[] = users.map(u => ({
    plan: {
      planMaxUsage: u.plan.maxUsage,
      usageLeft: u.plan.getUsageRemaining(),
      usages: u.plan.getUsage(),
    },
    username: u.username,
  }))
  return res.json(farmingUsers)
})

app.post("/farming/start/:username", (req, res) => {
  const { username } = req.params
  const user = farming.has(username)
  if (!user) {
    console.log(`[farming]: ${username} está farmando.`)
    farming.add(username)
    return res.send(`${username} is now farming`)
  }
  return res.send("user is already farming")
})

app.post("/farming/stop/:username", (req, res) => {
  const { username } = req.params
  const user = farming.has(username)
  if (user) {
    farming.remove(username)
    console.log(`[farming]: ${username} parou de farmar.`)
    return res.send(`${username} stop the farming`)
  }
  console.log({
    username,
    user,
  })

  return res.send(`User is not farming`)
})

app.use((error: Error, request: Request, response: Response, next: NextFunction) => {
  return response.json({
    message: "Error",
    msg: error.message,
  })
})

server.listen(3099, () => console.log("Server running on port 3099"))
