/** Lo mínimo de Google Identity Services (`accounts.google.com/gsi/client`) que usa el login. */
export type GoogleCredentialResponse = { credential: string }

type GoogleButtonOptions = {
  theme: 'outline' | 'filled_blue' | 'filled_black'
  size: 'large' | 'medium' | 'small'
  text: 'continue_with' | 'signin_with'
  shape: 'rectangular' | 'pill'
  width: number
  locale: string
}

export type GoogleIdentity = {
  initialize: (options: {
    client_id: string
    callback: (response: GoogleCredentialResponse) => void
  }) => void
  renderButton: (parent: HTMLElement, options: GoogleButtonOptions) => void
}

declare global {
  interface Window {
    google?: { accounts: { id: GoogleIdentity } }
  }
}
