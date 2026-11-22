import { useState } from 'react'

export function useEventSearchBox() {
  const [text, setText] = useState('')

  return { text, setText }
}
