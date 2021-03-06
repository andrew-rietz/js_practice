// NOTE: Defining separate modules as IIFE to ensure separate scopes

var dataController = (function() {
    // Responsible for tracking / updating the underlying data

    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    }

    Expense.prototype.calcPercentage = function(totalIncome){
        if (totalIncome > 0){
            this.percentage = Math.round(this.value / totalIncome * 100);
        } else {
            this.percentage = 0
        }
    }

    Expense.prototype.getPercentage = function(){
        return this.percentage
    }


    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var data = {
        cashflow: {
            income: [],
            expense: [],
        },
        totals: {
            overall: 0,
            income: 0,
            expense: 0,
        },
        pct: {
            overall: -1,
        }
    }

    var _addRecord = function(incomeOrExpense, description, value){
        var newRecord, ID;

        // set ID to the last ID in the array, + 1
        if (data.cashflow[incomeOrExpense].length > 0) {
            ID = data.cashflow[incomeOrExpense][data.cashflow[incomeOrExpense].length - 1].id + 1;
        } else {
            ID = 0;
        }

        if (incomeOrExpense === "income"){
            newRecord = new Income(ID, description, value);
        } else {
            newRecord = new Expense(ID, description, value);
        }
        data.cashflow[incomeOrExpense].push(newRecord);
        return newRecord
    }

    var _delRecord = function(id){
        var incomeOrExpense__idNumber, incomeOrExpense, idNumber;
        incomeOrExpense__idNumber = id.split("-")
        incomeOrExpense = incomeOrExpense__idNumber[0]
        idNumber = Number(incomeOrExpense__idNumber[1])

        for (var i = 0; i < data.cashflow[incomeOrExpense].length; i++) {
            if (data.cashflow[incomeOrExpense][i].id === idNumber) {
                data.cashflow[incomeOrExpense].splice(i, 1)
                return
            }
        }
    }

    var _setTotals = function() {
        data.totals.income = sumCashflow(data.cashflow.income)
        data.totals.expense = sumCashflow(data.cashflow.expense)
        data.totals.overall = data.totals.income - data.totals.expense
        data.pct.overall = data.totals.income ? 
                           Math.round(data.totals.expense / data.totals.income * 100) : 
                           -1
    }

    var _getTotals = function() {
        return {
            income: data.totals.income,
            expenses: data.totals.expense,
            overall: data.totals.overall,
            pct: data.pct.overall,
        }
    }

    var _setPercents = function(){
        data.cashflow.expense.forEach( function(expense) {
            expense.calcPercentage(data.totals.income);
        });
    }

    var _getPercents = function(){
        var expensePercents = data.cashflow.expense.map(function(element){
            return {
                id: element.id,
                pct: element.getPercentage(),
            }
        })
        return expensePercents;
    }

    var sumCashflow = function(cashflow) {
        return cashflow.reduce(
            callbackFn=function(total, currentItem) {
                return total + currentItem.value
            },
            initialValue=0)
    }

    return {
        addRecord: _addRecord,
        delRecord: _delRecord,
        setTotals: _setTotals,
        getTotals: _getTotals,
        setPercents: _setPercents,
        getPercents: _getPercents,
        data: data,
    }

})();

var UIController = (function() {
    // Responsible for updating the UI

    var DOMelements = {
        inputIncomeOrExpense: document.querySelector(".add__type"),
        inputDescription: document.querySelector(".add__description"),
        inputValue: document.querySelector(".add__value"),
        inputButton: document.querySelector(".add__btn"),
        tableContainer: document.querySelector(".container"),
        budgetSummaryValue: document.querySelector(".budget__value"),
        incomeSummaryValue: document.querySelector(".budget__income--value"),
        incomeSummaryPct: document.querySelector(".budget__income--percentage"),
        incomeTable: document.querySelector(".income__list"),
        expenseSummaryValue: document.querySelector(".budget__expenses--value"),
        expenseSummaryPct: document.querySelector(".budget__expenses--percentage"),
        expenseTable: document.querySelector(".expenses__list"),
        bannerMonth: document.querySelector(".budget__title--month"),
    }

    var _updateSummaryDisplay = function(overallBudget, overallIncome, overallExpenses, overallPct) {
        DOMelements.budgetSummaryValue.textContent = _formatNumber(overallBudget);
        DOMelements.incomeSummaryValue.textContent = _formatNumber(overallIncome);
        DOMelements.expenseSummaryValue.textContent = _formatNumber(overallExpenses);
        DOMelements.expenseSummaryPct.textContent =  overallPct > 0 ? overallPct + "%" : "---";

        // elementVisibility = overallPct <= 0 ? "hidden" : "visible"
        // DOMelements.expenseSummaryPct.style.visibility = elementVisibility
    }

    var _addRowToTabularDisplay = function(tableRecord, incomeOrExpense, overallPct) {
        var pct_html = (incomeOrExpense === "expense") ? `<div class="item__percentage">---</div>` : ``
        var html = `<div class="item clearfix" id="${incomeOrExpense}-${tableRecord.id}">`
                    + `<div class="item__description">${tableRecord.description}</div>`
                    + `<div class="right clearfix">`
                    + `<div class="item__value">${_formatNumber(tableRecord.value)}</div>`
                    + `${pct_html}`
                    + `<div class="item__delete">`
                    + `<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>`
                    + `</div></div></div>`
        
        // Insert html into the DOM
        DOMelements[incomeOrExpense + "Table"].insertAdjacentHTML("beforeend", html)
    }

    var _delRowFromTabularDisplay = function(elementToRemove) {
        elementToRemove.remove();
    }

    var _clearFields = function(){
        fieldsToClear = [DOMelements.inputDescription,
                         DOMelements.inputValue];
        fieldsToClear.forEach( function(field) {
            field.value = '';
        });
        DOMelements.inputDescription.focus()
    }

    var _setExpensePercentages = function(expenses){
        // each expense is an object of the format: {id: element.id, pct: element.percentage}
        expenses.forEach( function(element){
            tableRecord = document.getElementById("expense-" + element.id)
            pctElement = tableRecord.querySelector(".item__percentage")
            pctElement.textContent = element.pct ? element.pct + "%" : "---"
        })
    }

    var _formatNumber = function(number){
        formatted = Number(number.toFixed(2)).toLocaleString(undefined, {minimumFractionDigits: 2})
        return formatted
    }

    var _changeInputColors = function() {
        DOMelements.inputIncomeOrExpense.classList.toggle("red-focus");
        DOMelements.inputDescription.classList.toggle("red-focus");
        DOMelements.inputValue.classList.toggle("red-focus");

        DOMelements.inputButton.classList.toggle("red");
    }

    return {
        getInputs: function(){
            return {
                incomeOrExpense: DOMelements.inputIncomeOrExpense.value, // either 'income' or 'expense'
                description: DOMelements.inputDescription.value,
                value: Number(DOMelements.inputValue.value),
            }
        },
        getDOMelements: function(){
            return DOMelements
        },
        updateSummaryDisplay: _updateSummaryDisplay,
        addRowToTabularDisplay: _addRowToTabularDisplay,
        delRowFromTabularDisplay: _delRowFromTabularDisplay,
        setExpensePercentages: _setExpensePercentages,
        changeInputColors: _changeInputColors,
        clearFields: _clearFields,
    }

})();

var appController = (function(dataCtrlr, UICtrlr) {
    // Ties the data and UI portions together and tells each when to execute

    var setupEventListeners = function () {
        var DOM = UICtrlr.getDOMelements()

        DOM.inputButton.addEventListener("click", _addItem);
        document.addEventListener("keypress", function(e){ // Pass the event object to the function
            if (e.key === "Enter") { _addItem() } // Access the 'key' attribute of the event object
        })

        DOM.tableContainer.addEventListener("click", _deleteTableItem);
        DOM.inputIncomeOrExpense.addEventListener("change", UICtrlr.changeInputColors)
    }

    var setMonth = function(){
        var DOM = UICtrlr.getDOMelements()
        var today = new Date();
        var months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ]
        DOM.bannerMonth.textContent = months[today.getMonth()];
    }

    var _addItem = function() {
        // Get the form inputs (add__type, add__description, add__value)
        var newRecord;
        var pageInputs = UICtrlr.getInputs();

        if (pageInputs.description.trim() === "" && pageInputs.value === 0) { return }
        
        // Add the item to our underlying data
        newRecord = dataCtrlr.addRecord(
            pageInputs.incomeOrExpense,
            pageInputs.description,
            pageInputs.value
        );
        UICtrlr.clearFields()

        _updateSummary();

        // Add the item to the table at the bottom of the screen
        UICtrlr.addRowToTabularDisplay(newRecord, pageInputs.incomeOrExpense);
        _updateExpensePercentages();
    }

    var _deleteTableItem = function(event) {
        var tableRowID, elementToRemove;
        tableRowID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (!tableRowID){ return }

        elementToRemove = document.getElementById(tableRowID);
        
        dataCtrlr.delRecord(tableRowID);
        UICtrlr.delRowFromTabularDisplay(elementToRemove);
        _updateSummary();
        _updateExpensePercentages();
    }

    var _updateSummary = function(){
        // // Calculate the overall budget
        dataCtrlr.setTotals()

        totals = dataCtrlr.getTotals()

        // Display the overall budget
        UICtrlr.updateSummaryDisplay(
            totals.overall,
            totals.income,
            totals.expenses,
            totals.pct)
    }

    var _updateExpensePercentages = function() {
        dataCtrlr.setPercents();
        expensePercents = dataCtrlr.getPercents();
        UICtrlr.setExpensePercentages(expensePercents)
    }

    return {
        init: function() {
            setupEventListeners();
            setMonth();
        }
    }
    

})(dataController, UIController);

appController.init()