import { User, type UsersRepository } from "@shared"

export class UserRepositoryInMemory implements UsersRepository {
  users: User[] = []

  constructor() {}

  getAll(): User[] {
    return this.users
  }

  update(user: User): void {
    this.users = this.users.map(currentUser => (currentUser.username === user.username ? user : currentUser))
  }

  get(username: string): User {
    const foundUser = this.users.find(u => u.username === username)
    if (!foundUser) {
      const newUser = new User(username)
      this.users.push(newUser)
      return newUser
    }
    return foundUser
  }
}
