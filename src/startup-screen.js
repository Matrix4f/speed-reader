import React, {Component} from 'react';
import './App.css';

import exampleParagraph from './assets/example-paragraph.png';
import bg from './assets/background-cards.png';

import './semantic/dist/semantic.min.css';
import { Button, Card, Image, Container, CardGroup, Header } from 'semantic-ui-react';

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

class MenuItems extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      setSceneCallback: props.setSceneCallback
    };
  }

  render() {
    return (
      <div>
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

class StartupScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      setSceneCallback: props.setSceneCallback
    };
  }

  componentWillMount() {
    document.body.style.backgroundImage = 'url(' + bg + ')';
  }

  render() {
    return (
      <div className="ui raised very padded text container segment">
        <Header as='h1' textAlign='center'>Speed Reader</Header>
        <MenuItems setSceneCallback={this.state.setSceneCallback}/>
      </div>
    );
  }
}

export default StartupScreen;