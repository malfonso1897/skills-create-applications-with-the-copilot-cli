/**
 * hr-app.js — Node.js CLI Human Resources application for SMEs (pymes)
 *
 * Features:
 *   - Employee management (add, list, search, remove)
 *   - Payroll calculation (gross salary, deductions, net pay)
 *   - Leave / vacation management
 *   - Department management
 *
 * Usage:
 *   node src/hr-app.js --help
 *   node src/hr-app.js add-employee
 *   node src/hr-app.js list-employees
 *   node src/hr-app.js payroll <employeeId>
 *   node src/hr-app.js add-leave <employeeId> <days>
 */

'use strict';

const readline = require('readline');
const { addition, subtraction, multiplication, division } = require('./calculator');

// ---------------------------------------------------------------------------
// In-memory data store (replace with a database for production use)
// ---------------------------------------------------------------------------
const store = {
  employees: [],
  nextId: 1,
};

// ---------------------------------------------------------------------------
// Employee management
// ---------------------------------------------------------------------------

/**
 * addEmployee: creates and stores a new employee record.
 * @param {string} name        Full name
 * @param {string} department  Department name
 * @param {number} baseSalary  Monthly gross salary
 * @returns {object} The created employee record
 */
function addEmployee(name, department, baseSalary) {
  const employee = {
    id: store.nextId++,
    name,
    department,
    baseSalary: Number(baseSalary),
    leaveBalance: 15, // default annual leave days
    createdAt: new Date().toISOString(),
  };
  store.employees.push(employee);
  return employee;
}

/**
 * listEmployees: returns all employee records.
 * @returns {Array}
 */
function listEmployees() {
  return store.employees;
}

/**
 * findEmployee: looks up an employee by id.
 * @param {number} id
 * @returns {object|undefined}
 */
function findEmployee(id) {
  return store.employees.find((e) => e.id === Number(id));
}

/**
 * removeEmployee: deletes an employee by id.
 * @param {number} id
 * @returns {boolean} true if removed, false if not found
 */
function removeEmployee(id) {
  const idx = store.employees.findIndex((e) => e.id === Number(id));
  if (idx === -1) return false;
  store.employees.splice(idx, 1);
  return true;
}

// ---------------------------------------------------------------------------
// Payroll calculation
// ---------------------------------------------------------------------------

const TAX_RATE = 0.15;          // 15 % income tax
const SOCIAL_SECURITY_RATE = 0.065; // 6.5 % social security contribution

/**
 * calculatePayroll: computes net pay for an employee.
 * Uses the calculator module for arithmetic operations.
 * @param {number} grossSalary
 * @returns {{ gross: number, tax: number, socialSecurity: number, net: number }}
 */
function calculatePayroll(grossSalary) {
  const tax = multiplication(grossSalary, TAX_RATE);
  const socialSecurity = multiplication(grossSalary, SOCIAL_SECURITY_RATE);
  const totalDeductions = addition(tax, socialSecurity);
  const net = subtraction(grossSalary, totalDeductions);

  return {
    gross: grossSalary,
    tax: Number(tax.toFixed(2)),
    socialSecurity: Number(socialSecurity.toFixed(2)),
    totalDeductions: Number(totalDeductions.toFixed(2)),
    net: Number(net.toFixed(2)),
  };
}

// ---------------------------------------------------------------------------
// Leave management
// ---------------------------------------------------------------------------

/**
 * addLeave: deducts leave days from an employee's balance.
 * @param {number} employeeId
 * @param {number} days
 * @returns {{ success: boolean, remaining: number, message: string }}
 */
function addLeave(employeeId, days) {
  const employee = findEmployee(employeeId);
  if (!employee) {
    return { success: false, remaining: 0, message: `Employee ${employeeId} not found` };
  }
  const requested = Number(days);
  if (requested > employee.leaveBalance) {
    return {
      success: false,
      remaining: employee.leaveBalance,
      message: `Insufficient leave balance. Available: ${employee.leaveBalance} day(s)`,
    };
  }
  employee.leaveBalance = subtraction(employee.leaveBalance, requested);
  return {
    success: true,
    remaining: employee.leaveBalance,
    message: `${requested} day(s) approved. Remaining balance: ${employee.leaveBalance}`,
  };
}

// ---------------------------------------------------------------------------
// Department summary
// ---------------------------------------------------------------------------

/**
 * departmentSummary: aggregates headcount and total payroll by department.
 * @returns {Array<{ department: string, headcount: number, totalGross: number }>}
 */
function departmentSummary() {
  const map = {};
  for (const emp of store.employees) {
    if (!map[emp.department]) {
      map[emp.department] = { department: emp.department, headcount: 0, totalGross: 0 };
    }
    map[emp.department].headcount = addition(map[emp.department].headcount, 1);
    map[emp.department].totalGross = addition(map[emp.department].totalGross, emp.baseSalary);
  }
  return Object.values(map);
}

// ---------------------------------------------------------------------------
// CLI entry point
// ---------------------------------------------------------------------------

function printHelp() {
  console.log(`
HR App — Sistema de Recursos Humanos para Pymes
================================================
Comandos disponibles / Available commands:

  add-employee   Add a new employee (interactive)
  list           List all employees
  payroll <id>   Show payroll details for employee <id>
  leave <id> <days>  Request leave days for employee <id>
  departments    Show department summary
  demo           Load sample data and show overview
  help           Show this help message
`);
}

function printEmployee(emp) {
  console.log(
    `  [${emp.id}] ${emp.name} | ${emp.department} | Salary: $${emp.baseSalary} | Leave: ${emp.leaveBalance} day(s)`
  );
}

async function promptEmployee(rl) {
  const ask = (q) =>
    new Promise((resolve) => rl.question(q, (a) => resolve(a.trim())));

  const name = await ask('Employee name: ');
  const department = await ask('Department: ');
  const salary = await ask('Monthly gross salary: ');
  return { name, department, salary };
}

async function runCLI(args) {
  const [, , command, ...rest] = args;

  if (!command || command === 'help' || command === '--help') {
    printHelp();
    return;
  }

  if (command === 'demo') {
    addEmployee('Ana García', 'Engineering', 3500);
    addEmployee('Luis Martínez', 'Sales', 2800);
    addEmployee('María López', 'Engineering', 3200);
    addEmployee('Carlos Ruiz', 'HR', 2600);
    console.log('\n=== Demo employees loaded ===');
  }

  if (command === 'add-employee' || command === 'demo') {
    if (command === 'add-employee') {
      const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
      const { name, department, salary } = await promptEmployee(rl);
      rl.close();
      const emp = addEmployee(name, department, salary);
      console.log(`\nEmployee added: [${emp.id}] ${emp.name}`);
    }
  }

  if (command === 'list' || command === 'demo') {
    const employees = listEmployees();
    if (employees.length === 0) {
      console.log('No employees found.');
    } else {
      console.log('\n=== Employee List ===');
      employees.forEach(printEmployee);
    }
  }

  if (command === 'payroll') {
    const id = rest[0];
    if (!id) {
      console.error('Usage: node hr-app.js payroll <id>');
      return;
    }
    const emp = findEmployee(id);
    if (!emp) {
      console.error(`Employee ${id} not found.`);
      return;
    }
    const payroll = calculatePayroll(emp.baseSalary);
    console.log(`\n=== Payroll for ${emp.name} ===`);
    console.log(`  Gross salary   : $${payroll.gross}`);
    console.log(`  Income tax     : $${payroll.tax}`);
    console.log(`  Social security: $${payroll.socialSecurity}`);
    console.log(`  Total deductions: $${payroll.totalDeductions}`);
    console.log(`  Net pay        : $${payroll.net}`);
  }

  if (command === 'leave') {
    const [id, days] = rest;
    if (!id || !days) {
      console.error('Usage: node hr-app.js leave <id> <days>');
      return;
    }
    const result = addLeave(id, days);
    console.log(result.message);
  }

  if (command === 'departments' || command === 'demo') {
    const summary = departmentSummary();
    if (summary.length === 0) {
      console.log('No department data available.');
    } else {
      console.log('\n=== Department Summary ===');
      summary.forEach((d) =>
        console.log(`  ${d.department}: ${d.headcount} employee(s), total gross $${d.totalGross}`)
      );
    }
  }
}

// ---------------------------------------------------------------------------
// Exports (for testing and programmatic use)
// ---------------------------------------------------------------------------
module.exports = {
  addEmployee,
  listEmployees,
  findEmployee,
  removeEmployee,
  calculatePayroll,
  addLeave,
  departmentSummary,
};

// Run CLI when executed directly
if (require.main === module) {
  runCLI(process.argv).catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}
