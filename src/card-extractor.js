const fs = require('fs');
const cards = require('./cards');

function buildCardDB(parentDir, files) {
    var promises = files.map(file => {
        return cards.getCards(parentDir + file);
    });
    return Promise.all(promises)
        .then(cardDBs => {
            var singleDB = [];
            cardDBs.forEach(cardDB => { 
                Array.prototype.push.apply(singleDB, cardDB); 
                console.log('Finished ' + cardDB.length + ' batch!');
            });
            return singleDB;
        });
}

function testProgram() {
    buildCardDB('src/assets/wordfiles/', fs.readdirSync('src/assets/wordfiles'))
        .then(cardDB => {
            fs.writeFileSync('src/assets/cards.json', JSON.stringify(cardDB), err => {});
            console.log("Finished!");
        })
        .catch(reason => {
            console.log(`Err: ${reason}`);
        });
}

testProgram();