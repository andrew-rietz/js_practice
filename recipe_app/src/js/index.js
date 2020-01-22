import Search from "./models/Search";
import * as searchView from "./views/searchView";
import { elements } from "./views/base";


// Global state of the app
// - Objects: Search, Current Recipe, Shopping List, Liked Recipes
const state = {};

// Event Listeners
const searchController = async () => {
    // Get query string (search string) from the view
    const query = searchView.getInput();
    if (!query) {return}
    
    // Create a new search object, add it to the state
    state.search = new Search(query);

    // Get the search results
    await state.search.getResults();
    
    // Save the results
    console.log(state.search.results)
}

elements["searchForm"].addEventListener("submit", e => {
    e.preventDefault();
    searchController();
})

const search = new Search("pizza");
console.log(search)

search.getResults();