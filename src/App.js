import React, { Component } from 'react';
import './App.css';

import StartupScreen from './startup-screen';
import SelectDrillScreen from './select-drill-screen';
import ReaderScreen from './reader-screen';
import cards from './cards';

class App extends Component {

  constructor(props) {
    super(props);

    // cards.loadDBs();
    this.state = {
      // scene: 'reader',
      // sceneOptions: {
        // highlight: true,
        // readForward: true,
        // cardsFrom: [
          // new cards.CardDBIdentifier('2AC Case', 'db-1')
        // ]
      // },
      scene: 'startup',
      sceneMap: {
        startup: StartupScreen,
        selectDrillScreen: SelectDrillScreen,
        reader: ReaderScreen
      }
    };

    this.setScene = this.setScene.bind(this);
  }

  setScene(scene, otherProps) {
    this.setState({
      scene: scene,
      sceneOptions: otherProps
    });
  }

  createScene(type) {
    return React.createElement(type, { setSceneCallback: this.setScene, sceneOptions: this.state.sceneOptions }, null);
  }

  render() {
    return (
      <div className="App">
        {this.createScene(this.state.sceneMap[this.state.scene])}
      </div>
    );
  }
}

export default App;
