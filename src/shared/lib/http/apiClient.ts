import { ApiError, CLIENT_ERROR_CODE, type ErrorDto } from './ApiError'

const DEFAULT_TIMEOUT_MS = 10_000
const HTTP_UNAUTHORIZED = 401

type ApiClientConfig = {
  baseUrl: string
  getAccessToken: () => string | undefined
  /** Se llama cuando el gateway rechaza el token (401). */
  onUnauthorized: () => void
}

let config: ApiClientConfig | undefined

export function configureApiClient(apiClientConfig: ApiClientConfig) {
  config = apiClientConfig
}

type RequestConfig = {
  body?: unknown
  params?: Record<string, unknown>
  headers?: Record<string, string>
}

async function request<T>(
  method: string,
  endpoint: string,
  { body, params, headers }: RequestConfig = {},
): Promise<T> {
  if (!config)
    throw new Error('apiClient sin configurar: llamá a configureApiClient() al arrancar.')

  const response = await send(method, buildUrl(config.baseUrl, endpoint, params), {
    body,
    headers: { ...buildAuthHeader(config.getAccessToken()), ...headers },
  })

  if (response.status === HTTP_UNAUTHORIZED) config.onUnauthorized()
  if (!response.ok) throw await toApiError(response)

  // Un 2xx sin body (no solo el 204) rompe res.json(): se lee como texto primero.
  const text = await response.text()
  if (!text) return undefined as T
  return JSON.parse(text) as T
}

function buildUrl(baseUrl: string, endpoint: string, params?: Record<string, unknown>) {
  const url = new URL(`${baseUrl}${endpoint}`)
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value != null && value !== '') url.searchParams.set(key, String(value))
  })
  return url
}

function buildAuthHeader(token: string | undefined): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function send(
  method: string,
  url: URL,
  { body, headers }: Required<Pick<RequestConfig, 'headers'>> & Pick<RequestConfig, 'body'>,
) {
  // fetch no tiene timeout propio: el AbortController corta el request a los DEFAULT_TIMEOUT_MS.
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS)
  const isJsonBody = body != null && !(body instanceof FormData) && !(body instanceof Blob)

  try {
    return await fetch(url, {
      method,
      signal: controller.signal,
      headers: { ...(isJsonBody && { 'Content-Type': 'application/json' }), ...headers },
      body: body == null ? undefined : isJsonBody ? JSON.stringify(body) : (body as BodyInit),
    })
  } catch (error) {
    throw toClientError(error)
  } finally {
    clearTimeout(timer)
  }
}

function toClientError(error: unknown): ApiError {
  const isTimeout = error instanceof Error && error.name === 'AbortError'
  return new ApiError(
    isTimeout
      ? { error: CLIENT_ERROR_CODE.TIMEOUT, message: 'El servidor tardó demasiado', status: 408 }
      : {
          error: CLIENT_ERROR_CODE.NETWORK,
          message: 'No se pudo conectar con el servidor',
          status: 0,
        },
    { cause: error },
  )
}

async function toApiError(response: Response): Promise<ApiError> {
  const body: unknown = await response.json().catch(() => undefined)
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

export const apiClient = {
  get: <T>(url: string, cfg?: RequestConfig) => request<T>('GET', url, cfg),
  post: <T>(url: string, body?: unknown, cfg?: RequestConfig) =>
    request<T>('POST', url, { ...cfg, body }),
  put: <T>(url: string, body?: unknown, cfg?: RequestConfig) =>
    request<T>('PUT', url, { ...cfg, body }),
  patch: <T>(url: string, body?: unknown, cfg?: RequestConfig) =>
    request<T>('PATCH', url, { ...cfg, body }),
  delete: <T>(url: string, cfg?: RequestConfig) => request<T>('DELETE', url, cfg),
}
