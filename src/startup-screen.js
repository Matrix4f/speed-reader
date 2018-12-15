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

    this.execute = this.execute.bind(this);
  }

  execute(e) {
    this.state.setSceneCallback('selectDrillScreen', {});
  }

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

  render() {
    return (
      <Card>
        <Image src={exampleParagraph} />
        <Card.Content>
          <Card.Header>WPM Tracker</Card.Header>
            <Card.Description>650 wpm 650 iq</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Button fluid content='Take the Test' secondary />
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

class PrefsMenuContents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: 'yellow'
    };
  }

  selectColor = (e, { value }) => this.setState({ color: value });

  render() {
    const color = this.state.color;
    return (
      <div>
        <Header as='h2' textAlign='center'>Preferences</Header>
        <Form>
          <Form.Group inline>
            <label>Size</label>
            <Form.Radio
              label='Yellow'
              value='yellow'
              checked={color === 'yellow'}
              onChange={this.selectColor}
            />
            <Form.Radio
              label='Blue'
              value='blue'
              checked={color === 'blue'}
              onChange={this.selectColor}
            />
            <Form.Radio
              label='Green'
              value='green'
              checked={color === 'green'}
              onChange={this.selectColor}
            />
          </Form.Group>
        </Form>
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
    else if (this.state.selectedItem == 'preferences')
      return <PrefsMenuContents />;
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
            name='preferences' 
            onClick={e=> this.selectItem(e, 'preferences')} 
            active={this.state.selectedItem == 'preferences'} 
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