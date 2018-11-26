const cheerio = require('cheerio');
const mammoth = require('mammoth');

var cardDatabases = [];

function calculateWordCount(s){
    return s.replace(/(^\s*)|(\s*$)/gi,"") //exclude  start and end white-space
        .replace(/[^\s\w&]/g, '')
        .replace(/[\s]{2,}/gi," ") //2 or more space to 1
        .split(' ')
        .filter(function(str){return str!="";}).length;
}

function reverseWords(input, options) {
  if (input.includes('Immigration restrictions give China'))
    console.log(input);
  var reversed = input;
  
  if (!options.noHL)
    reversed = reversed.replace(/[(][(]hl[)][)]/g, ' ((hlend)) ')
      .replace(/[(][(][/]hl[)][)]/g, ' ((hl)) ')
      .replace(/[(][(]hlend[)][)]/g, ' ((/hl)) ');
  
  if (!options.noUL)
    reversed = reversed.replace(/[(][(]ul[)][)]/g, ' ((ulend)) ')
      .replace(/[(][(][/]ul[)][)]/g, ' ((ul)) ')
      .replace(/[(][(]ulend[)][)]/g, ' ((/ul)) ');


  if (input.includes('Immigration restrictions give China')){
    console.log(input);
    console.log(input.split(/[ ]/g));
  }
  reversed = reversed.split(/[ ]/g)
    .reverse()
    .join(' ');

  if (input.includes('Immigration restrictions give China'))
    console.log(reversed);
  return reversed;
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

  htmlify(text, options) {
    if (options.reverse)
      text = reverseWords(text, options);

    text = text.replace(/[(][(]hl[)][)]/g, options.noHL ? '' : "<span class='card-highlight'>")
      .replace(/[(][(][/]hl[)][)]/g, options.noHL ? '' : "</span>")
      .replace(/[(][(]ul[)][)]/g, options.noUL ? '' : "<span class='card-underline'>")
      .replace(/[(][(][/]ul[)][)]/g, options.noUL ? '' : "</span>");

    return text;
  }

  htmlifyBody(options) {
      return `<p>${this.text.map(text => this.htmlify(text, options)).join('</p><p>')}</p>`;
  }

  toHTML(options) {
    return `<div class='card'>
      ${options.tag ? `<div class='tag'>${this.htmlify(this.tag, options)}</div>` : ``}
      ${options.cite ? `<div class='cite'>${this.htmlify(this.cite, options)}</div>` : ``}
      ${options.body ? `<div class='card-body'>${this.htmlifyBody(options)}</div>` : ``}
    </div>`;
  }
}

class CardDBIdentifier {
  constructor(name, internalName) {
    this.name = name;
    this.internalName = internalName;
  }
}

class CardDB {

  constructor(id, filepath, description, selected, cards) {
    this.id = id;
    this.filepath = filepath;
    this.description = description;
    this.selected = selected;
    this.cards = cards;
  }

  loadCards() {
    this.cards = getCardsFromJson(`src/assets/cards/userdbs/${this.id.internalName}.cards`);
  }

  unloadCards() {
    this.cards = null;
  }
}

function getCardsFromDocx(docx, arrayBuffer) {
  return mammoth.convertToHtml({
    path: docx,
    arrayBuffer: arrayBuffer
  }).then(function(result){
    var html = result.value
      .replace(/[<][/]h4[>](\s|<br>)*[<]h4[>]/g, '\n'); //Remove all consecutive whitespace between tags
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

function getCardsFromJson(json) {
  const fs = window.bypass.fs;
  var cards = JSON.parse(fs.readFileSync(json)).cards;
  return cards.map(card => new Card(card.tag, card.cite, card.text, card.stats));
}

function loadDBs() {
  const fs = window.bypass.fs;

  if (fs.existsSync('src/assets/cards/databases.json')) {
    cardDatabases = JSON.parse(fs.readFileSync('src/assets/cards/databases.json'))
      .map(obj => new CardDB(new CardDBIdentifier(obj.name, obj.internalName), obj.filepath, obj.description, obj.selected, null));

  }
}

function findDB(id) {
  return cardDatabases.find(db => (db.id.name == id.name && db.id.internalName == id.internalName));
}

function getDBs() {
  return cardDatabases;
}

function saveDBs() {
  const fs = window.bypass.fs;

  fs.writeFileSync(
    'src/assets/cards/databases.json',
    JSON.stringify(cardDatabases.map(db => {
      return {
        name: db.id.name,
        internalName: db.id.internalName,
        description: db.description,
        filepath: db.filepath,
        selected: db.selected
      };
    })),
    err => {}
  );
}

function newCardDB(name, description, docxPath) {
  const fs = window.bypass.fs;

  return getCardsFromDocx(docxPath, window.bypass.fs.readFileSync(docxPath)).then(cards => {


    var internalName = `db-${fs.readdirSync('src/assets/cards/userdbs').length}`;
    var db = new CardDB(new CardDBIdentifier(name, internalName), docxPath, description, true, cards);
    cardDatabases.push(db);

    fs.writeFileSync(
      `src/assets/cards/userdbs/${db.id.internalName}.cards`,
      JSON.stringify(db),
      err => {}
    );

    saveDBs();

    return db;

  });
}

function removeDB(id) {
  console.log(id);
  var removed = [];
  cardDatabases = cardDatabases.filter(db => {
    var keep = (db.id.name != id.name || db.id.internalName != id.internalName);
    if (!keep)
      removed.push(db);
    return keep;
  });

  saveDBs();

  const fs = window.bypass.fs;
  removed.forEach(db => {
    fs.unlinkSync(`src/assets/cards/userdbs/${db.id.internalName}.cards`);
  });
}

export default {
  getCardsFromDocx: getCardsFromDocx,

  newCardDB: newCardDB,
  loadDBs: loadDBs,
  findDB: findDB,
  getDBs: getDBs,
  removeDB: removeDB,
  saveDBs: saveDBs,

  CardDB: CardDB,
  Card: Card,
  CardDBIdentifier: CardDBIdentifier
};