import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import * as SessionStore from '../store/Session';
import { ApplicationState } from '../store';
import { StyledComponentProps, WithStyles, withStyles } from 'material-ui/styles';

const style = {
    button: {
        margin: 12
    },
    component: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    } as React.CSSProperties
};

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
    loginBox: {
        height: 180,
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        marginBottom: 2*theme.spacing.unit,
        width: 200,
    },
});

type LoginType = SessionStore.SettingsState &
    StyledComponentProps<'button' | 'textField' | 'loginBox'> &
    typeof SessionStore.actionCreators & 
    RouteComponentProps<{}>

class Login extends React.Component<LoginType, any> {
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            password: '',
            error: false,
            errorMessage:'' 
        };
    }

    componentWillReceiveProps(nextProps) {

        //hiba történt bejelentkezés során
        if (this.props.failedLogin == false
            && nextProps.failedLogin== true) {
            this.setState({
                error:true,
                errorMessage:'Hibás felhasználónév vagy jelszó'
            });
        
        } else if (this.props.failedLogin == true
            && nextProps.failedLogin == false) {
             this.setState({
                error:false,
                errorMessage:''
            });
        }



    }

    public render() {
        const { classes } = this.props;

        return (<div style={style.component}>
            {!this.props.authenticated &&
            <div className={classes!.loginBox}>
            <div>
            <TextField
                label={'Felhasználónév'}
                value={this.state.userName}
                error={this.state.error}
                helperText={this.state.errorMessage}
                className={classes!.textField}
                onChange={(event) => {
                    let target = event.target as HTMLInputElement;
                    this.setState({ userName: target.value });
                }}
            /></div>
            <div>
                <TextField
                    label="Jelszó"
                    type="password"
                    className={classes!.textField}
                    value={this.state.password}
                    error={this.state.error}
                    helperText={this.state.errorMessage}
                    onChange={(event) => {
                        let target = event.target as HTMLInputElement;
                        this.setState({ password: target.value });
                    }}
                /></div>
                <div>
                <Button
                    raised
                    color="primary"
                    className={classes!.button}
                    onClick={(event) => {
                        this.props.login(this.state.userName, this.state.password);
                    }}>
                    Belépés
                </Button>
                </div>
            </div>
            }
            {this.props.authenticated &&
                <div>
                    <Button
                        raised
                        color="primary"
                        className={classes!.button}
                        onClick={(event) => {
                            this.props.logout();
                        }}>
                        Kilépés
                    </Button>
                </div>}
        </div>)
    }
}

// Wire up the React component to the Redux store
export default connect(
    (state: ApplicationState) => state.session, // Selects which state properties are merged into the component's props
    SessionStore.actionCreators                 // Selects which action creators are merged into the component's props
)(withStyles(styles)(Login)) as typeof Login;