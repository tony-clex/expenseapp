document.addEventListener('DOMContentLoaded', function () {
  const descriptionInput = document.getElementById('description')
  const amountInput = document.getElementById('amount')
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

    transactions.forEach((t, index) => {
      const row = document.createElement('tr')
      const amountClass = t.amount < 0 ? 'amount-expense' : 'amount-income'

      row.innerHTML = `
        <td>${t.description}</td>
        <td class="${amountClass}">${t.amount.toFixed(2)}</td>
        <td>${t.type}</td>
        <td><button onclick="deleteTransaction(${index})">Delete</button></td>
      `

      transactionList.appendChild(row)

      if (t.amount > 0) totalIncome += t.amount
      else totalExpenses += Math.abs(t.amount)
    })

    totalIncomeDisplay.textContent = totalIncome.toFixed(2)
    totalExpensesDisplay.textContent = totalExpenses.toFixed(2)
    balanceDisplay.textContent = (totalIncome - totalExpenses).toFixed(2)
  }

  document.getElementById('add-btn').addEventListener('click', function () {
    const description = descriptionInput.value.trim()
    const amount = parseFloat(amountInput.value)

    if (!description || isNaN(amount) || amount === 0) {
      alert('Please enter a valid description and non-zero amount.')
      return
    }

    addTransaction({
      description,
      amount,
      type: amount > 0 ? 'Income' : 'Expense'
    })

    descriptionInput.value = ''
    amountInput.value = ''
  })

  window.deleteTransaction = deleteTransaction

  window.clearAll = function () {
    if (confirm('Are you sure you want to clear all transactions?')) {
      localStorage.removeItem('transactions')
      renderTransactions()
    }
  }

  renderTransactions()
})
