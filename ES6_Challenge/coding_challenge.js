/////////////////////////////////
// CODING CHALLENGE

/*

Suppose that you're working in a small town administration, and you're in charge of two town elements:
1. Parks
2. Streets

It's a very small town, so right now there are only 3 parks and 4 streets. All parks and streets have a name 
and a build year.

At an end-of-year meeting, your boss wants a final report with the following:
1. Tree density of each park in the town (forumla: number of trees/park area)
2. Average age of each town's park (forumla: sum of all ages/number of parks)
3. The name of the park that has more than 1000 trees
4. Total and average length of the town's streets
5. Size classification of all streets: tiny/small/normal/big/huge. If the size is unknown, 
the default is normal

All the report data should be printed to the console.

HINT: Use some of the ES6 features: classes, subclasses, template strings, default parameters, 
maps, arrow functions, destructuring, etc.

*/


class Infrastructure{
    constructor(name, yearBuilt){
        this.name = name;
        this.yearBuilt = yearBuilt;
    }

    getAge(){
        let today = new Date;
        return today.getFullYear() - this.yearBuilt;
    }
}

class Park extends Infrastructure {
    constructor(name, yearBuilt, numTrees, area, treeDensity = undefined){
        super(name, yearBuilt);
        this.numTrees = numTrees;
        this.area = area;
        this.treeDensity = treeDensity;
    }

    setTreeDensity(){
        this.treeDensity =  this.numTrees / this.area;
    }

    getTreeDensity(){
        if (this.treeDensity === undefined){
            this.setTreeDensity();
        }
        return this.treeDensity
    }
}

class Street extends Infrastructure {
    constructor(name, yearBuilt, length, sizeCategory = "Normal"){
        super(name, yearBuilt);
        this.length = length;
        this.sizeCategory = sizeCategory;
    }
}

parkInputs = [
    ["Park 1", 1960, 1000, 25000],
    ["Park 2", 1970, 50, 6500],
    ["Park 3", 1965, 45, 19000],
]
let parks = parkInputs.map(inputSet => new Park(...inputSet));

streetInputs = [
    ["Road 1", 1940, 120, "Tiny"],
    ["Road 2", 1941, 800, "Big"],
    ["Road 3", 1942, 550, "Normal"],
    ["Road 4", 1943, 1200],
]
let streets = streetInputs.map(inputSet => new Street(...inputSet));


let summarizeTreeDensities = () => {
    densitySummary = "\n-----Tree Density Report-----";
    for (const park of parks){
        treeDensity = park.getTreeDensity().toLocaleString(undefined, {minimumFractionDigits: 3});
        densitySummary += `\n[${park.name}]: ${treeDensity} trees per square meter`;
    }
    return densitySummary = densitySummary.trim();
}

let summarizeParkAges = () => {
    meanAge = parks.reduce((sum, park) => sum + park.getAge(), initialValue=0) / parks.length;
    return (
        `\n\n-----Park Age Report-----`
        + `\nThe average age of the town's parks is ${meanAge.toFixed(2)} years.`
    )
}

let listParksOverThousandTrees = () => {
    parksOverThousand = parks.filter(park => park.numTrees >= 1000).map(park => park.name)
    return (
        `\n\n-----Tree Count Report-----`
        + `\nThe following park(s) have over 1,000 trees each: [${parksOverThousand.join(", ")}]`
    )
}

let summarizeStreetLengths = () => {
    totalStreetLength = streets.reduce((sum, street) => sum + street.length, initialValue=0);
    meanStreetLength = totalStreetLength / streets.length;
    return (
        `\n\n-----Street Length Report-----`
        + `\nThe average street length is ${meanStreetLength.toLocaleString(undefined, {maximumFractionDigits: 1})} and `
        + `the total length of the streets is ${totalStreetLength.toLocaleString(undefined, {maximumFractionDigits: 1})}.`
    )
}

let classifyStreetSize = () => {
    let streetReport = `\n\n-----Street Size Report-----`;
    for (const street of streets){
        streetReport += `\n[${street.name}]: ${street.sizeCategory}`
    }
    return streetReport
}


let metrics = new Map();
metrics.set("Tree Density", summarizeTreeDensities());
metrics.set("Park Ages", summarizeParkAges());
metrics.set("Tree Report", listParksOverThousandTrees());
metrics.set("Street Lengths", summarizeStreetLengths());
metrics.set("Street Sizes", classifyStreetSize());

for (const [k, v] of metrics.entries()) {
    console.log(v)
}