import { writable } from 'svelte/store'

export const childLockNext = writable(false)
export const childLockPrev = writable(false)
export const childTitle = writable(null)
export const childFocus = writable(false)

export function lockNav(lock) {
  childLockPrev.set(lock)
  childLockNext.set(lock)
}
