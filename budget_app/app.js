// NOTE: Defining separate modules as IIFE to ensure separate scopes

var dataController = (function() {
    // Responsible for tracking / updating the underlying data

    var data = {
        values: [],
        descriptions: [],
    }

    var _addRecord = function(positiveOrNegative, description, value){
        multiplier = positiveOrNegative === "income" ? 1 : -1;
        data.values.push(multiplier * value);
        data.descriptions.push(description)
    }

    var _recordIsIncome = function (number) {
        return number >= 0
    }

    var _sumByType = function(cashflow) {
        positiveCashflow = (cashflow === "income")

        return data.values.reduce(
            callbackFn=function(total, currentItem) {
                return total + (
                    _recordIsIncome(currentItem) === positiveCashflow ? 
                    currentItem :
                    0
                )
            },
            initialValue=0)
    }

    var _sumIncome = function() {
        return _sumByType("income")
    }

    var _sumExpenses = function () {
        return _sumByType("expense")
    }
    var _calcTotal = function () {
        return _sumIncome() + _sumExpenses()
    }

    return {
        addRecord: _addRecord,
        calcIncome: _sumIncome,
        calcExpenses: _sumExpenses,
        calcTotal: _calcTotal,
    }

})();

var UIController = (function() {
    // Responsible for updating the UI

    var DOMelements = {
        inputPositiveOrNegative: document.querySelector(".add__type"),
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
                positiveOrNegative: DOMelements.inputPositiveOrNegative.value, // either 'income' or 'expense'
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
            pageInputs.positiveOrNegative,
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