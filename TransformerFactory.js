var app = angular.module('TransformersApp');

app.factory("TransformerDecoratorFactory", function() {

  function performNaNValueCheck(transformer){
    var anyValueIsNan = 
        isNaN(transformer.strength) || isNaN(transformer.intelligence) || isNaN(transformer.speed) || 
        isNaN(transformer.endurance) || isNaN(transformer.rank) || isNaN(transformer.courage) || 
        isNaN(transformer.firePower) || isNaN(transformer.skill);
    
    
    if(anyValueIsNan){
      var error = {
        type: "InvalidTransformerException",
        title: "One of the transformers has wrong attributes - ",
        message: "Please review the attributes of any transformer with the name: " + transformer.name + " and try again."
      };
      
      throw error;
    }
  }

  function decorateTransformer(transformerString) {
    var valueArray = transformerString.split(',');
    var transformer = {};
    
    if(valueArray.length < 10){
      var error = {
        type: "InvalidTransformerException",
        title: "One of the transformers entered is incomplete - ",
        message: "Please review if any transformer with the name: " + valueArray[0]  + " has all the attributes and try again."
      };
      
      throw error;
    }

    transformer.name = valueArray[0].trim();
    transformer.team = valueArray[1].trim();

    transformer.strength = Number(valueArray[2]);
    transformer.intelligence = Number(valueArray[3]);
    transformer.speed = Number(valueArray[4]);
    transformer.endurance = Number(valueArray[5]);
    transformer.rank = Number(valueArray[6]);
    transformer.courage = Number(valueArray[7]);
    transformer.firePower = Number(valueArray[8]);
    transformer.skill = Number(valueArray[9]);
    
    performNaNValueCheck(transformer);

    transformer.overallRating = transformer.strength + transformer.intelligence +
      transformer.speed + transformer.endurance +
      transformer.firePower;
    return transformer;
  }

  return {
    decorateTransformer: decorateTransformer,
  };
});