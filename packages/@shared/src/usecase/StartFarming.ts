import { User, UsersRepository } from "../.."

export class StartFarming {
  constructor(private readonly usersRepo: UsersRepository) {}

  execute(user: User) {
    user.plan.use()
    this.usersRepo.update(user)
  }
}
