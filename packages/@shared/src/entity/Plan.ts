export class Plan {
  readonly maxUsage: number = 20 // seconds
  usagesList: number[] = []

  use() {
    if (this.maxUsage <= this.usagesList.length) {
      throw new Error("maximum usaged reached")
    }
    this.usagesList.push(1)
  }

  getUsage() {
    return this.usagesList.length
  }

  getUsageRemaining() {
    return this.maxUsage - this.usagesList.length
  }
}
