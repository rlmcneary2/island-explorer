export function stringToBoolean(value?: string, defaultResult = true): boolean {
  if ((value ?? null) === null) {
    return defaultResult;
  }

  return (value as string).toLowerCase() === "true"
    ? true
    : (value as string).toLowerCase() === "false"
    ? false
    : defaultResult;
}
