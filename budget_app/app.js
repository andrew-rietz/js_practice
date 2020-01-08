// NOTE: Defining separate modules as IIFE to ensure separate scopes

var dataController = (function() {
    // Responsible for tracking / updating the underlying data

})();

var UIController = (function() {
    // Responsible for updating the UI

})();

var appController = (function(dataCtrlr, UICtrlr) {
    // Ties the data and UI portions together

})(dataController, UIController);