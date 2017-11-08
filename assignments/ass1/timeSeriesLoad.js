var fs = require('fs');
var csv = require("csv");
var parse = require('csv-parse');

var timeSeries = {};

var parser = parse(function(err, data){
    // console.log(data.length)
    data.forEach(function iteratee(elem, index){
        if(index != 0){
        createItem(elem);
        }
    })
    console.log(timeSeries)
    
    function createItem(elem){
            var year = elem[3];
            var country = elem[1];
            var gini;
            if(elem[8] != ""){
                gini = elem [8];
            } else{
                gini = "N/A";
            }
            var fillKey = setFillKey(gini);
            var countryDict = {};
            if(!timeSeries.hasOwnProperty(year)){
                countryDict[country] = {'gini' : gini,
                                        "fillKey" : fillKey};
                timeSeries[year] = countryDict;
            } else{
                timeSeries[year][country] = {'gini' : gini,
                                             'fillKey' : fillKey};
            }
    }
    
    function setFillKey(gini){
        switch(true){
            case (gini > 60):
                return "Very High Gini";
                break;
            case (gini <= 60 && gini > 50):
                return "High Gini";
                break;
            case (gini <= 50 && gini > 40):
                return "Mid Gini";
                break;
            case (gini <= 40 && gini >30 ):
                return "Low Gini";
                break;
            case (gini <= 30):
                return "Very Low Gini";
                break;
            case (gini == "N/A"):
                return "Missing Data";
                break;
        }
    }
    fs.writeFile('datamaps.json', JSON.stringify(timeSeries), (err) => {
        if (err) throw err;
    });
});

fs.createReadStream('./wiid.csv').pipe(parser);