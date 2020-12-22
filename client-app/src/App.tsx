import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { Header, Icon } from 'semantic-ui-react';

class App extends Component {

    state = {
        values: []
    }

    componentDidMount() {
        axios.get("http://localhost:5000/api/values").then((response) => {
            console.log(response)
            this.setState({
                values: response.data
            })
        })
    }

    render() {
        return (
            <div className="App">
                <Header as='h2'>
                    <Icon name='users' />
                    <Header.Content>Reactivities</Header.Content>
                </Header>
                <ul>
                    {this.state.values.map((value: any) => { 
                        return <li key={value.id}>{value.name}</li>
                    })}
                </ul>

            </div>
          );
    }
}

export default App;
