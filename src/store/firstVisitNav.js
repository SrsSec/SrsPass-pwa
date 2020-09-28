import { writable } from 'svelte/store'

export const childLockNext = writable(false)
export const childLockPrev = writable(false)
export const childTitle = writable(null)
