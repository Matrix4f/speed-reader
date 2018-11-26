import React from 'react';
import fileDialog from 'file-dialog';
import './App.css';

import './semantic/dist/semantic.min.css';
import { Table, Button, Header } from 'semantic-ui-react';

import cards from './cards';

class ReaderScreen extends React.Component {

  constructor(props) {
    super(props);

    var options = props.sceneOptions;
  
    this.state = {
      setSceneCallback: props.setSceneCallback,

      highlight: options.highlight,
      readForward: options.readForward,
      cardsFrom: options.cardsFrom,

      cards: []
    };

    this.state.dbs = this.state.cardsFrom.map(cards.findDB);
    this.state.dbs.forEach(db => db.loadCards());

    this.state.dbs.forEach(db => {
      this.state.cards = this.state.cards.concat(db.cards);
    });

    this.getHTML = this.getHTML.bind(this);
    this.scrollDown = this.scrollDown.bind(this);
    this.scrollUp = this.scrollUp.bind(this);
    this.keyPress = this.keyPress.bind(this);
  }

  getHTML() {
    var html = `
      <style>
        .card-highlight { background-color: yellow; font-size: 120%; }
        .card-underline { text-decoration: underline; }
        .tag { font-weight: bold; font-size: 140%; }
        .cite { font-weight: bold; font-size: 130%;}
        .card-body { }
        body { font-family: 'Calibri', 'Arial', 'Times New Roman'; }
        ::-webkit-scrollbar { display: none; }
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
      });
    });
    return html;
  }

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
    document.body.style.backgroundImage = null;
    document.addEventListener('keydown', this.keyPress);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keyPress);
  }

  render() {
    return (
      <div className="ui left aligned container segment" style={{backgroundColor: '#f6f6f6'}}>
        <Header as='h1' textAlign='center'>Reader View</Header>
        <Table>
          <Table.Row>
            <Table.Cell width={1}><Button basic size='massive' icon='angle left' onClick={this.scrollUp}/></Table.Cell>
            <Table.Cell width={14}><div dangerouslySetInnerHTML={{__html: this.getHTML()}} id="reader" className="reader"></div></Table.Cell>
            <Table.Cell width={1}><Button basic size='massive' icon='angle right' style={{float: 'right'}} onClick={this.scrollDown} /></Table.Cell>
          </Table.Row>
        </Table>
      </div>
    );
  }
}

export default ReaderScreen;