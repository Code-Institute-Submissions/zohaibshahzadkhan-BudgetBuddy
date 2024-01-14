
const expenseInput = document.getElementById('expenseInput');
const expenseDate = document.getElementById('expenseDate');
const errorMessage = document.getElementById('errorMessage');
const expenseType = document.getElementById('expenseType');
const addExpenseButton = document.getElementById('add-expense-button');
const startFilterDate = document.getElementById('startFilterDate');
const endFilterDate = document.getElementById('endFilterDate');
const searchButton = document.getElementById('search-button');
const filterErrorMessage = document.getElementById('filter-error-message');
const editExpenseAmount = document.getElementById('editExpenseAmount');
const editExpenseDate = document.getElementById('editExpenseDate');
const editExpenseType = document.getElementById('editExpenseType');
const editPanelErrorMessage = document.getElementById('editPanelErrorMessage');
const editModal = document.getElementById('edit-modal');
const summaryButton = document.getElementById('summary-button');
const summaryContainer = document.getElementById('summaryContainer');
const summaryTableContainer = document.getElementById('summaryContainer');
const summaryTableBody = document.querySelector('#summaryTable tbody');
const saveButton = document.getElementById('save-button');

document.addEventListener('DOMContentLoaded', () => {
  addExpenseButton.addEventListener('click', addExpense);
  searchButton.addEventListener('click', filterExpensesByDateRange);
  summaryButton.addEventListener('click', generateSummary);
  saveButton.addEventListener('click', saveEditedExpense);
  displayExpenses();
  calculateTotalExpense();
});

/**
 * Validates the expense input before adding a new expense.
 * Add error message to errorMessage dom element if validation fails.
 * @returns {boolean} True if the input is valid, otherwise return false.
 */

function validateExpenseInput() {
  if (expenseInput.value === '') {
    errorMessage.textContent = 'Expense input cannot be empty.';
    errorMessage.setAttribute('class', 'error-message');
    return false;
  }

  if (expenseDate.value === '') {
    errorMessage.textContent = 'Expense date cannot be empty.';
    errorMessage.setAttribute('class', 'error-message');
    return false;
  }
  return true;
}
/**
 * Adds a new expense to the list, updates the display, and resets input fields.
 * Validates the expense input before adding.
 */
function addExpense() {
  errorMessage.textContent = '';
  if (validateExpenseInput()) {
    // expenses array will hold list of expense object
    const expenses = getExpenses();

    // create expense object for new expense
    const newExpense = {
      amount: expenseInput.value,
      date: expenseDate.value,
      type: expenseType.value
    };
    expenses.push(newExpense);
    saveExpenses(expenses);
    displayExpenses();
    calculateTotalExpense();

    // Reset element values
    expenseInput.value = '';
    expenseDate.value = '';
    expenseType.value = 'Food & Dining';
  }
}

/**
 * Displays the expenses in a table body on the HTML page.
 * @param {Array} [expenses] - Array of expense objects to display in the table.
 */
function displayExpenses(expensesToShow = null) {
  const expenses = expensesToShow || getExpenses();
  const expenseTableBody = document.querySelector('#expenseTable tbody');
  // reset table body to avoid duplication of list 
  expenseTableBody.innerHTML = '';
  expenses.forEach((expense, index) => {
    const row = expenseTableBody.insertRow();
    // add cells for expense details
    const cellAmount = row.insertCell(0);
    const cellDate = row.insertCell(1);
    const cellType = row.insertCell(2);
    const cellActions = row.insertCell(3);

    cellAmount.textContent = `$${expense.amount}`;
    cellDate.textContent = expense.date;
    cellType.textContent = expense.type;

    // add buttons for actions (Edit and Remove)
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.setAttribute('id', 'edit-button');
    editButton.onclick = () => openEditModal(index);
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.setAttribute('id', 'remove-button');
    removeButton.onclick = () => removeExpense(index);
    cellActions.appendChild(editButton);
    cellActions.appendChild(removeButton);
  });
}

/**
 * Retrieves the list of expenses from local storage.
 * @returns {Array} An array of expense objects.
 */
function getExpenses() {
  // get items from local storage else set empty array
  const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  return expenses;
}

/**
 * Saves the given array of expenses to local storage.
 * @param {Array} expenses - An array of expense objects to be saved.
 */
function saveExpenses(expenses) {
  // store expenses values ([{},{}]) in expenses key
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

/**
 * Filters and displays expenses based on the selected date range.
 */
function filterExpensesByDateRange() {
  filterErrorMessage.textContent = '';
  if (validateStartAndEndDate()) {
    // filter expense values that are either in between or equal to start and end date
    const filteredExpenses = getExpenses().filter(expense => {
      return expense.date >= startFilterDate.value && expense.date <= endFilterDate.value;
    });
    displayExpenses(filteredExpenses);
    calculateTotalExpense(filteredExpenses);
  }
}

/**
 * Validates the value of start and end date elements before performing a search.
 * Add error message to errorMessage dom element if validation fails.
 * @returns {boolean} True if the input is valid, otherwise return false.
 */

function validateStartAndEndDate() {
  if (startFilterDate.value === '' || endFilterDate.value === '') {
    filterErrorMessage.textContent = 'Please provide both start and end dates for filtering.';
    filterErrorMessage.setAttribute('class', 'error-message');
    return false;
  }
  if (startFilterDate.value > endFilterDate.value) {
    filterErrorMessage.textContent = 'Invalid end date. Please provide valid end date';
    filterErrorMessage.setAttribute('class', 'error-message');
    return false;
  }
  return true;
}

/**
 * Removes the expense at the specified index.
 * @param {number} index - The index of the expense to be removed.
 */
function removeExpense(index) {
  const expenses = getExpenses();
  expenses.splice(index, 1);
  saveExpenses(expenses);
  displayExpenses();
  calculateTotalExpense();
}

/**
 * Opens a modal for editing the selected expense.
 * @param {number} index - The index of the expense to be edited.
 */
function openEditModal(index) {
  const expenses = getExpenses();
  editExpenseAmount.value = expenses[index].amount;
  editExpenseDate.value = expenses[index].date;
  editExpenseType.value = expenses[index].type;
  editModal.style.display = 'block';
  // set data-index attribute to modal which will used as a reference at time of updating expense
  editModal.setAttribute('data-index', index);
}

/**
 * Saves the edited expense after modification.
 */
function saveEditedExpense() {
  const index = document.getElementById('edit-modal').getAttribute('data-index');
  const expenses = getExpenses();
  if (editExpenseAmount.value !== '') {
    editPanelErrorMessage.textContent = '';
    expenses[index].amount = editExpenseAmount.value;
    expenses[index].date = editExpenseDate.value;
    expenses[index].type = editExpenseType.value;
    saveExpenses(expenses);
    displayExpenses();
    calculateTotalExpense();
    closeModal();
  } else {
    editPanelErrorMessage.textContent = "Please enter valid amount";
    editPanelErrorMessage.setAttribute('class', 'error-message');
  }
}

/**
 * Closes the edit modal without saving changes.
 */
function closeModal() {
  editModal.style.display = 'none';
  editModal.removeAttribute('data-index');
}

/**
 * Generates and displays a summary of total expenses by category for the selected date range.
 */

function generateSummary() {
  if (validateStartAndEndDate()) {
    filterErrorMessage.textContent = '';
    const filteredExpenses = getExpenses().filter(expense => {
      return expense.date >= startFilterDate.value && expense.date <= endFilterDate.value;
    });
    const summary = calculateCategorySummary(filteredExpenses);
    displaySummary(summary);
    // Show the summary container
    summaryContainer.style.display = 'block';
  }
}

/**
 * Calculates the total expense amount by categories.
 * @param {Array} expenses - An array of expense objects.
 * @returns {Object} An object with expense categories as keys and total amounts as values.
 */
function calculateCategorySummary(expenses) {
  const summary = {};

  expenses.forEach(expense => {
    const { type } = expense;
    const key = type;
    summary[key] = (summary[key] || 0) + parseFloat(expense.amount || 0); // Assuming each expense has an "amount" property
  });
  return summary;
}

/**
 * Displays the summary on the HTML page.
 * @param {Object} summary - An object with expense categories as keys and total amounts as values.
 */
function displaySummary(summary) {
  summaryTableBody.innerHTML = '';
  Object.keys(summary).forEach(key => {
    const amount = summary[key];
    const row = summaryTableBody.insertRow();
    const cellType = row.insertCell(0);
    const cellAmount = row.insertCell(1);
    cellType.textContent = key;
    cellAmount.textContent = `$${amount.toFixed(2)}`;
  });
  // Show the summary table container
  summaryTableContainer.style.display = 'block';
}

/**
 * Calculates and updates the total expense amount on the HTML page.
 * @param {Array} [expensesToShow] - An optional array of expense objects to calculate the total from.
 */
function calculateTotalExpense(expensesToShow = null) {
  const expenses = expensesToShow || getExpenses();
  const totalExpense = document.getElementById('total-expense');
  let total = 0;

  expenses.forEach((expense) => {
    total += parseFloat(expense.amount);
  });

  totalExpense.textContent = total.toFixed(2);
}