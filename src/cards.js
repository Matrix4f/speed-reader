const cheerio = require('cheerio');
const mammoth = require('mammoth');
const fs = require('fs');

const cardDatabases = [];

function calculateWordCount(s){
    return s.replace(/(^\s*)|(\s*$)/gi,"") //exclude  start and end white-space
        .replace(/[^\s\w&]/g, '')
        .replace(/[\s]{2,}/gi," ") //2 or more space to 1
        .split(' ')
        .filter(function(str){return str!="";}).length;
}

class Card {
    constructor(tag, cite, text, stats={highlightedWords: this.calculateHighlightedWords(text)}) {
        this.tag = tag;
        this.cite = cite;
        this.text = text;
        this.stats = stats;
    }

    calculateHighlightedWords(text) {
        var highlightedWords = 0;
        text.forEach(paragraph => {
            paragraph = paragraph.replace(/[(][(][/]{0,1}ul[)][)]/g, '');;
            var start = paragraph.indexOf('((hl))');
            
            while (start != -1) {
                var end = paragraph.indexOf('((/hl))', start);

                var data = paragraph.substring(start+6,end);
                highlightedWords += calculateWordCount(data);

                start = paragraph.indexOf('((hl))', end);
            }
        });
        return highlightedWords;
    }

    isValidCard() {
        return this.stats.highlightedWords > 2;
    }

    htmlify(text, noHL, noUL) {
        return text.replace(/[(][(]hl[)][)]/g, noHL ? '' : "<span class='card-highlight'>")
            .replace(/[(][(][/]hl[)][)]/g, noHL ? '' : "</span>")
            .replace(/[(][(]ul[)][)]/g, noUL ? '' : "<span class='card-underline'>")
            .replace(/[(][(][/]ul[)][)]/g, noUL ? '' : "</span>");
    }

    htmlifyBody(options) {
        return `<p>${this.htmlify(this.text.join('</p><p>'), options.noHL, options.noUL)}</p>`;
    }

    toHTML(options) {
        return `<div class='card'>` + 
            `<div class='tag'>${this.htmlify(this.tag, options.noHL, options.noUL)}</div>` + 
            `<div class='cite'>${this.htmlify(this.cite, options.noHL, options.noUL)}</div>` + 
            `<div class='card-body'>${this.htmlifyBody(options)}</div>` + 
        `</div>`;
    }
}

class CardDB {

  constructor(name, internalName, cards) {
    this.name = name;
    this.internalName = internalName;
    this.cards = cards;
  }
}

function getCards(docx) {
  return mammoth.convertToHtml({path: docx}).then(function(result){
    var html = result.value
      .replaceAll('[<][/]h4[>](\s|<br>)*[<]h4[>]', '\n'); //Remove all consecutive whitespace between tags
    var messages = result.messages; // Any messages, such as warnings during conversion
    
    const $ = cheerio.load(html);
    
    var cards = [];

    $('h4').each(function(i, elem) {
      elem = $(this);   
      var tag = elem.text();
      var cite = elem.next().text();
      var text = [];

      $(this).nextUntil('h1,h2,h3,h4,h5,h6', function(j, par) {
        par = $(this);
        
        if (j != 0)
          text.push(par.text());
      });
      
      var card = new Card(tag, cite, text);
      if (card.isValidCard())
        cards.push(card);
    });
    return cards;
  });
}

function newCardDB(name, docxPath) {

  return getCards(docxPath).then(cards => {

    var internalName = `db-${fs.readdirSync('src/assets/cards/userdbs').length}`;
    var db = new CardDB(name, internalName, cards);
    cardDatabases.push(db);
    return db;

  }).then(db => {

    fs.writeFileSync(
      `src/assets/cards/userdbs/${db.internalName}.cards`,
      JSON.stringify(db),
      err => {}
    );

  }).then(db => {

    fs.writeFileSync(
      'src/assets/cards/databases.json',
      JSON.stringify(cardDatabases.map(db => {
        return {
          name: db.name,
          internalName: db.internalName
        };
      })),
      err => {}
    );
    return db;
    
  })
}

export default {
  getCards: getCards,
  newCardDB: newCardDB,
  Card: Card
};