export function SingletonMixin() {
  let instance: any = null

  return class SingletonClass {
    constructor() {
      if (instance) return instance
      instance = this
    }
  }
}
