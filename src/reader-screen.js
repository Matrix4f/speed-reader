import React from 'react';
import fileDialog from 'file-dialog';
import './App.css';

import './semantic/dist/semantic.min.css';
import { Table, Button, Header, Segment } from 'semantic-ui-react';

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
      isWPMCount: options.preferredWords != undefined,
      preferredWords: options.preferredWords,
      
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

    if (this.state.isWPMCount) {
      var wordCount = 0;
      var cardIndex = 0;
      while (wordCount < this.state.preferredWords) {
        const card = this.state.cards[cardIndex];
        cardIndex++;
        if (card == undefined) {
          break;
        }
        wordCount += card.getWordCount(this.state.highlight);
      }
      this.state.cards = this.state.cards.splice(0, cardIndex);
      this.state.wordCount = wordCount;
    }

    this.getHTML = this.getHTML.bind(this);
    this.keyPress = this.keyPress.bind(this);
    this.renderWPMData = this.renderWPMData.bind(this);
  }

  getHTML() {
    const noHighlights = !this.state.highlight;
    const noUnderline = !this.state.highlight && this.state.isWPMCount;
    const normalFontSize = noUnderline ? '120%' : '100%';
    const cites = this.state.readForward && !this.state.isWPMCount;

    var html = `
      <style>
        .card-highlight { background-color: #8CD7FF; }
        .card-underline { text-decoration: underline; }
        .tag { font-weight: bold; font-size: 140%; }
        .cite { font-weight: bold; font-size: 130%;}
        body { font-family: 'Calibri', 'Arial', 'Times New Roman'; font-size: 110%; }
        .card-body .card-underline { font-size: 115%; }
        .card-body .card-highlight { font-size: 105%; }
        .card-body { font-size: ${normalFontSize}; }
        /*::-webkit-scrollbar { display: none; }*/
      </style>
    `;
    this.state.cards.forEach(card => {
      html += card.toHTML({
        tag: true,
        cite: cites,
        body: true,
        reverse: !this.state.readForward,
        noHL: noHighlights,
        noUL: noUnderline
      }) + '<br><br>';
    });

    return html;
  }

  showDrillScreen = (e) => this.state.setSceneCallback('selectDrillScreen', { nextScene: 'reader', displayWPMOptions: this.state.isWPMCount})

  scroll(multiplier) {
    var elem = document.getElementById('reader');
    elem.scrollBy(0, multiplier * (elem.getBoundingClientRect().height - 10));
  }

  scrollDown = e => this.scroll(1);
  scrollUp = e => this.scroll(-1);
  finishWPMTest = () => {
    const finishTime = Date.now();
    const { startTime } = this.state;
    this.setState({ finishTime: finishTime });
    this.state.setSceneCallback('wpmResults', {
      timeTaken: finishTime-startTime,
      wordsRead: this.state.wordCount,
      preferredWords: this.state.preferredWords
    });
  };

  keyPress(evt) {
    if (evt.key == 'ArrowLeft') this.scroll(-1);
    else if (evt.key == 'ArrowRight') this.scroll(1);
    else if (evt.key == ' ') this.finishWPMTest();
  }

  componentWillMount() {
    document.addEventListener('keydown', this.keyPress);
    this.setState({ startTime: Date.now() });
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keyPress);
  }

  renderWPMData() {
    if (!this.state.isWPMCount)
      return '';
    return (
      <Table>
        <Table.Row>
          <Table.Cell width={8}>
            <Button positive fluid labelPosition='left' icon='hourglass end' size="massive" content="Done" onClick={this.finishWPMTest} />
          </Table.Cell>
          <Table.Cell width={8}>
            <Segment raised><Header as='h4' textAlign='center'>TAP SPACE TO FINISH</Header></Segment>
          </Table.Cell>
        </Table.Row>
      </Table>
    );
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
              <Header as='h1' textAlign='center'>{this.state.isWPMCount ? "Words per Minute" : "Doc View"}</Header>
            </Table.Cell>
          </Table.Row>
          
          <Table.Row>
            <Table.Cell width={1}><Button basic size='massive' icon='angle left' onClick={this.scrollUp}/></Table.Cell>
            <Table.Cell width={14}>
              <div id="reader" className="reader">
                <div dangerouslySetInnerHTML={{__html: this.getHTML()}} />
                {this.renderWPMData()}
              </div>
            </Table.Cell>
            <Table.Cell width={1}><Button basic size='massive' icon='angle right' onClick={this.scrollDown} /></Table.Cell>
          </Table.Row>
        </Table>
      </div>
    );
  }
}
 
export default ReaderScreen;