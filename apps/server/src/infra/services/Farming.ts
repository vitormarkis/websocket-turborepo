import "express-async-errors"
import {
  StartFarming,
  IShowFarmingUsers,
  UsersRepository,
  IFarmingUsers,
  IStopFarmingUsers,
  IUserFindGold,
} from "@shared"
import { io, usersSocketIDs } from "../../.."

export class Farming {
  users: Set<string> = new Set()
  farming: Map<string, NodeJS.Timeout> = new Map()

  constructor(private readonly usersRepository: UsersRepository) {}

  has(username: string) {
    return this.users.has(username)
  }

  add(username: string) {
    const startFarming = new StartFarming(this.usersRepository)
    const user = this.usersRepository.get(username)
    const payload: IFarmingUsers = {
      createdAt: new Date(),
      username,
    }
    io.emit("user farming", payload)
    this.users.add(username)
    this.farming.set(
      username,
      setInterval(() => {
        console.log(`${username} farming.`)
        try {
          startFarming.execute(user)
          if (Math.random() >= 0.95) {
            console.log(`🎇 ${username} found gold!`)
            io.emit("user found gold", {
              username,
            } as IUserFindGold)
          }
        } catch (error) {
          if (error instanceof Error) {
            console.log(error.message)
            this.remove(username)
            const socketId = usersSocketIDs.get(username)
            io.to(socketId).emit("user usage maximum")
          }
        }
      }, 1000)
    )
  }

  remove(username: string) {
    const payload: IStopFarmingUsers = {
      username,
    }
    io.emit("user stop farming", payload)
    this.users.delete(username)

    clearInterval(this.farming.get(username))
  }
}
