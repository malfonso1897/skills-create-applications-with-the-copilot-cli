/**
 * calculator.js — Arithmetic utility module for the HR app (RRHH para pymes)
 *
 * Supported operations:
 *   addition       — adds two numbers
 *   subtraction    — subtracts one number from another
 *   multiplication — multiplies two numbers
 *   division       — divides one number by another (throws on division by zero)
 *   modulo         — returns the remainder of a division
 *   power          — raises a base to an exponent
 *   squareRoot     — returns the square root of a number (throws on negative input)
 */

/**
 * addition: returns the sum of a and b.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function addition(a, b) {
  return a + b;
}

/**
 * subtraction: returns the difference of a minus b.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function subtraction(a, b) {
  return a - b;
}

/**
 * multiplication: returns the product of a and b.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function multiplication(a, b) {
  return a * b;
}

/**
 * division: returns a divided by b.
 * Throws an error on division by zero.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function division(a, b) {
  if (b === 0) {
    throw new Error('Division by zero is not allowed');
  }
  return a / b;
}

/**
 * modulo: returns the remainder of a divided by b.
 * Throws an error when b is zero.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function modulo(a, b) {
  if (b === 0) {
    throw new Error('Modulo by zero is not allowed');
  }
  return a % b;
}

/**
 * power: returns base raised to the given exponent.
 * @param {number} base
 * @param {number} exponent
 * @returns {number}
 */
function power(base, exponent) {
  return Math.pow(base, exponent);
}

/**
 * squareRoot: returns the square root of n.
 * Throws an error for negative numbers.
 * @param {number} n
 * @returns {number}
 */
function squareRoot(n) {
  if (n < 0) {
    throw new Error('Cannot compute square root of a negative number');
  }
  return Math.sqrt(n);
}

module.exports = {
  addition,
  subtraction,
  multiplication,
  division,
  modulo,
  power,
  squareRoot,
};
