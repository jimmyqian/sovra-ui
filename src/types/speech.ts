/**
 * Web Speech API type declarations
 * These interfaces provide type safety for the Speech Recognition API
 */

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition
    webkitSpeechRecognition?: new () => SpeechRecognition
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  maxAlternatives: number
  serviceURI: string
  grammars: SpeechGrammarList

  start(): void
  stop(): void
  abort(): void

  onstart: ((this: SpeechRecognition, ev: Event) => void) | null
  onend: ((this: SpeechRecognition, ev: Event) => void) | null
  onresult:
    | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void)
    | null
  onerror:
    | ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void)
    | null
  onnomatch:
    | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void)
    | null
  onsoundstart: ((this: SpeechRecognition, ev: Event) => void) | null
  onsoundend: ((this: SpeechRecognition, ev: Event) => void) | null
  onspeechstart: ((this: SpeechRecognition, ev: Event) => void) | null
  onspeechend: ((this: SpeechRecognition, ev: Event) => void) | null
  onaudiostart: ((this: SpeechRecognition, ev: Event) => void) | null
  onaudioend: ((this: SpeechRecognition, ev: Event) => void) | null
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number
  readonly results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error:
    | 'no-speech'
    | 'aborted'
    | 'audio-capture'
    | 'network'
    | 'not-allowed'
    | 'service-not-allowed'
    | 'bad-grammar'
    | 'language-not-supported'
  readonly message: string
}

interface SpeechRecognitionResultList {
  readonly length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean
  readonly length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionAlternative {
  readonly transcript: string
  readonly confidence: number
}

interface SpeechGrammarList {
  readonly length: number
  item(index: number): SpeechGrammar
  [index: number]: SpeechGrammar
  addFromURI(src: string, weight?: number): void
  addFromString(string: string, weight?: number): void
}

interface SpeechGrammar {
  src: string
  weight: number
}

export type {
  SpeechRecognition,
  SpeechRecognitionEvent,
  SpeechRecognitionErrorEvent,
  SpeechRecognitionResultList,
  SpeechRecognitionResult,
  SpeechRecognitionAlternative,
  SpeechGrammarList,
  SpeechGrammar
}
