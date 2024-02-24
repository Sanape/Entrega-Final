export class CustomError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export class BadRequestError extends CustomError {
  constructor(message) {
    super(400, message);
  }
}

export class ServerError extends CustomError {
  constructor(message) {
    super(500, message);
  }
}

export class NotFoundError extends BadRequestError {
  constructor(entity = 'NotFound') {
    super(`${entity} not found`);
  }
}

export class NoDocumentUploadedError extends BadRequestError {
  constructor() {
    super(`No document was uploaded`);
  }
}

export class InvalidDocumentNameError extends BadRequestError {
  constructor() {
    super(
      `Invalid document name. Only valid names are: "Identificación", "Comprobante de domicilio", "Comprobante de estado de cuenta"`
    );
  }
}

export class UnauthenticatedError extends CustomError {
  constructor(message = 'Unauthenticated') {
    super(401, message);
  }
}

export class FilterNotProvidedError extends BadRequestError {
  constructor() {
    super('A filter value must be provided');
  }
}

export class SamePasswordError extends BadRequestError {
  constructor() {
    super('Cannot change to the same password');
  }
}

export class CannotAddProductToBoughtCartError extends BadRequestError {
  constructor() {
    super('You cannot add products to a purchased cart');
  }
}

export class CannotRemoveProductToBoughtCartError extends BadRequestError {
  constructor() {
    super('Products cannot be removed from a purchased cart');
  }
}

export class ProductNotAddedToCartError extends BadRequestError {
  constructor() {
    super("Product doesn't added to cart");
  }
}

export class CartNotFoundError extends NotFoundError {
  constructor() {
    super('Cart');
  }
}

export class ProductAlreadyAddedToCartError extends BadRequestError {
  constructor() {
    super('Product already added to cart');
  }
}

export class CartAlreadyBoughtError extends BadRequestError {
  constructor() {
    super('Cart already bought');
  }
}

export class EmptyCartError extends BadRequestError {
  constructor() {
    super('Cart is empty');
  }
}

export class ProductAlreadyBelongsToCategoryError extends BadRequestError {
  constructor(category) {
    super(`Product already belongs to ${category}`);
  }
}

export class ProductNotBelongsToCategoryError extends BadRequestError {
  constructor(category) {
    super(`Product doesn't belongs to ${category}`);
  }
}

export class ProductAlreadyBelongsToBrandError extends BadRequestError {
  constructor(brand) {
    super(`Product already belongs to ${brand}`);
  }
}
export class ProductNotBelongsToBrandError extends BadRequestError {
  constructor(brand) {
    super(`Product doesn't belongs to ${brand}`);
  }
}

export class UserAlreadyExistsError extends BadRequestError {
  constructor() {
    super(`User already exists`);
  }
}

export class EmailOrPasswordWrongError extends UnauthenticatedError {
  constructor() {
    super(`Email or password are wrong`);
  }
}

export class InvalidResetPasswordTokenError extends UnauthenticatedError {
  constructor() {
    super(`Invalid reset password token`);
  }
}

export class ResetPasswordTokenExpiredError extends UnauthenticatedError {
  constructor() {
    super(`Reset password token expired`);
  }
}

export class BadLoginMethodError extends BadRequestError {
  constructor() {
    super(`Bad login method`);
  }
}

export class AttributeNotAllowedError extends BadRequestError {
  constructor(attribute) {
    super(`Attribute ${attribute} is not allowed`);
  }
}

export class MissingAttributeError extends BadRequestError {
  constructor(attribute) {
    super(`The following attribute "${attribute}" is missing`);
  }
}

export class EmailIsRequiredError extends BadRequestError {
  constructor() {
    super(`Email is required`);
  }
}

export class InvalidEmailError extends BadRequestError {
  constructor() {
    super(`Invalid email address`);
  }
}

export class InvalidPasswordError extends BadRequestError {
  constructor() {
    super(
      `The value of 'password' attribute must have at least one lowercase letter, one uppercase letter, one digit, one special character, and be 8 characters or longer`
    );
  }
}

export class PasswordIsRequiredError extends BadRequestError {
  constructor() {
    super(`Password is required`);
  }
}

export class DatabaseConnectionFailedError extends ServerError {
  constructor(message) {
    super(`Connection to database failed, ERROR: ${message}`);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message = 'Unauthorized') {
    super(403, message);
  }
}

export class MissingDocumentationError extends UnauthorizedError {
  constructor(documentation) {
    super('You are missing the following documentation: ' + documentation);
  }
}

export class UserNotFoundError extends NotFoundError {
  constructor() {
    super('User');
  }
}

export class ProductNotFoundError extends NotFoundError {
  constructor() {
    super('Product');
  }
}
