import { User } from "../entity/User"

export interface UsersRepository {
  get(username: string): User
  update(user: User): void
  getAll(): User[]
}
