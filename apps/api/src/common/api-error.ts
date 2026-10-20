/** API hata kodları (docs/plan.md §8); HTTP durumlarıyla birlikte `ApiError` taşır. */
export type ApiErrorCode =
  | 'validation_error'
  | 'unauthorized'
  | 'forbidden'
  | 'case_locked'
  | 'not_found'
  | 'state_version_mismatch'
  | 'session_not_active'
  | 'session_not_completed'
  | 'validation_required'
  | 'version_not_draft'
  | 'legal_review_required'
  | 'action_rejected'
  | 'idempotency_key_reused'
  | 'rate_limited'
  | 'internal_error';

export interface FieldError {
  path: string;
  message: string;
}

/** İstemciye `{message, error, requestId, errors?, reason?}` zarfıyla dönen hata. */
export class ApiError extends Error {
  readonly status: number;
  readonly code: ApiErrorCode;
  readonly errors: FieldError[] | undefined;
  readonly reason: string | undefined;

  constructor(
    status: number,
    code: ApiErrorCode,
    message: string,
    extra: { errors?: FieldError[]; reason?: string } = {},
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.errors = extra.errors;
    this.reason = extra.reason;
  }
}

/** Var olmayan ya da başkasına ait kaynak: ikisi de aynı yanıtı alır. */
export const notFound = (message = 'Kayıt bulunamadı.'): ApiError => new ApiError(404, 'not_found', message);
