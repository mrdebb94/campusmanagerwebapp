import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as UsersStore from '../store/Users';
import * as SessionStore from '../store/Session';
import Button from 'material-ui/Button';
import CreateUserDialog from './CreateUserDialog';
import Card, { CardHeader, CardMedia, CardContent, CardActions } from 'material-ui/Card';
import  Table, {
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from 'material-ui/Table';
import Toolbar from 'material-ui/Toolbar';
import Paper from 'material-ui/Paper';
import { StyledComponentProps, WithStyles, withStyles } from 'material-ui/styles';

// At runtime, Redux will merge together...
type UsersProps =
  UsersStore.UsersState        // ... state we've requested from the Redux store
  & typeof UsersStore.actionCreators      // ... plus action creators we've requested
  & typeof SessionStore.actionCreators 
  & RouteComponentProps<{}>
  & StyledComponentProps<'root'|'tableWrapper'>;

  const styles = theme => ({
    root: {
      width: '100%',
      marginTop: theme.spacing.unit * 3,
    },
    tableWrapper: {
      overflowX: 'auto',
    } as React.CSSProperties
  });

class Users extends React.Component<UsersProps, {}> {

  constructor(props) {
    super(props);
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
	const { classes } = this.props;
    return <div>
      <Paper className={classes!.root}>
      <Toolbar>
        <div>
        <Button
                color="primary" 
                onClick={() => { this.props.toggleUserDialog(true); }}
        >
        Új felhasználó
        </Button>
        <Button
                color="primary" 
        >
        Törlés
        </Button>
        </div>
      </Toolbar>
      <div className={classes!.tableWrapper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Felhasználónév</TableCell>
            <TableCell>Jelszó</TableCell>
            <TableCell>E-mail</TableCell>
            <TableCell>Típus</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.props.usersList.map((user) =>
            <TableRow key={user.userId}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.password}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.type}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      </div>
      </Paper>
    </div>
  }
}

export default connect(
  (state: ApplicationState) => (state.users), // Selects which state properties are merged into the component's props
  {...UsersStore.actionCreators, ...SessionStore.actionCreators }                // Selects which action creators are merged into the component's props
)(withStyles(styles)(Users)) as typeof Users;
