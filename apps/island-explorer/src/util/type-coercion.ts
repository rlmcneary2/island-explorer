export function stringToBoolean(value: string, defaultResult = true): boolean {
  if ((value ?? null) === null) {
    return defaultResult;
  }

  return value.toLowerCase() === "true"
    ? true
    : value.toLowerCase() === "false"
    ? false
    : defaultResult;
}
