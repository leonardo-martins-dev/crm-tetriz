export class DomainError extends Error {
  public readonly code: string
  public readonly statusCode: number

  constructor(message: string, code: string, statusCode: number = 400) {
    super(message)
    this.name = 'DomainError'
    this.code = code
    this.statusCode = statusCode
  }
}

export class NotFoundError extends DomainError {
  constructor(entity: string, id?: string) {
    const message = id
      ? `${entity} com id "${id}" não encontrado`
      : `${entity} não encontrado`
    super(message, 'NOT_FOUND', 404)
    this.name = 'NotFoundError'
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message: string = 'Não autorizado') {
    super(message, 'UNAUTHORIZED', 401)
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends DomainError {
  constructor(message: string = 'Acesso negado') {
    super(message, 'FORBIDDEN', 403)
    this.name = 'ForbiddenError'
  }
}

export class ValidationError extends DomainError {
  public readonly fields: Record<string, string>

  constructor(message: string, fields: Record<string, string> = {}) {
    super(message, 'VALIDATION_ERROR', 422)
    this.name = 'ValidationError'
    this.fields = fields
  }
}

export class ConflictError extends DomainError {
  constructor(message: string) {
    super(message, 'CONFLICT', 409)
    this.name = 'ConflictError'
  }
}

export class ExternalServiceError extends DomainError {
  constructor(service: string, message: string) {
    super(`[${service}] ${message}`, 'EXTERNAL_SERVICE_ERROR', 502)
    this.name = 'ExternalServiceError'
  }
}
