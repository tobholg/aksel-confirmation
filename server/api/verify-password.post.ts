// /server/api/verify-password.post.ts
import { H3Event, createError, readBody } from 'h3'

const PASSWORD = 'the password..'
const TARGET_DATE_ISO = '2025-04-26'          // 25 Apr 2025 in ISO (Europe/Oslo)

export default defineEventHandler(async (event: H3Event) => {
  const { password } = await readBody<{ password?: string }>(event)

  if (!password)
    throw createError({ statusCode: 400, statusMessage: 'Password missing' })

  // Today in Europe/Oslo as YYYY-MM-DD
  const todayOslo = new Date().toLocaleDateString('en-CA', {
    timeZone: 'Europe/Oslo',
  })

  const passwordCorrect = password === PASSWORD
  const dateCorrect     = todayOslo === TARGET_DATE_ISO

  /* NEW ────────────────────────────────────────── */
  if (dateCorrect && !passwordCorrect) {
    return { success: false, message: "Wrong! Hint: enter 'the password..'" }
  }
  /* ────────────────────────────────────────────── */

  return {
    success: passwordCorrect && dateCorrect,
  }
})