import React, {Component} from 'react';
import './App.css';

import exampleParagraph from './assets/example-paragraph.png';
import bg from './assets/background-cards.png';

import './semantic/dist/semantic.min.css';
import { Button, Card, Image, Container, CardGroup } from 'semantic-ui-react';

function SpreadCard() {
    return (
        <Card>
        <Image src={exampleParagraph} />
        <Card.Content>
            <Card.Header>Spreading  </Card.Header>
            <Card.Description>Practice with some drills</Card.Description>
        </Card.Content>
        <Card.Content extra>
            <Button fluid primary>
            Start
            </Button>
        </Card.Content>
        </Card>
    );
}

function WPMCard() {
    return (
        <Card>
        <Image src={exampleParagraph} />
        <Card.Content>
            <Card.Header>WPM Tracker</Card.Header>
            <Card.Description>650 wpm 650 iq</Card.Description>
        </Card.Content>
        <Card.Content extra>
            <Button fluid content secondary>
            Take the Test
            </Button>
        </Card.Content>
        </Card>
    );
}

function MenuItems() {
    return (
        <div>
            <Container textAlign='center'>
                <CardGroup centered>
                    <SpreadCard />
                    <WPMCard />
                </CardGroup>
            </Container>
        </div>
    );
}

class StartupScreen extends Component {

    componentWillMount() {
        document.body.style.backgroundImage = 'url(' + bg + ')';
    }

    render() {
        return (
            <div class="ui raised very padded text container segment">
                <h1>Speed Reader</h1>
                <MenuItems />
            </div>
        );
    }
}

export default StartupScreen;