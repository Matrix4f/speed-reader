import React, {Component} from 'react';
import './App.css';

import exampleParagraph from './assets/example-paragraph.png';
import bg from './assets/background.jpg';

import './semantic/dist/semantic.min.css';
import { Button, Card, Image, Container, CardGroup, Header, Menu, Form } from 'semantic-ui-react';

class SpreadCard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      setSceneCallback: props.setSceneCallback
    };
  }

  execute = (e, { value }) => this.state.setSceneCallback('selectDrillScreen', { nextScene: 'reader', displayWPMOptions: false });

  render() {
    return (
      <Card>
        <Image src={exampleParagraph} />
        <Card.Content>
          <Card.Header>Spreading</Card.Header>
          <Card.Description>Practice with some drills</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Button fluid primary onClick={this.execute} content='Start'/>
        </Card.Content>
      </Card>
    );
  }
}

class WPMCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      setSceneCallback: props.setSceneCallback
    };
  }

  execute = (e, { value }) => this.state.setSceneCallback('selectDrillScreen', { nextScene: 'reader', displayWPMOptions: true });

  render() {
    return (
      <Card>
        <Image src={exampleParagraph} />
        <Card.Content>
          <Card.Header>WPM Tracker</Card.Header>
            <Card.Description>650 wpm 650 iq</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Button fluid content='Take the Test' secondary onClick={this.execute}/>
        </Card.Content>
      </Card>
    );
  }
}

class HomeMenuContents extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      setSceneCallback: props.setSceneCallback
    };
  }

  render() {
    return (
      <div>
        <Header as='h2' textAlign='center'>Home</Header>
        <Container textAlign='center'>
          <CardGroup centered>
            <SpreadCard setSceneCallback={this.state.setSceneCallback}/>
            <WPMCard setSceneCallback={this.state.setSceneCallback}/>
          </CardGroup>
        </Container>
      </div>
    );
  }
}

class WPMReportsMenuContents extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Header as='h2' textAlign='center'>WPM Rpeports</Header>
        
      </div>
    );
  }
}

class HeaderMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      setSceneCallback: props.setSceneCallback,
      selectedItem: 'home'
    };
    this.selectItem = this.selectItem.bind(this);
    this.renderMenuChildren = this.renderMenuChildren.bind(this);
  }

  selectItem(e, name) {
    e.preventDefault();
    this.setState({ selectedItem: name });
  }

  renderMenuChildren() {
    if (this.state.selectedItem == 'home')
      return <HomeMenuContents setSceneCallback={this.state.setSceneCallback}/>;
    else if (this.state.selectedItem == 'wpm')
      return <WPMReportsMenuContents />;
  }

  render() {
    
    return (
      <div>
        <Header as='h1' textAlign='center'>Speed Reader</Header>

        <Menu pointing secondary>
          <Menu.Item 
            name='home'
            onClick={e=> this.selectItem(e, 'home')}
            active={this.state.selectedItem == 'home'} 
          />
          <Menu.Item 
            name='WPM Reports' 
            onClick={e=> this.selectItem(e, 'WPM Reports')} 
            active={this.state.selectedItem == 'WPM Reports'} 
          />
          <Menu.Item
            name='help'
            onClick={e=> this.selectItem(e, 'help')} 
            active={this.state.selectedItem == 'help'} 
          />
          <Menu.Item
            name='about'
            onClick={e=> this.selectItem(e, 'about')}
            active={this.state.selectedItem == 'about'} 
          />
        </Menu>

        {this.renderMenuChildren()}
      </div>
    );
  }
}

class StartupScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      setSceneCallback: props.setSceneCallback
    };
  }

  componentWillMount() {
    document.body.style.backgroundImage = 'url(' + bg + ')';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';
     
  }

  render() {
    return (
      <div class="ui raised very padded text container segment">
        <HeaderMenu setSceneCallback={this.state.setSceneCallback} />
      </div>
    );
  }
}

export default StartupScreen;