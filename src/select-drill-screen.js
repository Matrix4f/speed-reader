import React, {Component} from 'react';
import fileDialog from 'file-dialog';
import './App.css';

import './semantic/dist/semantic.min.css';
import { Button, List, Icon, Transition, Form, Segment, Header, Popup } from 'semantic-ui-react';

import cards from './cards';

class CardDocumentListElement extends Component {

  constructor(props) {
    super(props);
    this.state = {
      header: props.filename,
      internalName: props.internalName,
      description: props.description,

      removeCallback: props.removeCallback,
      menuVisible: false,
      selected: true
    };

    this.toggleMenu = this.toggleMenu.bind(this);
    this.toggle = this.toggle.bind(this);
    this.removeElement = this.removeElement.bind(this);
    this.sync = this.sync.bind(this);
  }

  toggle(e) {
    e.preventDefault();

    this.setState({
      selected: !this.state.selected
    });
  }

  toggleMenu(e) {
    e.preventDefault();

    // if (this.state.header !== 'Internal Database')
      this.setState({ menuVisible: !this.state.menuVisible });
  }

  removeElement(e) {
    e.preventDefault();

    this.state.removeCallback(this.state.header, this.state.internalName, this.state.description);
  }

  sync(e) {
    e.preventDefault();
  }

  render() {
    return (
      <List.Item as='a'>
        <Icon 
          onClick={this.toggleMenu}
          color={this.state.selected ? 'blue' : 'grey'}
          name='file word'
          size='large'
        />
        <List.Content onClick={this.toggle}>
          <List.Header>{this.state.header}</List.Header>
          <List.Description>
            {this.state.description}
          </List.Description>
        </List.Content>

        <Transition visible={this.state.menuVisible} animation='scale' duration={500}>
          <div style={{marginTop: '10px'}}>
              <Button basic icon='delete' content='Remove' onClick={this.removeElement}/>
              <Button basic icon='sync' content='Sync' onClick={this.sync}/>
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
          console.log(`Added ${db.id.internalName}`);
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
      elements: [
        {
          filename: 'Internal Database',
          internalName: 'db-0',
          description: 'A default set of cards that comes installed with Speed Reader'
        }
      ]
    };

  }

  addCardListElement(filename, internalName, description) {
    this.setState({
      elements: this.state.elements.concat([{
        filename: filename,
        internalName: internalName,
        description: description
      }])
    });
  }

  removeCardListElement(filename, internalName, description) {
    var elem = this.state.elements.find(elem => (elem.filename == filename && elem.internalName == internalName && elem.description == description));
    cards.removeDB(new cards.CardDBIdentifier(elem.filename, elem.internalName));

    this.setState({
      elements: this.state.elements.filter(elem => !(elem.filename == filename && elem.description == description))
    });
  }

  renderCardListElement(element) {
    return (<CardDocumentListElement filename={element.filename} internalName={element.internalName} description={element.description} removeCallback={this.removeCardListElement}/>);
  }

  UNSAFE_componentWillMount() {
    cards.loadDBs();

    var newElements = [];
    cards.getDBs().forEach(db => {  
      newElements.push({
        filename: db.id.name,
        internalName: db.id.internalName,
        description: db.description
      });
    });
    this.setState({ elements: this.state.elements.concat(newElements)});
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


    this.state = {
      readForward: true,
      highlight: true
    };
  }

  UNSAFE_componentWillMount() {
    const fs = window.bypass.fs;
    if (fs.existsSync(''));
  }

  render() {
    return (
    <div className="ui very padded text left aligned container segment">
      <h1 className="ui header">Options</h1>
      <Form>
        <Button
          color='black'
          content='Reading Direction'
          icon='sort amount down'
          label={{ basic: true, pointing: 'left', content: this.state.readForward ? 'Forward':'Backward' }}
        />
        <Button
          color='yellow'
          content='Highlights'
          icon='align center'
          label={{ basic: true, pointing: 'left', content: this.state.highlight ? 'On':'Off' }}
        />

        <h3 className="ui header">Cards from</h3>
        <CardsSelectorList />
        <Button
          positive
          icon
          labelPosition="right"
        >
          Continue
          <Icon name='right arrow' />
        </Button>
      </Form>
      
    </div>
    );
  }
}

export default SelectDrillScreen;