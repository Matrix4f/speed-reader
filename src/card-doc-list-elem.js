import React, {Component} from 'react';
import './App.css';

import { Button, List, Icon, Transition, Popup } from 'semantic-ui-react';
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

export default CardDocumentListElement;