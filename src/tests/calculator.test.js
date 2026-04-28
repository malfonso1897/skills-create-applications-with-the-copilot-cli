/**
 * calculator.test.js — Unit tests for calculator.js
 *
 * Tests cover:
 *   addition, subtraction, multiplication, division (basic operations)
 *   modulo, power, square root (extended operations)
 *   Edge cases: division by zero, modulo by zero, square root of negative
 */

'use strict';

const assert = require('assert');
const {
  addition,
  subtraction,
  multiplication,
  division,
  modulo,
  power,
  squareRoot,
} = require('../calculator');

let passed = 0;
let failed = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`  ✓ ${description}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${description}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

// ---------------------------------------------------------------------------
// addition tests
// ---------------------------------------------------------------------------
console.log('\naddition');
test('adds two positive numbers', () => {
  assert.strictEqual(addition(2, 3), 5);
});
test('adds a positive and a negative number', () => {
  assert.strictEqual(addition(10, -4), 6);
});
test('adds two zeros', () => {
  assert.strictEqual(addition(0, 0), 0);
});

// ---------------------------------------------------------------------------
// subtraction tests
// ---------------------------------------------------------------------------
console.log('\nsubtraction');
test('subtracts two positive numbers', () => {
  assert.strictEqual(subtraction(10, 4), 6);
});
test('returns a negative result', () => {
  assert.strictEqual(subtraction(3, 7), -4);
});

// ---------------------------------------------------------------------------
// multiplication tests
// ---------------------------------------------------------------------------
console.log('\nmultiplication');
test('multiplies two positive numbers', () => {
  assert.strictEqual(multiplication(3, 4), 12);
});
test('multiplies by zero', () => {
  assert.strictEqual(multiplication(5, 0), 0);
});
test('multiplies two negative numbers', () => {
  assert.strictEqual(multiplication(-3, -4), 12);
});

// ---------------------------------------------------------------------------
// division tests
// ---------------------------------------------------------------------------
console.log('\ndivision');
test('divides two positive numbers', () => {
  assert.strictEqual(division(10, 2), 5);
});
test('returns a decimal result', () => {
  assert.strictEqual(division(7, 2), 3.5);
});
test('throws on division by zero', () => {
  assert.throws(() => division(5, 0), /Division by zero/);
});

// ---------------------------------------------------------------------------
// modulo tests
// ---------------------------------------------------------------------------
console.log('\nmodulo');
test('returns the modulo of two positive numbers', () => {
  assert.strictEqual(modulo(10, 3), 1);
});
test('returns 0 when evenly divisible (modulo)', () => {
  assert.strictEqual(modulo(9, 3), 0);
});
test('throws on modulo by zero', () => {
  assert.throws(() => modulo(5, 0), /Modulo by zero/);
});

// ---------------------------------------------------------------------------
// power tests
// ---------------------------------------------------------------------------
console.log('\npower');
test('raises a number to a positive exponent', () => {
  assert.strictEqual(power(2, 10), 1024);
});
test('returns 1 for any number raised to the power of 0', () => {
  assert.strictEqual(power(99, 0), 1);
});
test('handles fractional exponents', () => {
  assert.strictEqual(power(4, 0.5), 2);
});

// ---------------------------------------------------------------------------
// square root tests
// ---------------------------------------------------------------------------
console.log('\nsquare root');
test('returns the square root of a perfect square', () => {
  assert.strictEqual(squareRoot(9), 3);
});
test('returns square root of 0', () => {
  assert.strictEqual(squareRoot(0), 0);
});
test('returns square root of a non-perfect square', () => {
  assert.ok(Math.abs(squareRoot(2) - 1.4142135623730951) < 1e-10);
});
test('throws on square root of a negative number', () => {
  assert.throws(() => squareRoot(-1), /negative/);
});

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  process.exit(1);
}
