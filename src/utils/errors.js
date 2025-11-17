export class AppError extends Error {
  constructor(message, type = 'GENERAL') {
    super(message);
    this.name = this.constructor.name;
    this.type = type;
  }
}

export class ValidationError extends AppError{
    constructor(messages) {
        super(Array.isArray(messages) ? messages.join('; ') : messages);
        this.name = 'ValidationError';
        this.messages = Array.isArray(messages) ? messages : [messages];
    }
}

export class NotFoundError extends AppError {
    constructor(message){
        super(message);
        this.name = 'NotFoundError';
    }
}

export class NetworkError extends AppError {
  constructor(message) {
    super(message);
    this.name = 'NetworkError';
  }
}