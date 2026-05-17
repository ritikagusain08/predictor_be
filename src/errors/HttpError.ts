
export class HttpError extends Error {   //main parent class. All other errors will come from this
    public readonly statusCode: number;
    public readonly code?: string;

    constructor(
      statusCode: number,  // status code of the error. HTTP status (400, 404, etc.)
      message: string,  // message of the error. Human-readable error message
      code?: string  // code of the error. custom internal error code
    ) {
      super(message) //Passes message to built-in Error class. 
      this.statusCode = statusCode;
      this.code = code;
      this.name = 'HttpError' //Sets the name of the error to 'HttpError'
    }
  }
  
  //specific errors using inheritance
  export class BadRequestError extends HttpError {  // Extends parent class HttpError
    constructor(message: string, code?: string) { 
      super(400, message, code) // Calls the constructor of the parent class HttpError with the status code 400, message, and code
      this.name = 'BadRequestError' // Sets the name of the error to 'BadRequestError'
    }
  }
  
  export class UnauthorizedError extends HttpError {  
    constructor(message = 'Unauthorized', code?: string) {  //Default message provided
      super(401, message, code)
      this.name = 'UnauthorizedError'
    }
  }
  
  export class ForbiddenError extends HttpError {
    constructor(message = 'Forbidden', code?: string) {
      super(403, message, code)
      this.name = 'ForbiddenError'
    }
  }
  
  export class NotFoundError extends HttpError {
    constructor(message: string, code?: string) {
      super(404, message, code)
      this.name = 'NotFoundError'
    }
  }
  
  export class ConflictError extends HttpError {
    constructor(message: string, code?: string) {
      super(409, message, code)
      this.name = 'ConflictError'
    }
  }