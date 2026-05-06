import { NextResponse } from "next/server";
import type { ZodError } from "zod";

export type ApiError = { code: string; message: string; issues?: unknown };
export type ApiSuccess<T> = { ok: true; data: T };
export type ApiFailure = { ok: false; error: ApiError };
export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export function ok<T>(data: T, status = 200) {
  return NextResponse.json<ApiSuccess<T>>({ ok: true, data }, { status });
}

export function fail(code: string, message: string, status: number, issues?: unknown) {
  return NextResponse.json<ApiFailure>(
    { ok: false, error: { code, message, ...(issues !== undefined && { issues }) } },
    { status }
  );
}

export function validationError(err: ZodError) {
  return fail("validation_error", "Validation failed", 422, err.flatten());
}
