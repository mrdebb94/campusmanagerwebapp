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
    token: string;
}

class CreateUserDialog extends React.Component<UsersProps, CreateUserDialogState> {

    public render() {
        return <div>
            <Dialog
                title="Új felhasználó létrehozása"
                modal={false}
                bodyStyle={styles.dialog}
                open={this.props.openUserDialog}
                autoScrollBodyContent={false}
                autoDetectWindowHeight={true}
                actions={[<FlatButton label="Hozzádás" primary={true} onClick={() => { this.props.addUser(); }} />,
                <FlatButton label="Mégse" primary={true} onClick={() => { this.props.toggleUserDialog(false); }} />]}
            >
                <TextField
                    floatingLabelText="Felhasználónév"
                    floatingLabelFixed={true}
                    value={this.props.editedUser ? this.props.editedUser.name : ''}
                    onChange={(event) => { let target = event.target as HTMLInputElement; this.props.modifyEditedUser({ ...this.props.editedUser, name: target.value }); }}
                /><br />
                <TextField
                    floatingLabelText="Jelszó"
                    floatingLabelFixed={true}
                    value={this.props.editedUser ? this.props.editedUser.password : ''}
                    onChange={(event) => { let target = event.target as HTMLInputElement; this.props.modifyEditedUser({ ...this.props.editedUser, password: target.value }); }}
                /><br />
                <TextField
                    floatingLabelText="E-mail"
                    floatingLabelFixed={true}
                    value={this.props.editedUser ? this.props.editedUser.email : ''}
                    onChange={(event) => { let target = event.target as HTMLInputElement; this.props.modifyEditedUser({ ...this.props.editedUser, email: target.value }); }}
                /><br />
                <SelectField
                    floatingLabelText="Típus"
                    value={this.props.editedUser ? this.props.editedUser.type : ''}
                    onChange={(event, index, value) => {
                        let target = event.target as HTMLInputElement;
                        this.props.modifyEditedUser({ ...this.props.editedUser, type: value });
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
