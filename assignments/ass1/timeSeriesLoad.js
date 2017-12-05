var fs = require('fs');
var csv = require("csv");
var parse = require('csv-parse');


var giniParser = parse(function(err, data){
    if (err) throw "read error";
    // console.log(data.length)
    var timeSeries = {};
    
    data.forEach(function iteratee(elem, index){
        if(index != 0){
        createItem(elem);
        }
    })
    
    // console.log(timeSeries)
    fs.writeFile('./data/datamaps.json', JSON.stringify(timeSeries), (err) => {
        if (err) throw err;
    });
    
    function createItem(elem){
            var year = elem[3];
            var country = elem[1];
            var gini;
            if(elem[8] != ""){
                gini = elem [8];
            } else{
                gini = 0;
            }

            var fillKey = setFillKey(gini);
            var countryDict = {};
            if(!timeSeries.hasOwnProperty(year)){
                countryDict[country] = {'gini' : parseFloat(gini),
                                        "fillKey" : fillKey,
                                        'count' : 1
                };
                timeSeries[year] = countryDict;
            } else{
                if(timeSeries[year].hasOwnProperty(country)){
                    timeSeries[year][country].count++,
                    timeSeries[year][country].gini += (parseFloat(gini) - timeSeries[year][country].gini)/timeSeries[year][country].count;
                    timeSeries[year][country].fillKey = setFillKey(timeSeries[year][country].gini)
                }
                else {
                    timeSeries[year][country] = {'gini' : parseFloat(gini),
                                                 'fillKey' : fillKey,
                                                 'count' : 1
                                                };
                }
            }
    }
    
    function setFillKey(gini){
        switch(true){
            case (gini > 60):
                return ">60";
            case (gini <= 60 && gini > 50):
                return "50-60";
            case (gini <= 50 && gini > 40):
                return "40-50";
            case (gini <= 40 && gini >30 ):
                return "30-40";
            case (gini <= 30):
                return "<30";
            case (gini == 0):
                return "Missing Data";
        }
    }
});


var nerParser =  parse(function(err, data){
        if (err) {console.log(err)};
        var timeSeries = {};
        var countrySeries = {};
        var level;
        
        if(data[1][0] == 'NER_1_CP'){
            level = "P";
        } else {
            level = 'S';
        }
        
         data.forEach(function iteratee(elem, index){
            if(index != 0){
            createItem(elem);
            }
        });
    
        if(level == "P"){
            fs.writeFile('./data/primaryYears.json', JSON.stringify(timeSeries), (err) => {
              if (err) throw err;
            });
        }
        else{
            fs.writeFile('./data/secondaryYears.json', JSON.stringify(timeSeries), (err) => {
              if (err) throw err;
            });
        }
        
        console.log(timeSeries[2013]);
        
        function createItem(elem){
            var year = elem[4];
            var country = elem[2];
            // console.log(country)
            
            var ner = elem[6];
            var fillKey = setFillKey(ner);
            
            function setFillKey(ratio){
                 switch(true){
                    case (ratio > 90):
                        return '>90%';
                    case (ratio <= 90 && ratio > 80):
                        return "80-90%";
                    case (ratio <= 80 && ratio > 70):
                        return "70-80%";
                    case (ratio <= 70 && ratio > 60):
                        return "60-70%";
                    case (ratio <= 60 && ratio > 50):
                        return "50-60%";
                    case (ratio <= 50 && ratio > 40):
                        return "40-50%";
                    case (ratio <= 40 && ratio >30 ):
                        return "30-40%";
                    case (ratio <= 30 && ratio >20):
                        return "20-30%";
                    case (ratio <20):
                        return "<20%";
                }
            }
            
            var countryDict = {};
            if(!timeSeries.hasOwnProperty(year)){
                    countryDict[country] = {'ner' : ner,
                                            'fillKey' : fillKey
                    };
                    timeSeries[year] = countryDict;
            } else {
                timeSeries[year][country] = {'ner' : ner,
                                            'fillKey' : fillKey
                                            };
            }
            
        
            if(!countrySeries.hasOwnProperty(country)){
                countrySeries[country] = [{x : year, y: ner}];
                } else{
                    countrySeries[country].push({x: year, y : ner})
                }
        }
    })
// fs.createReadStream('./data/wiid.csv').pipe(giniParser);
fs.createReadStream('./data/NER_Primary.csv').pipe(nerParser);
// fs.createReadStream('./data/NER_Secondary.csv').pipe(nerParser);
