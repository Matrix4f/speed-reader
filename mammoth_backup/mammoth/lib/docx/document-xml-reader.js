exports.DocumentXmlReader = DocumentXmlReader;

var documents = require("../documents");
var Result = require("../results").Result;
const fs = require('fs');

function DocumentXmlReader(options) {
    var bodyReader = options.bodyReader;
    
    function convertXmlToDocument(element) {
        var body = element.first("w:body");
        
        var result = bodyReader.readXmlElements(body.children)
            .map(function(children) {
                return new documents.Document(children, {
                    notes: options.notes,
                    comments: options.comments
                });
            });
        fs.writeFile('data.json', JSON.stringify(result, null, 2), (err)=>{});
        return new Result(result.value, result.messages);
    }
    
    return {
        convertXmlToDocument: convertXmlToDocument
    };
}
