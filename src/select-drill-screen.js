import React, {Component} from 'react';
import './App.css';

import './semantic/dist/semantic.min.css';
import { Button, Checkbox, Icon, Form, Header, Dropdown, Menu } from 'semantic-ui-react';

import cards from './cards';
import CardsSelectorList from './card-selector-list';

class SelectDrillScreen extends Component {

  constructor(props) {
    super(props);

    this.renderHighlightsButton = this.renderHighlightsButton.bind(this);
    this.renderReadingDirectionButton = this.renderReadingDirectionButton.bind(this);
    this.moveToNextScreen = this.moveToNextScreen.bind(this);
    this.save = this.save.bind(this);

    this.setElementsCallback = this.setElementsCallback.bind(this);

    this.state = {
      readForward: true,
      highlight: true,
      shuffle: false,

      nextScene: props.sceneOptions.nextScene,
      displayWPMOptions: props.sceneOptions.displayWPMOptions,
      setSceneCallback: props.setSceneCallback,
      elements: []
    };
  }

  toggleHighlights = (e, { value }) => this.setState({ highlight: !this.state.highlight });
  toggleReadForward = (e, { value }) => this.setState({ readForward: !this.state.readForward });
  toggleShuffle = (e, { value }) => this.setState({ shuffle: !this.state.shuffle });
  setPreferredWords = (e, { value }) => this.setState({ preferredWords: value });

  showStartScreen = (e) => {this.state.setSceneCallback('startup', {});}

  UNSAFE_componentWillMount() {
    const fs = window.bypass.fs;
    var obj = JSON.parse(fs.readFileSync('src/assets/ui-select-drill-screen.json'));
    this.setState({
      readForward: obj.readForward,
      highlight: obj.highlight,
      shuffle: obj.shuffle,
      preferredWords: obj.preferredWords
    });
  }

  save() {
    const fs = window.bypass.fs;
    fs.writeFileSync(
      'src/assets/ui-select-drill-screen.json',
      JSON.stringify({
        readForward: this.state.readForward,
        highlight: this.state.highlight,
        shuffle: this.state.shuffle,
        preferredWords: this.state.preferredWords
      }),
      err => {}
    );
  }

  setElementsCallback(elements) {
    console.log(elements);
    this.setState({ elements: elements });
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

    this.state.setSceneCallback(this.state.nextScene, {
      highlight: this.state.highlight,
      readForward: this.state.readForward,
      shuffle: this.state.shuffle,
      preferredWords: (this.state.displayWPMOptions ? this.state.preferredWords : undefined),
      
      cardsFrom: cardsFrom,
      renderAdditionalFeatures: () => {}
    });
  }

  renderHighlightsButton() {
    return (
      <Form.Field>
        <Checkbox label='Highlight' onClick={this.toggleHighlights} checked={this.state.highlight}/>
      </Form.Field>
    );
  }

  renderReadingDirectionButton() {
    return (
      <Form.Field>
        <Checkbox label='Read backward' onClick={this.toggleReadForward} checked={!this.state.readForward}/>
      </Form.Field>
    );
  }

  renderShuffleButton() {
    return (
      <Form.Field>
        <Checkbox label='Shuffle order' onClick={this.toggleShuffle} checked={this.state.shuffle}/>
      </Form.Field>
    );
  }

  displayWPMOptions() {
    if (!this.state.displayWPMOptions)
      return '';

    return (
      <Form.Group inline>
        <label>Preferred Length</label>
        <Dropdown defaultValue={this.state.preferredWords} selection options={[
          { key: 1, text: '300 words', value: 300 },
          { key: 2, text: '400 words', value: 400 },
          { key: 3, text: '500 words', value: 500 },
          { key: 4, text: '750 words', value: 750 },
          { key: 5, text: '1000 words', value: 1000 },
        ]} onChange={this.setPreferredWords}/>
      </Form.Group>
    );
  }

  render() {
    return (
    <div className="ui very padded text left aligned container segment">
    
      <Header as="h1">
        Options
      </Header>

      <Form>
      
        {this.renderHighlightsButton()}
        {this.renderReadingDirectionButton()}
        {this.renderShuffleButton()}
        {this.displayWPMOptions()}

        <h3 className="ui header">Cards from</h3>
        <CardsSelectorList setElementsCallback={this.setElementsCallback}/>
        
        <Button.Group>
          <Button
              icon
              labelPosition="left"
              onClick={this.showStartScreen}>
              Back
              <Icon name='left arrow' />
          </Button>
          <Button.Or />
          <Button
            positive
            icon
            labelPosition="right"
            onClick={this.moveToNextScreen}>
            Begin
            <Icon name='right arrow' />
          </Button>
        </Button.Group>
      </Form>
      
    </div>
    );
  }
}

export default SelectDrillScreen;