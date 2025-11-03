document.addEventListener('DOMContentLoaded', function () {
  const incomeDesc = document.getElementById('income-description')
  const incomeAmount = document.getElementById('income-amount')
  const expenseDesc = document.getElementById('expense-description')
  const expenseAmount = document.getElementById('expense-amount')
  const expenseCategory = document.getElementById('expense-category')
  const transactionList = document.getElementById('transaction-list')
  const totalIncomeDisplay = document.getElementById('total-income')
  const totalExpensesDisplay = document.getElementById('total-expenses')
  const balanceDisplay = document.getElementById('balance')

  function getTransactions() {
    return JSON.parse(localStorage.getItem('transactions') || '[]')
  }

  function saveTransactions(transactions) {
    localStorage.setItem('transactions', JSON.stringify(transactions))
  }

  function addTransaction(transaction) {
    const transactions = getTransactions()
    transactions.push(transaction)
    saveTransactions(transactions)
    renderTransactions()
  }

  function deleteTransaction(index) {
    const transactions = getTransactions()
    transactions.splice(index, 1)
    saveTransactions(transactions)
    renderTransactions()
  }

  function renderTransactions() {
    const transactions = getTransactions()
    transactionList.innerHTML = ''

    let totalIncome = 0
    let totalExpenses = 0

    transactions.forEach((transaction, index) => {
      const row = document.createElement('tr')
      row.innerHTML = `
        <td>${transaction.description}</td>
        <td>${transaction.category || '-'}</td>
        <td>${transaction.amount.toFixed(2)}</td>
        <td>${transaction.type}</td>
        <td><button onclick="deleteTransaction(${index})">Delete</button></td>
      `
      transactionList.appendChild(row)

      if (transaction.type === 'Income') {
        totalIncome += transaction.amount
      } else {
        totalExpenses += transaction.amount
      }
    })

    totalIncomeDisplay.textContent = totalIncome.toFixed(2)
    totalExpensesDisplay.textContent = totalExpenses.toFixed(2)
    balanceDisplay.textContent = (totalIncome - totalExpenses).toFixed(2)
  }

  window.addIncome = function () {
    const description = incomeDesc.value.trim()
    const amount = parseFloat(incomeAmount.value)

    if (!description || isNaN(amount) || amount <= 0) {
      alert('Please enter a valid income description and amount.')
      return
    }

    addTransaction({
      type: 'Income',
      description,
      amount
    })

    incomeDesc.value = ''
    incomeAmount.value = ''
  }

  window.addExpense = function () {
    const description = expenseDesc.value.trim()
    const amount = parseFloat(expenseAmount.value)
    const category = expenseCategory.value

    if (!description || isNaN(amount) || amount <= 0) {
      alert('Please enter a valid expense description and amount.')
      return
    }

    addTransaction({
      type: 'Expense',
      description,
      amount,
      category
    })

    expenseDesc.value = ''
    expenseAmount.value = ''
    expenseCategory.value = 'Housing'
  }

  window.deleteTransaction = deleteTransaction

  window.clearAll = function () {
    if (confirm('Are you sure you want to clear all transactions?')) {
      localStorage.removeItem('transactions')
      renderTransactions()
    }
  }

  renderTransactions()
})
