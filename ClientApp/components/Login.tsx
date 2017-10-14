import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import * as SessionStore from '../store/Session';
import { ApplicationState } from '../store';

const style = {
  button: {
    margin: 12
  },
  component: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  } as React.CSSProperties
};

class Login extends React.Component<any, any> {
    constructor() {
        super();
        this.state = {
            userName: '',
            password: ''
        };
    }

    public render() {
        return (<div style={style.component}>
          {!this.props.authenticated&&<div><TextField
                hintText={''}
                floatingLabelText={'Felhasználónév'}
                value={this.state.userName}
                onChange={(event) => {
                    let target = event.target as HTMLInputElement;
                    this.setState({ userName: target.value });
                }}
            /><br />
            <TextField
                hintText=""
                floatingLabelText="Jelszó"
                type="password"
                value={this.state.password}
                onChange={(event) => {
                    let target = event.target as HTMLInputElement;
                    this.setState({ password: target.value });
                }}
            /><br />
            <RaisedButton label="Belépés" primary={true} style={style.button} onClick={ (event) => {
                this.props.login(this.state.userName, this.state.password);} } />
          </div>}
          {this.props.authenticated&&
              <div><RaisedButton label="Kilépés" primary={true} style={style.button} onClick={ (event) => {
                this.props.logout(); } } /></div>}
        </div>)
    }
}

// Wire up the React component to the Redux store
export default connect(
    (state: ApplicationState) => state.session, // Selects which state properties are merged into the component's props
    SessionStore.actionCreators                 // Selects which action creators are merged into the component's props
)(Login) as typeof Login;