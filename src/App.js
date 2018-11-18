import React, { Component } from 'react';
import './App.css';
import StartupScreen from './startup-screen';

import './semantic/dist/semantic.min.css';
import { Button, Card, Image, Container, CardGroup } from 'semantic-ui-react';
import SelectDrillScreen from './select-drill-screen';

class App extends Component {

  render() {
    return (
      <div className="App">
        <SelectDrillScreen />
      </div>
    );
  }
}

export default App;
