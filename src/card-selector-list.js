import React, {Component} from 'react';
import './App.css';

import { List } from 'semantic-ui-react';

import cards from './cards';
import ImportCardsListElement from './import-card-list-elem';
import CardDocumentListElement from './card-doc-list-elem';

class CardsSelectorList extends Component {

  constructor(props) {
    super(props);
    this.addCardListElement = this.addCardListElement.bind(this);
    this.removeCardListElement = this.removeCardListElement.bind(this);
    this.renderCardListElement = this.renderCardListElement.bind(this);

    this.state = {
      setElementsCallback: props.setElementsCallback,
      elements: [{
        filename: 'Internal Database',
        internalName: 'db-0',
        description: 'A default set of cards that comes installed with Speed Reader',
        isNewElement: false,
        selected: false
      }]
    };
    this.state.setElementsCallback(this.state.elements);
  }

  addCardListElement(filename, internalName, description) {
    var newValue = this.state.elements.concat([{
      filename: filename,
      internalName: internalName,
      description: description,
      isNewElement: true,
      selected: true
    }]);

    this.setState({
      elements: newValue
    });
    this.state.setElementsCallback(newValue);
  }

  removeCardListElement(filename, internalName, description) {
    var elem = this.state.elements.find(elem => (elem.filename == filename && elem.internalName == internalName && elem.description == description));
    cards.removeDB(new cards.CardDBIdentifier(elem.filename, elem.internalName));

    var newValue = this.state.elements.filter(elem => !(elem.filename == filename && elem.description == description));
    this.setState({
      elements: newValue
    });
    this.state.setElementsCallback(newValue);
  }

  syncElement(filename, internalName) {
    const fs = window.bypass.fs;

    var db = cards.findDB(new cards.CardDBIdentifier(filename, internalName));

    return cards.getCardsFromDocx(db.filepath, fs.readFileSync(db.filepath)).then(cards => {
      if (cards && cards.length > 0) {
        console.log('Synced ' + cards.length + " cards.");
        db.cards = cards;
  
        var date = new Date();
        db.description = `${db.filepath} on ${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()-2000}`;

        return true;
      }
      return false;
    });
  }

  toggleElement(selected, filename, internalName) {
    var elem = this.state.elements.find(elem => (elem.filename == filename && elem.internalName == internalName));
    elem.selected = selected;
  }

  renderCardListElement(element) {
    return (
      <CardDocumentListElement 
        key={element.filename + element.internalName}
        filename={element.filename} 
        internalName={element.internalName} 
        description={element.description} 
        removeCallback={this.removeCardListElement}
        syncCallback={this.syncElement}

        isNewElement={element.isNewElement}
        selected={element.selected}
      />
    );
  }

  UNSAFE_componentWillMount() {
    cards.loadDBs();

    var newElements = [];
    cards.getDBs().forEach(db => {  
      newElements.push({
        filename: db.id.name,
        internalName: db.id.internalName,
        description: db.description,
        isNewElement: false,
        selected: db.selected
      });
    });
    var newValue = this.state.elements.concat(newElements);
    this.setState({ elements: newValue });
    this.state.setElementsCallback(newValue);
  }

  render() {
    return (
      <List divided size='large'>
        {this.state.elements.map(this.renderCardListElement)}
        <ImportCardsListElement addCardCallback={this.addCardListElement}/>
      </List>
    );
  }
}

export default CardsSelectorList;