import { Plan } from "./Plan"

export class User {
  readonly username: string
  readonly plan: Plan = new Plan()

  constructor(username: string) {
    this.username = username
  }
}
