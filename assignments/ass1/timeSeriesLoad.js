var fs = require('fs');
var csv = require("csv");
var parse = require('csv-parse');


var giniParser = parse(function(err, data){
    if (err) throw "read error";
    // console.log(data.length)
    var timeSeries = {};
    
    data.forEach(function iterator(elem, index){
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
                    timeSeries[year][country].gini += ((parseFloat(gini).toFixed(1) - timeSeries[year][country].gini)/timeSeries[year][country].count);
                    timeSeries[year][country].fillKey = setFillKey(timeSeries[year][country].gini)
                }
                else {
                    timeSeries[year][country] = {'gini' : parseFloat(gini).toFixed(1),
                                                 'fillKey' : fillKey,
                                                 'count' : 1
                                                };
                }
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
        
         data.forEach(function iterator(elem, index){
            if(index != 0){
            createItem(elem);
            }
        });
    
        if(level == "P"){
            fs.writeFile('./data/primaryYears.json', JSON.stringify(timeSeries), (err) => {
              if (err) throw err;
            });
            fs.writeFile('./data/primaryCountries.json', JSON.stringify(countrySeries), (err) => {
              if (err) throw err;
            });
        }
        else{
            fs.writeFile('./data/secondaryYears.json', JSON.stringify(timeSeries), (err) => {
              if (err) throw err;
            });
        }
        
        // console.log(countrySeries['TZA']);
        
        function createItem(elem){
            var year = elem[4];
            var country = elem[2];
            // console.log(country)
            
            var ner = elem[6];
            var fillKey = setFillKey(ner);
            
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
            
            var epoch = new Date(year);
            var seconds = Math.round(epoch.getTime() / 1000);
            // console.log(seconds)
            
            if(!countrySeries.hasOwnProperty(country)){
                countrySeries[country] = [{x : parseInt(seconds), y: parseFloat(ner)}];
                } else{
                    countrySeries[country].push({x: parseInt(seconds), y : parseFloat(ner)})
                }
        }
    })
    
    function setFillKey(elem){
        switch(true){
            case (elem > 90):
                return '>90';
            case (elem <= 90 && elem > 80):
                return "80-90";
            case (elem <= 80 && elem > 70):
                return "70-80";
            case (elem <= 70 && elem > 60):
                return "60-70";
            case (elem <= 60 && elem > 50):
                return "50-60";
            case (elem <= 50 && elem > 40):
                return "40-50";
            case (elem <= 40 && elem >30 ):
                return "30-40";
            case (elem <= 30 && elem >20):
                return "20-30";
            case (elem <20):
                return "<20";
        }
    }
    
fs.createReadStream('./data/wiid.csv').pipe(giniParser);
// fs.createReadStream('./data/NER_Primary.csv').pipe(nerParser);
// fs.createReadStream('./data/NER_Secondary.csv').pipe(nerParser);
