import { expireSession, getAccessToken } from '@/shared/lib/session'
import { ApiError, CLIENT_ERROR_CODE, type ErrorDto } from './ApiError'

const HTTP_UNAUTHORIZED = 401
const HTTP_NO_CONTENT = 204

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type ApiRequestOptions = {
  method?: HttpMethod
  body?: unknown
  signal?: AbortSignal
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const response = await send(path, options)

  if (response.status === HTTP_UNAUTHORIZED) expireSession()
  if (!response.ok) throw await toApiError(response)
  if (response.status === HTTP_NO_CONTENT) return undefined as T

  return (await response.json()) as T
}

async function send(path: string, { method = 'GET', body, signal }: ApiRequestOptions) {
  const baseUrl = import.meta.env.TICKETYA_API_BASE_URL ?? ''
  try {
    return await fetch(`${baseUrl}${path}`, {
      method,
      headers: buildHeaders(body !== undefined),
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    })
  } catch (error) {
    throw new ApiError(
      {
        error: CLIENT_ERROR_CODE.NETWORK,
        message: 'No se pudo conectar con el servidor',
        status: 0,
      },
      { cause: error },
    )
  }
}

function buildHeaders(hasBody: boolean): HeadersInit {
  const token = getAccessToken()
  return {
    ...(hasBody && { 'Content-Type': 'application/json' }),
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

async function toApiError(response: Response): Promise<ApiError> {
  const body = await response.json().catch(() => undefined)
  if (isErrorDto(body)) return new ApiError(body)

  return new ApiError({
    error: CLIENT_ERROR_CODE.UNEXPECTED_RESPONSE,
    message: `El servidor respondió ${response.status} sin el formato de error esperado`,
    status: response.status,
  })
}

function isErrorDto(body: unknown): body is ErrorDto {
  return typeof body === 'object' && body !== null && 'error' in body && 'message' in body
}
