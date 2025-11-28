export function successResponse(data: any) {
  return { ok: true, data };
}

export function errorResponse(message: string) {
  return { ok: false, error: message };
}
