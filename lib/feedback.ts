let audioContext: AudioContext | null = null

function context() {
  if (typeof window === 'undefined' || !window.AudioContext) return null
  audioContext ??= new window.AudioContext()
  if (audioContext.state === 'suspended') void audioContext.resume()
  return audioContext
}

export function tone(
  frequency: number,
  duration = 0.08,
  volume = 0.035,
) {
  const audio = context()
  if (!audio) return

  const oscillator = audio.createOscillator()
  const gain = audio.createGain()
  const now = audio.currentTime

  oscillator.frequency.value = frequency
  oscillator.type = 'sine'
  gain.gain.setValueAtTime(volume, now)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)
  oscillator.connect(gain)
  gain.connect(audio.destination)
  oscillator.start(now)
  oscillator.stop(now + duration)
}

export function vibrate(pattern: number | number[]) {
  if (typeof navigator === 'undefined' || !navigator.vibrate) return
  navigator.vibrate(pattern)
}
