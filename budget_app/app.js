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

    var _isPositive = function (number) {
        return number >= 0
    }

    var _sumByType = function(cashflow) {
        positiveCashflow = (cashflow === "income")

        return data.values.reduce(
            callbackFn=function(total, currentItem) {
                return total + (
                    _isPositive(currentItem) === positiveCashflow ? 
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

})();

var appController = (function(dataCtrlr, UICtrlr) {
    // Ties the data and UI portions together and tells each when to execute
    var _addItem = function() {
        // Get the form inputs (add__type, add__description, add__value)
        positiveOrNegative = document.querySelector(".add__type").value;
        description = document.querySelector(".add__description").value;
        value = document.querySelector(".add__value").value;

        // Add the item to our underlying data
        dataCtrlr.addRecord(positiveOrNegative, description, value);

        // // Calculate the overall budget
        console.log(dataCtrlr.calcTotal())

        // Add the item to the table at the bottom of the screen
        // UICtrlr.updateTables();

        // Display the overall budget
        // UICtrlr.dispTotal()
    }

    // Initial entry into the app is dependent on the <button> 'add__button'
    document.querySelector(".add__btn").addEventListener("click", _addItem);

    document.addEventListener("keypress", function(e){ // Pass the event object to the function
        if (e.key === "Enter") { _addItem() } // Access the 'key' attribute of the event object
    })

})(dataController, UIController);