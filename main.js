document.addEventListener('DOMContentLoaded', () => {
  const descriptionInput = document.getElementById('description')
  const amountInput = document.getElementById('amount')
  const transactionList = document.getElementById('transaction-list')
  const totalIncomeDisplay = document.getElementById('total-income')
  const totalExpensesDisplay = document.getElementById('total-expenses')
  const balanceDisplay = document.getElementById('balance')
  const toastContainer = document.getElementById('toast-container')
  const confirmModal = document.getElementById('confirm-modal')
  const confirmMessage = document.getElementById('confirm-text')
  const confirmYes = document.getElementById('confirm-yes')
  const confirmNo = document.getElementById('confirm-no')
  const clearAllBtn = document.getElementById('clear-all-btn')

  let transactions = JSON.parse(localStorage.getItem('transactions') ?? '[]')
  let pendingAction = null

  const saveTransactions = () => localStorage.setItem('transactions', JSON.stringify(transactions))

  const showToast = (msg, type = 'info') => {
    const toast = document.createElement('div')
    toast.className = `toast toast-${type}`
    toast.textContent = msg
    toastContainer.appendChild(toast)
    setTimeout(() => toast.remove(), 3000)
  }

  const renderTransactions = () => {
    transactionList.innerHTML = ''
    let totalIncome = 0
    let totalExpenses = 0

    transactions.forEach(({ description, amount, type }, index) => {
      const row = document.createElement('tr')
      row.innerHTML = `
        <td>${description}</td>
        <td class="${amount < 0 ? 'amount-expense' : 'amount-income'}">${amount.toFixed(2)}</td>
        <td>${type}</td>
        <td><button class="delete-btn" data-index="${index}">Delete</button></td>
      `
      transactionList.appendChild(row)

      if (amount > 0) totalIncome += amount
      else totalExpenses += Math.abs(amount)
    })

    totalIncomeDisplay.textContent = totalIncome.toFixed(2)
    totalExpensesDisplay.textContent = totalExpenses.toFixed(2)
    balanceDisplay.textContent = (totalIncome - totalExpenses).toFixed(2)

    transactionList.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = Number(btn.dataset.index)
        confirmAction(() => {
          transactions.splice(index, 1)
          saveTransactions()
          renderTransactions()
          showToast('Transaction deleted', 'info')
        }, 'Are you sure you want to delete this transaction?')
      })
    })
  }

  const confirmAction = (action, message) => {
    pendingAction = action
    confirmMessage.textContent = message
    confirmModal.style.display = 'flex'
  }

  confirmYes.addEventListener('click', () => {
    pendingAction?.()
    pendingAction = null
    confirmModal.style.display = 'none'
  })

  confirmNo.addEventListener('click', () => {
    pendingAction = null
    confirmModal.style.display = 'none'
  })

  document.getElementById('add-btn').addEventListener('click', () => {
    const description = descriptionInput.value.trim()
    const amount = Number(amountInput.value)
    if (!description || !amount) return showToast('Enter valid description and non-zero amount', 'error')

    transactions.push({
      description,
      amount,
      type: amount > 0 ? 'Income' : 'Expense'
    })
    saveTransactions()
    renderTransactions()
    showToast('Transaction added', 'success')
    descriptionInput.value = ''
    amountInput.value = ''
  })

  clearAllBtn.addEventListener('click', () => {
    confirmAction(() => {
      transactions = []
      saveTransactions()
      renderTransactions()
      showToast('All transactions cleared', 'info')
    }, 'Are you sure you want to clear all transactions?')
  })

  confirmModal.style.display = 'none'
  renderTransactions()
})
