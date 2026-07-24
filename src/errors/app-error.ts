export class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class BadRequestError extends AppError {
  constructor(m = "Bad Request") {
    super(400, m);
  }
}

export class UnauthorizedError extends AppError {
  constructor(m = "Unauthorized") {
    super(401, m);
  }
}

export class ForbiddenError extends AppError {
  constructor(m = "Forbidden") {
    super(403, m);
  }
}

export class NotFoundError extends AppError {
  constructor(m = "Not Found") {
    super(404, m);
  }
}

export class ConflictError extends AppError {
  constructor(m = "Conflict") {
    super(409, m);
  }
}

