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
            overall: 0,
            income: 0,
            expense: 0,
        }
    }

    var _addRecord = function(incomeOrExpense, description, value){
        var newRecord, ID;

        // set ID to the last ID in the array, + 1
        ID = data.cashflow[incomeOrExpense][data.cashflow[incomeOrExpense].length - 1] + 1;
        if (incomeOrExpense === "income"){
            newRecord = new Income(ID, description, Number(value));
        } else {
            newRecord = new Expense(ID, description, Number(value) * -1);
        }
        data.cashflow[incomeOrExpense].push(newRecord);
        _setTotals();
    }

    var _setTotals = function() {
        data.totals.income = sumCashflow(data.cashflow.income)
        data.totals.expense = sumCashflow(data.cashflow.expense)
        data.totals.overall = data.totals.income + data.totals.expense
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
        // DOMelements.expenseSummaryPct.textContent = overallExpenses / overallIncome;
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
            return DOMelements
        },
        updateDisplay: _updateDisplay,
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
        // dataCtrlr.getTotal()

        // Add the item to the table at the bottom of the screen
        // UICtrlr.updateTables();

        // Display the overall budget
        UICtrlr.updateDisplay(
            dataCtrlr.data.totals.overall,
            dataCtrlr.data.totals.income,
            dataCtrlr.data.totals.expense)
    }

    return {
        init: function() {
            setupEventListeners();
        }
    }
    

})(dataController, UIController);

appController.init()