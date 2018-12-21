import React, {Component} from 'react';
import './App.css';

import './semantic/dist/semantic.min.css';
import { Button, Label, Header, Table, Icon } from 'semantic-ui-react';
import wpm from './wpm-reports';

class WPMResultsScreen extends Component {

  constructor(props) {
    super(props);
    const options = props.sceneOptions;

    this.state = {
      timeTaken: options.timeTaken,
      wordsRead: options.wordsRead,
      preferredWords: options.preferredWords,
      setSceneCallback: props.setSceneCallback,
      wpm: 0,

      saved: false
    };

    this.state.wpm = Math.floor(this.state.wordsRead*(60000/this.state.timeTaken));
  }

  retake = e => this.state.setSceneCallback('selectDrillScreen', { nextScene: 'reader', displayWPMOptions: true });
  return = e => this.state.setSceneCallback('startup', { });
  save = e => {
    const date = new Date();
    wpm.addReport(new wpm.WPMReport(date.toDateString(), date.toTimeString(), this.state.wpm));
    this.setState({ saved: true });
  };

  formatTime(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const decimal = (ms % 1000)/1000;

    const minutesText = minutes == 0 ? '' : `${minutes} minutes, `;
    return `${minutesText}${seconds + decimal} seconds (${ms}ms)`
  }

  renderSaveButton() {
    if (this.state.saved)
      return (
        <div>
          <Button secondary disabled labelPosition='left' icon='download' content='Saved' />
          <p>
            To view this report, go under <b>WPM Reports</b> in the <b>Main Menu</b>.
          </p>
        </div>
      );
    else
      return <Button secondary labelPosition='left' icon='download' content='Save Report' onClick={this.save} />;
  }

  render() {
    return (
    <div className="ui very padded text left aligned container segment">
  
      <Header as="h1">
        Results
      </Header>
      
      <Label as='a' ribbon>
        Summary
      </Label>

      <p>
        You read&nbsp;
        <span style={{fontSize: '125%', fontWeight: 'bold', fontFamily: 'monospace'}}>{this.state.wpm}</span>
        &nbsp;words per minute.
      </p>

      <Table celled padded>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>
              Statistic
            </Table.HeaderCell>
            <Table.HeaderCell>Value</Table.HeaderCell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              Time Taken
            </Table.Cell>
            <Table.Cell>
              {this.formatTime(this.state.timeTaken)}
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              Preferred Word Count
            </Table.Cell>
            <Table.Cell>
              {this.state.preferredWords}
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              Actual Words Read
            </Table.Cell>
            <Table.Cell>
              {this.state.wordsRead}
            </Table.Cell>
          </Table.Row>
        </Table.Header>
      </Table>
    
      {this.renderSaveButton()}

      <Table>
        <Table.Row>
          <Table.Cell>
            <Button fluid color='teal' labelPosition='left' icon='redo' content='Retake' onClick={this.retake}/>
          </Table.Cell>
          <Table.Cell>
            <Button fluid color='blue' labelPosition='left' icon='home' content='Return' onClick={this.return}/>
          </Table.Cell>
        </Table.Row>
      </Table>
    </div>
    );
  }
}

export default WPMResultsScreen;