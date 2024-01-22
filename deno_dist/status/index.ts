export const PayPayStatusBase = [
  {
    success: true,
    status: 'LoginSuccess',
  },
  {
    success: false,
    status: 'LoginFailed',
  },
  {
    success: false,
    status: 'LoginIncorrectPassOrPhone',
  },
  {
    success: false,
    status: 'LoginNeedOTP',
  },
  {
    success: true,
    status: 'LoginDontNeedOTP',
  },
  {
    success: true,
    status: 'OTPLoginSuccess',
  },
  {
    success: false,
    status: 'OTPLoginFail',
  },
  {
    success: true,
    status: 'LoginAlreadySuccess',
  }
] as const

const _PayPayStatus = PayPayStatusBase.reduce<Record<typeof PayPayStatusBase[number]['status'], string>>((acc, cur) => {
  acc[cur.status] = cur.status
  return acc
}, {} as Record<typeof PayPayStatusBase[number]['status'], string>)

export const PayPayStatus = _PayPayStatus

export function statusof(status: typeof PayPayStatusBase[number]['status']): boolean {
  const result = PayPayStatusBase.find((item) => item.status === status)

  if (!result) return false

  return result.success
}