import React from 'react';
import fileDialog from 'file-dialog';
import './App.css';

import './semantic/dist/semantic.min.css';
import { Table, Button, Header } from 'semantic-ui-react';

import cards from './cards';

function shuffle(a) {
  for (var i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

class ReaderScreen extends React.Component {

  constructor(props) {
    super(props);

    var options = props.sceneOptions;
  
    this.state = {
      setSceneCallback: props.setSceneCallback,

      highlight: options.highlight,
      readForward: options.readForward,
      cardsFrom: options.cardsFrom,
      
      cards: [],

      renderAdditionalFeatures: options.renderAdditionalFeatures
    };

    this.state.dbs = this.state.cardsFrom.map(cards.findDB);
    this.state.dbs.forEach(db => db.loadCards());

    this.state.dbs.forEach(db => {
      this.state.cards = this.state.cards.concat(db.cards);
    });
    if (options.shuffle)
      shuffle(this.state.cards);

    this.getHTML = this.getHTML.bind(this);
    this.scrollDown = this.scrollDown.bind(this);
    this.scrollUp = this.scrollUp.bind(this);
    this.keyPress = this.keyPress.bind(this);
  }

  getHTML() {
    var html = `
      <style>
        .card-highlight { background-color: #8CD7FF; }
        .card-underline { text-decoration: underline; }
        .tag { font-weight: bold; font-size: 140%; }
        .cite { font-weight: bold; font-size: 130%;}
        body { font-family: 'Calibri', 'Arial', 'Times New Roman'; font-size: 110%; }
        .card-body .card-underline { font-size: 115%; }
        .card-body .card-highlight { font-size: 105%; }
        /*::-webkit-scrollbar { display: none; }*/
      </style>
    `;
    this.state.cards.forEach(card => {
      html += card.toHTML({
        tag: true,
        cite: this.state.readForward,
        body: true,
        reverse: !this.state.readForward,
        noHL: !this.state.highlight,
        noUL: false 
      }) + '<br><br>';
    });
    return html;
  }

  showDrillScreen = (e) => this.state.setSceneCallback('selectDrillScreen', {})

  scroll(multiplier) {
    var elem = document.getElementById('reader');
    elem.scrollBy(0, multiplier * (elem.getBoundingClientRect().height - 10));
  }

  scrollDown(e) {
    e.preventDefault();
    this.scroll(1);
  }

  scrollUp(e) {
    e.preventDefault();
    this.scroll(-1);
  }

  keyPress(evt) {
    if (evt.key == 'ArrowLeft') this.scroll(-1);
    else if (evt.key == 'ArrowRight') this.scroll(1);
  }

  componentWillMount() {
    document.addEventListener('keydown', this.keyPress);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keyPress);
  }

  render() {
    return (
      <div className="ui left aligned container segment" style={{backgroundColor: '#f6f6f6'}}>
        <Table>
          <Table.Row>
            <Table.Cell>
              <Button icon='arrow left' basic onClick={this.showDrillScreen} />
            </Table.Cell>
            <Table.Cell>
              <Header as='h1' textAlign='center'>Doc View</Header>
            </Table.Cell>
          </Table.Row>
          
          <Table.Row>
            <Table.Cell width={1}><Button basic size='massive' icon='angle left' onClick={this.scrollUp}/></Table.Cell>
            <Table.Cell width={14}><div dangerouslySetInnerHTML={{__html: this.getHTML()}} id="reader" className="reader"></div></Table.Cell>
            <Table.Cell width={1}><Button basic size='massive' icon='angle right' onClick={this.scrollDown} /></Table.Cell>
          </Table.Row>
        </Table>
      </div>
    );
  }
}

export default ReaderScreen;