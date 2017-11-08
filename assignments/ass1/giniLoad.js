var fs = require('fs');
var csv = require("csv");
var parse = require('csv-parse');

var countryData = new Object;

var parser = parse(function(err, data){
    data.forEach(function iteratee(elem){
        
        var countryCode = elem[1];
        var key = new Object;
        key.income = elem[4];
        var gini = elem[5];
        key.gini = gini;
        
        switch(true){
            case (gini > 60):
                key.fillKey = "Very High Gini";
                break;
            case (gini <= 60 && gini > 50):
                key.fillKey = "High Gini";
                break;
            case (gini <= 50 && gini > 40):
                key.fillKey = "Mid Gini";
                break;
            case (gini <= 40 && gini >30 ):
                key.fillKey = "Low Gini";
                break;
            case (gini <= 30):
                key.fillKey = "Very Low Gini";
                break;
        }
        
        countryData[countryCode] = key;
        
    });
    console.log(countryData);
});

fs.createReadStream('./chloropleth.csv').pipe(parser);

