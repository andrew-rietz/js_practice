// NOTE: Defining separate modules as IIFE to ensure separate scopes

var dataController = (function() {
    // Responsible for tracking / updating the underlying data

    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
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
            income: 0,
            expense: 0,
        }
    }

    var _addRecord = function(incomeOrExpense, description, value){
        if (incomeOrExpense === "income"){
            data.cashflow.income.push(new Income(
                data.cashflow.income.length,
                description,
                value
            ))
        } else {
            data.cashflow.expense.push(new Expense(
                data.cashflow.expense.length,
                description,
                value
            ))
        }
    }

    var sumCashflow = function(cashflow) {
        return cashflow.reduce(
            callbackFn=function(total, currentItem) {
                return total + currentItem
            },
            initialValue=0)
    }

    return {
        addRecord: _addRecord,
        getTotalIncome: sumCashflow(data.cashflow.income),
        getTotalExpenses: sumCashflow(data.cashflow.expense),
        getTotal: sumCashflow(Array.prototype.concat(
            data.cashflow.income, data.cashflow.expense)
        ),
    }

})();

var UIController = (function() {
    // Responsible for updating the UI

    var DOMelements = {
        inputIncomeOrExpense: document.querySelector(".add__type"),
        inputDescription: document.querySelector(".add__description"),
        inputValue: document.querySelector(".add__value"),
        inputButton: document.querySelector(".add__btn"),
        budgetSummaryValue: document.querySelector(".budget__value"),
        incomeSummaryValue: document.querySelector(".budget__income--value"),
        incomeSummaryPct: document.querySelector(".budget__income--percentage"),
        expenseSummaryValue: document.querySelector(".budget__expenses--value"),
        expenseSummaryPct: document.querySelector(".budget__expenses--percentage"),
    }

    var _updateDisplay = function(overallBudget, overallIncome, overallExpenses) {
        DOMelements.budgetSummaryValue.textContent = overallBudget;
        DOMelements.incomeSummaryValue.textContent = overallIncome;
        // DOMelements.incomeSummaryPct.textContent = overallIncome / overallBudget;
        DOMelements.expenseSummaryValue.textContent = overallExpenses;
        DOMelements.expenseSummaryPct.textContent = overallExpenses / overallIncome;
    }

    return {
        getInputs: function(){
            return {
                incomeOrExpense: DOMelements.inputIncomeOrExpense.value, // either 'income' or 'expense'
                description: DOMelements.inputDescription.value,
                value: DOMelements.inputValue.value,
            }
        },
        getDOMelements: function(){
            return { DOMelements }
        },
        updateDisplay: _updateDisplay,
    }

})();

var appController = (function(dataCtrlr, UICtrlr) {
    // Ties the data and UI portions together and tells each when to execute

    var setupEventListeners = function () {
        DOM = UICtrlr.DOMelements;

        // Initial entry into the app is dependent on the <button> 'add__button'
        DOM.inputButton.addEventListener("click", _addItem);
        document.addEventListener("keypress", function(e){ // Pass the event object to the function
            if (e.key === "Enter") { _addItem() } // Access the 'key' attribute of the event object
        })
    }

    var _addItem = function() {
        // Get the form inputs (add__type, add__description, add__value)
        var pageInputs = UICtrlr.getInputs();
        
        // Add the item to our underlying data
        dataCtrlr.addRecord(
            pageInputs.incomeOrExpense,
            pageInputs.description,
            pageInputs.value
        );

        // // Calculate the overall budget
        console.log(dataCtrlr.calcTotal())

        // Add the item to the table at the bottom of the screen
        // UICtrlr.updateTables();

        // Display the overall budget
        UICtrlr.updateDisplay(dataCtrlr.calcTotal(), dataCtrlr.calcIncome(), dataCtrlr.calcExpenses())
    }

    return {
        init: function() {
            setupEventListeners();
        }
    }
    

})(dataController, UIController);

appController.init()