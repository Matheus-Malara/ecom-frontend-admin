export interface StandardResponse<T> {
    timestamp: string
    status: number
    message: string
    path: string
    traceId: string
    data: T
    errorCode?: string
}
