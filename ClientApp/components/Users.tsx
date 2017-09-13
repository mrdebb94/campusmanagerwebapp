import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as UsersStore from '../store/Users';
import { RaisedButton } from 'material-ui';
import CreateUserDialog from './CreateUserDialog';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import { CookiesProvider, withCookies, Cookies } from 'react-cookie';

// At runtime, Redux will merge together...
type UsersProps =
  UsersStore.UsersState        // ... state we've requested from the Redux store
  & typeof UsersStore.actionCreators      // ... plus action creators we've requested
  & RouteComponentProps<{}>
  & {cookies:Cookies}

class Users extends React.Component<UsersProps, {}> {

  constructor() {
    super();
    //this.props.setUsersList();
    //this.openUserDialog.bind(this);
  }

  openUserDialog(event: any) {
    this.props.toggleUserDialog(true);
  }

  componentDidMount() {
    this.props.setUsersList();
  }

  public render() {
    return <div>
        <CreateUserDialog {...this.props} />
      <Toolbar>
        <ToolbarGroup>
          <RaisedButton label="Új felhasználó" primary={true} onClick={() => { this.props.toggleUserDialog(true); }} />
        </ToolbarGroup>
      </Toolbar>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderColumn>Felhasználónév</TableHeaderColumn>
            <TableHeaderColumn>Jelszó</TableHeaderColumn>
            <TableHeaderColumn>E-mail</TableHeaderColumn>
            <TableHeaderColumn>Típus</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody>
          {this.props.usersList.map((user) =>
            <TableRow key={user.userId}>
              <TableRowColumn>{user.name}</TableRowColumn>
              <TableRowColumn>{user.password}</TableRowColumn>
              <TableRowColumn>{user.email}</TableRowColumn>
              <TableRowColumn>{user.type}</TableRowColumn>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  }
}

// Wire up the React component to the Redux store
export default connect(
  (state: ApplicationState) => state.users, // Selects which state properties are merged into the component's props
  UsersStore.actionCreators                 // Selects which action creators are merged into the component's props
)(withCookies(Users)) as typeof Users;
