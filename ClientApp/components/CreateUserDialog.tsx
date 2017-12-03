import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as UsersState from '../store/Users';
import { Dialog } from 'material-ui';
import { FlatButton } from 'material-ui';
import { TextField } from 'material-ui';
import { CookiesProvider, withCookies, Cookies } from 'react-cookie';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';


// At runtime, Redux will merge together...
type UsersProps =
    UsersState.UsersState       // ... state we've requested from the Redux store
    & typeof UsersState.actionCreators      // ... plus action creators we've requested
    & { cookies: Cookies }
const styles = {
    dialog: {
        height: 500
    }
}

interface CreateUserDialogState {
    editedUser: UsersState.User | null;
}

class CreateUserDialog extends React.Component<UsersProps, CreateUserDialogState> {

    constructor(props) {
        super(props);
        this.state = {
            editedUser:null
        }
    }

    componentWillReceiveProps(nextProps) {
        
         //fel fog nyílni a dialógusablak
         if(this.props.openUserDialog==false
             &&nextProps.openUserDialog==true) {
             /*let key;
             if(nextProps.projectSubscribeDialog.subscribedMentor) {
                 key = nextProps.projectSubscribeDialog.subscribedMentor.projectCampusId;
             } else if(nextProps.projectSubscribeDialog.subscribedStudent) {
                 key = nextProps.projectSubscribeDialog.subscribedStudent.projectCampusId;
             }*/
             this.setState({
                 editedUser: { ...this.props.editedUser! }
             });
         //be fog záródni a dialógusablak
         } else if(this.props.openUserDialog==true
             &&nextProps.openUserDialog==false) {
             this.setState({
                 editedUser: null
             });
         }
         
     }

    public render() {
        return <div>
            <Dialog
                title="Új felhasználó létrehozása"
                modal={false}
                bodyStyle={styles.dialog}
                open={this.props.openUserDialog}
                autoScrollBodyContent={false}
                autoDetectWindowHeight={true}
                actions={[<FlatButton label="Hozzádás" primary={true} onClick={() => { this.props.addUser(this.state.editedUser!); }} />,
                <FlatButton label="Mégse" primary={true} onClick={() => { this.props.toggleUserDialog(false); }} />]}
            >
                <TextField
                    floatingLabelText="Felhasználónév"
                    floatingLabelFixed={true}
                    value={this.state.editedUser ? this.state.editedUser.name : ''}
                    onChange={(event) => { let target = event.target as HTMLInputElement; this.setState({ 
                        editedUser: { ...this.state.editedUser!, name: target.value }
                    }); 
                  }}
                /><br />
                <TextField
                    floatingLabelText="Jelszó"
                    floatingLabelFixed={true}
                    value={this.state.editedUser ? this.state.editedUser.password : ''}
                    onChange={(event) => { let target = event.target as HTMLInputElement; this.setState({ 
                        editedUser: { ...this.state.editedUser!, password: target.value }
                    });
                    }}
                /><br />
                <TextField
                    floatingLabelText="E-mail"
                    floatingLabelFixed={true}
                    value={this.state.editedUser ? this.state.editedUser.email : ''}
                    onChange={(event) => { let target = event.target as HTMLInputElement; this.setState({ 
                        editedUser: { ...this.state.editedUser!, email: target.value }
                    });
                    }}
                /><br />
                <SelectField
                    floatingLabelText="Típus"
                    value={this.state.editedUser ? this.state.editedUser.type : ''}
                    onChange={(event, index, value) => {
                
                        //this.props.modifyEditedUser({ ...this.props.editedUser, type: value });
                        this.setState({ 
                        editedUser: { ...this.state.editedUser!, type: value }
                    });
                    }}
                >
                    <MenuItem value={"User"} primaryText="Felhasználó" />
                    <MenuItem value={"Admin"} primaryText="Adminisztrátor" />
                    <MenuItem value={"Student"} primaryText="Tanuló" />
                    <MenuItem value={"Mentor"} primaryText="Mentor" />
                </SelectField>
            </Dialog>
        </div>;
    }
}

// Wire up the React component to the Redux store
export default connect(
    (state: ApplicationState) => state.users, // Selects which state properties are merged into the component's props
    UsersState.actionCreators                 // Selects which action creators are merged into the component's props
)(CreateUserDialog) as typeof CreateUserDialog;
