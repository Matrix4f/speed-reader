import React, {Component} from 'react';
import fileDialog from 'file-dialog';
import './App.css';

import { List, Icon } from 'semantic-ui-react';
import cards from './cards';

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
              Import cards to read from a Word doc (.docx file)
            </List.Description>
        </List.Content>
      </List.Item>
    );
  }
}

export default ImportCardsListElement;