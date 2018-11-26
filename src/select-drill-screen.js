import React, {Component} from 'react';
import fileDialog from 'file-dialog';
import './App.css';

import './semantic/dist/semantic.min.css';
import { Button, List, Icon, Transition, Form, Message, Segment, Popup } from 'semantic-ui-react';

import cards from './cards';

class CardDocumentListElement extends Component {

  constructor(props) {
    super(props);
    this.state = {
      header: props.filename,
      internalName: props.internalName,
      description: props.description,

      removeCallback: props.removeCallback,
      syncCallback: props.syncCallback,

      popupVisible: false,
      popupContent: '',

      isNewElement: props.isNewElement,
      menuVisible: false,
      selected: props.selected
    };

    this.toggleMenu = this.toggleMenu.bind(this);
    this.toggle = this.toggle.bind(this);
    this.removeElement = this.removeElement.bind(this);
    this.sync = this.sync.bind(this);
  }

  toggle(e) {
    e.preventDefault();

    var selected = !this.state.selected;
    this.setState({
      selected: selected
    });
    cards.findDB(new cards.CardDBIdentifier(this.state.header, this.state.internalName)).selected = selected;
    cards.saveDBs();
  }

  toggleMenu(e) {
    e.preventDefault();

    if (this.state.header !== 'Internal Database')
      this.setState({ menuVisible: !this.state.menuVisible });
  }

  removeElement(e) {
    e.preventDefault();

    this.state.removeCallback(this.state.header, this.state.internalName, this.state.description);
  }

  sync(e) {
    e.preventDefault();

    this.state.syncCallback(this.state.header, this.state.internalName).done(result => {
      if (result) {
        this.setState({
          popupVisible: true,
          popupContent: 'Synced with filesystem'
        });
      }
    });
  }

  componentDidMount() {
    this.setState({
      popupVisible: this.state.isNewElement,
      popupContent: 'Imported cards'
    });
  }

  render() {
    return (
      <List.Item as='a'>
        <Popup
          trigger={<Icon 
            onClick={this.toggle}
            color={this.state.selected ? 'blue' : 'grey'}
            name='file alternate'
            size='large'
          />}

          content={this.state.popupContent}
          position='left center'

          open={this.state.popupVisible}
            
          onClick={() => {this.setState({popupVisible: false})}}
        />
        
        <List.Content onClick={this.toggleMenu}>
          <List.Header>{this.state.header}</List.Header>
          <List.Description>
            {this.state.description}
          </List.Description>
        </List.Content>

        <Transition visible={this.state.menuVisible} animation='scale' duration={500}>
          <div style={{marginTop: '10px'}}>
            <Button.Group basic>
              <Button icon={this.state.selected ? 'eye slash' : 'eye'} content={this.state.selected ? 'Disable' : 'Enable'} onClick={this.toggle}/>
              <Button icon='delete' content='Remove' onClick={this.removeElement}/>
              <Button icon='sync' content='Sync' onClick={this.sync}/>
            </Button.Group>
          </div>
        </Transition>
      </List.Item>
    );
  }
}

class ImportCardsListElement extends Component {
  constructor(props) {
    super(props);
    this.openDialog = this.openDialog.bind(this);

    this.state = {
      addCardCallback: props.addCardCallback
    };
  }

  openDialog(e) {
    e.preventDefault();

    var date = new Date();
    fileDialog({
      accept: '.docx',
      multiple: true
    }).then(files => {
      for (var i=0; i<files.length; i++) {
        var file = files.item(i);
        
        var filename = file.name.substring(0, file.name.length - 5);
        var description = `${file.path} on ${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()-2000}`;
        var addCardCallback = this.state.addCardCallback;

        cards.newCardDB(filename, description, file.path).then(db => {
          addCardCallback(db.id.name, db.id.internalName, db.description);
        }).done();
      }
    });
  }

  render() {
    return (
      <List.Item as='a' onClick={this.openDialog}>
        <Icon color='green' name='plus'/>
        <List.Content>
            <List.Header>New</List.Header>
            <List.Description>
              Import cards to read from a particular word document (.docx file)
            </List.Description>
        </List.Content>
      </List.Item>
    );
  }
}

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

class SelectDrillScreen extends Component {

  constructor(props) {
    super(props);

    this.toggleReadingDirection = this.toggleReadingDirection.bind(this);
    this.toggleHighlights = this.toggleHighlights.bind(this);
    this.renderHighlightsButton = this.renderHighlightsButton.bind(this);
    this.renderReadingDirectionButton = this.renderReadingDirectionButton.bind(this);
    this.moveToNextScreen = this.moveToNextScreen.bind(this);
    this.save = this.save.bind(this);

    this.setElementsCallback = this.setElementsCallback.bind(this);

    this.state = {
      readForward: true,
      highlight: true,

      setSceneCallback: props.setSceneCallback,
      elements: []
    };
  }

  UNSAFE_componentWillMount() {
    const fs = window.bypass.fs;
    var obj = JSON.parse(fs.readFileSync('src/assets/ui-select-drill-screen.json'));
    this.setState({
      readForward: obj.readForward,
      highlight: obj.highlight
    });
  }

  save() {
    const fs = window.bypass.fs;
    fs.writeFileSync(
      'src/assets/ui-select-drill-screen.json',
      JSON.stringify({
        readForward: this.state.readForward,
        highlight: this.state.highlight
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

    this.state.setSceneCallback('reader', {
      highlight: this.state.highlight,
      readForward: this.state.readForward,
      cardsFrom: cardsFrom
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

  render() {
    return (
    <div className="ui very padded text left aligned container segment">
      <h1 className="ui header">Options</h1>

      <Form>
        
        {this.renderHighlightsButton()}
        {this.renderReadingDirectionButton()}

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