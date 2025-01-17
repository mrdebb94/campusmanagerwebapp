import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as UsersState from '../store/Users';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { WithStyles, StyledComponentProps, withStyles } from '@material-ui/core/styles';
import MenuItem  from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';


type UsersProps =
    UsersState.UsersState
    & typeof UsersState.actionCreators
    & WithStyles<'dialog' | 'button'>;

const styles = theme => ({
    dialog: {
        height: 500
    },
    button: {
        margin: theme.spacing.unit,
    },
});

interface CreateUserDialogState {
    editedUser: UsersState.User | null;
}

class CreateUserDialog extends React.Component<UsersProps, CreateUserDialogState> {

    constructor(props) {
        super(props);
        this.state = {
            editedUser: null
        }
    }

    componentWillReceiveProps(nextProps) {
        //fel fog nyílni a dialógusablak
        if (this.props.openUserDialog == false
            && nextProps.openUserDialog == true) {
                //van kijelölve felhasználó
            if (nextProps.editedUser != null) {
                this.setState({
                    editedUser: { ...nextProps.editedUser! }
                });
            } else {
                //nincs kijelölve felhasználó
                this.setState({
                    editedUser: { userName:'', name: '', email:'', password:'', type:'User'}
                });
            }
        //be fog záródni a dialógusablak
        } else if (this.props.openUserDialog == true
            && nextProps.openUserDialog == false) {
            this.setState({
                editedUser: null
            });
        }
    }

    public render() {
        const { classes } = this.props;
    
        return <div>
            <Dialog
                aria-labelledby="user-dialog-title"
                open={this.props.openUserDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle id="user-dialog-title">Új felhasználó létrehozása</DialogTitle>
                <DialogContent>
                    <form noValidate autoComplete="off">
                        <div>
                            <TextField
                                label="Teljes név:"
                                value={this.state.editedUser!=null ? this.state.editedUser.name : ''}
                                onChange={(event) => {
                                    let target = event.target as HTMLInputElement; this.setState({
                                        editedUser: { ...this.state.editedUser!, name: target.value }
                                    });
                                }}
                                error={this.props.userFormError.name!=''}
                                helperText={this.props.userFormError.name}
                            />
                        </div>
                        <div>
                            <TextField
                                label="Felhasználónév"
                                value={this.state.editedUser!=null ? this.state.editedUser.userName : ''}
                                onChange={(event) => {
                                    let target = event.target as HTMLInputElement;
									this.setState({
                                        editedUser: { ...this.state.editedUser!, userName: target.value }
                                    });
                                }}
								error={this.props.userFormError.userName!=''}
                                helperText={this.props.userFormError.userName}
                            />
                        </div>
                        <div>
                            <TextField
                                label="Jelszó"
                                value={this.state.editedUser!=null ? this.state.editedUser.password : ''}
                                onChange={(event) => {
                                    let target = event.target as HTMLInputElement; this.setState({
                                        editedUser: { ...this.state.editedUser!, password: target.value }
                                    });
                                }}
								error={this.props.userFormError.password!=''}
                                helperText={this.props.userFormError.password}
                            />
                        </div>
                        <div>
                            <TextField
                                label="E-mail"
                                value={this.state.editedUser!=null ? this.state.editedUser.email : ''}
                                onChange={(event) => {
                                    let target = event.target as HTMLInputElement; this.setState({
                                        editedUser: { ...this.state.editedUser!, email: target.value }
                                    });
                                }}
								error={this.props.userFormError.email!=''}
                                helperText={this.props.userFormError.email}
                            />
                        </div>
                        <div>

                            <InputLabel htmlFor="role-helper">Típus</InputLabel>
                            <Select
                                value={this.state.editedUser != null ? this.state.editedUser.type : 'User'}
                                onChange={(event) => {
                                    this.setState({
                                        editedUser: { ...this.state.editedUser!, type: event.target.value }
                                    });
                                }
                                }
                                inputProps={{
                                    name: 'role',
                                    id: 'role-helper',
                                }}
                            >
                                <MenuItem value={"User"}>Felhasználó</MenuItem>
                                <MenuItem value={"Admin"}>Adminisztrátor</MenuItem>
                            </Select>

                        </div>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        className={classes!.button}
                        onClick={() => {
                            this.props.addUser(this.state.editedUser!);
                        }
                        }
                    >
                        Hozzáadás
                    </Button>,
                    <Button
                        color="primary"
                        className={classes!.button}
                        onClick={() => {
                            this.props.toggleUserDialog(false);
                        }
                        }

                    >
                        Mégse
                    </Button>
                </DialogActions>
            </Dialog>
        </div>;
    }
}

// Wire up the React component to the Redux store
export default connect(
    (state: ApplicationState) => state.users, // Selects which state properties are merged into the component's props
    UsersState.actionCreators                 // Selects which action creators are merged into the component's props
)(withStyles(styles)(CreateUserDialog)) as React.ComponentClass<{}>;
