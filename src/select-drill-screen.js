import React, {Component} from 'react';
import './App.css';

import './semantic/dist/semantic.min.css';
import { Button, List, Icon, Transition, Form, Message, Segment, Popup } from 'semantic-ui-react';

import cards from './cards';
import CardsSelectorList from './card-selector-list';

class SelectDrillScreen extends Component {

  constructor(props) {
    super(props);

    this.toggleReadingDirection = this.toggleReadingDirection.bind(this);
    this.toggleHighlights = this.toggleHighlights.bind(this);
    this.toggleShuffle = this.toggleShuffle.bind(this);
    this.renderHighlightsButton = this.renderHighlightsButton.bind(this);
    this.renderReadingDirectionButton = this.renderReadingDirectionButton.bind(this);
    this.moveToNextScreen = this.moveToNextScreen.bind(this);
    this.save = this.save.bind(this);

    this.setElementsCallback = this.setElementsCallback.bind(this);

    this.state = {
      readForward: true,
      highlight: true,
      shuffle: false,

      setSceneCallback: props.setSceneCallback,
      elements: []
    };
  }

  UNSAFE_componentWillMount() {
    const fs = window.bypass.fs;
    var obj = JSON.parse(fs.readFileSync('src/assets/ui-select-drill-screen.json'));
    this.setState({
      readForward: obj.readForward,
      highlight: obj.highlight,
      shuffle: obj.shuffle
    });
  }

  save() {
    const fs = window.bypass.fs;
    fs.writeFileSync(
      'src/assets/ui-select-drill-screen.json',
      JSON.stringify({
        readForward: this.state.readForward,
        highlight: this.state.highlight,
        shuffle: this.state.shuffle
      }),
      err => {}
    );
  }

  toggleReadingDirection(e) {
    e.preventDefault();
    this.setState({
      readForward: !this.state.readForward
    });
  }
  
  toggleHighlights(e) {
    e.preventDefault();
    this.setState({
      highlight: !this.state.highlight
    });
  }

  toggleShuffle(e) {
    e.preventDefault();
    this.setState({
      shuffle: !this.state.shuffle
    });
  }

  setElementsCallback(elements) {
    console.log(elements);
    this.setState({ elements: elements });
  }

  renderHighlightsButton() {
    const color = this.state.highlight ? 'yellow' : 'grey';
    return (
      <Button
          color={color}
          content='Highlights'
          icon='align center'
          onClick={this.toggleHighlights}
          label={{ basic: true, pointing: 'left', content: this.state.highlight ? 'On':'Off' }}
      />
    );
  }

  moveToNextScreen(e) {
    this.save();

    var cardsFrom = [];
    this.state.elements.forEach(elem => {
      const id = new cards.CardDBIdentifier(elem.filename, elem.internalName);
      const targetDB = cards.findDB(id);
      
      if (targetDB != undefined && targetDB.selected) //TODO add something for 'Internal Database'
        cardsFrom.push(id);
    });

    this.state.setSceneCallback('reader', {
      highlight: this.state.highlight,
      readForward: this.state.readForward,
      cardsFrom: cardsFrom,
      shuffle: true,
      renderAdditionalFeatures: () => {}
    });
  }

  renderReadingDirectionButton() {
    const icon = this.state.readForward ? 'sort amount down' : 'sort amount up';
    return (
      <Button
          color='black'
          content='Reading Direction'
          icon={icon}
          onClick={this.toggleReadingDirection}
          label={{ basic: true, pointing: 'left', content: this.state.readForward ? 'Forward':'Backward' }}
      />
    );
  }

  renderShuffleButton() {
    const icon = this.state.shuffle ? 'shuffle' : 'ban';
    return (
      <Button 
        color='olive'
        content='Shuffle'
        icon={icon}
        onClick={this.toggleShuffle}
        label={{ basic: true, pointing: 'left', content: this.state.shuffle ? 'On':'Off' }}
      />
    );
  }

  render() {
    return (
    <div className="ui very padded text left aligned container segment">
      <h1 className="ui header">Options</h1>

      <Form>
        
        {this.renderHighlightsButton()}
        {this.renderReadingDirectionButton()}
        {this.renderShuffleButton()}

        <h3 className="ui header">Cards from</h3>
        <CardsSelectorList setElementsCallback={this.setElementsCallback}/>
        <Button
          positive
          icon
          labelPosition="right"
          onClick={this.moveToNextScreen}
        >
          Begin
          <Icon name='right arrow' />
        </Button>
      </Form>
      
    </div>
    );
  }
}

export default SelectDrillScreen;