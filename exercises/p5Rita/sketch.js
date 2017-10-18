var input;

function setup(){
    noCanvas();
    input = createInput();
    input.changed(rita);
}

function rita(event){
    // console.log(event.target.value);
    rString = RiString(event.target.value);
    rWords = rString.words();
    console.log(rWords);
    
    rWords.forEach(function(element) {
        var features = RiString(element).features();
        console.log(features);
    });
}