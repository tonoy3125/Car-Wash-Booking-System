export type TDurationUnit = 'Minutes' | 'Hours'

export type TService = {
  image: string
  icon: string
  name: string
  description: string
  price: number
  duration: number
  durationUnit: TDurationUnit
  isDeleted: boolean
}
