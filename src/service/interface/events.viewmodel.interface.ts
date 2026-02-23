export interface IEventsViewModel {
  events: any[]
  status: string
  totalCount: number
  totalPages: number
}

export interface IEventDetailViewModel {
  currentEvent: any | null
  detailStatus: string
}
