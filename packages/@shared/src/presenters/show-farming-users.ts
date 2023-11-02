export interface IShowFarmingUsers {
  username: string
  plan: {
    planMaxUsage: number
    usages: number
    usageLeft: number
  }
}
