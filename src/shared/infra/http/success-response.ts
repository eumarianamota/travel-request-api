export interface SuccessResponseBody<T> {
  success: true
  data: T
}

export const toSuccessResponseBody = <T>(data: T): SuccessResponseBody<T> => ({
  success: true,
  data,
})
