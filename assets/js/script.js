
const expenseInput = document.getElementById('expenseInput')
const expenseDate = document.getElementById('expenseDate')
const errorMessage = document.getElementById('errorMessage')
const expenseType = document.getElementById('expenseType')
const addExpenseButton = document.getElementById('add-expense-button')

document.addEventListener('DOMContentLoaded', () => {
  addExpenseButton.addEventListener('click', addExpense)
  displayExpenses();
})

/**
 * Validates the expense input before adding a new expense.
 * Add error message to errorMessage dom element if validation fails.
 * @returns {boolean} True if the input is valid, otherwise return false.
 */

function validateExpenseInput() {
  if (expenseInput.value.trim() === '') {
    errorMessage.textContent = 'Expense input cannot be empty.'
    errorMessage.setAttribute('class', 'error-message')
    return false;
  }

  if (expenseDate.value === '') {
    errorMessage.textContent = 'Expense date cannot be empty.'
    errorMessage.setAttribute('class', 'error-message')
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
    const expenses = getExpenses()
    
    // create expense object for new expense
    const newExpense = {
      amount: expenseInput.value,
      date: expenseDate.value,
      type: expenseType.value
    }
    expenses.push(newExpense);
    saveExpenses(expenses)
    displayExpenses();

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
function displayExpenses() {
  const expenses = getExpenses();
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

    cellAmount.textContent = expense.amount;
    cellDate.textContent = expense.date;
    cellType.textContent = expense.type;

    // add buttons for actions (Edit and Remove)
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.setAttribute('id', 'edit-button')
    // ToDo: add click handler for edit button
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.setAttribute('id', 'remove-button')
    // ToDo: add click handler for remove button
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