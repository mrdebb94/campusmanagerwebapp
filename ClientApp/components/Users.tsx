import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as UsersStore from '../store/Users';
import * as SessionStore from '../store/Session';
import Button from '@material-ui/core/Button';
import CreateUserDialog from './CreateUserDialog';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import { StyledComponentProps, WithStyles, withStyles } from '@material-ui/core/styles';

interface OwnStates  {
  reportData:string;
  anchorEl:HTMLAnchorElement | null;
  getUserReportPdf(userId:string);
}

// At runtime, Redux will merge together...
type UsersProps =
  OwnStates&
  UsersStore.UsersState        // ... state we've requested from the Redux store
  & typeof UsersStore.actionCreators      // ... plus action creators we've requested
  & typeof SessionStore.actionCreators 
  & RouteComponentProps<{}>
  & WithStyles<'root'|'tableWrapper'>;

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

  reportData:string = ''; 
  anchorEl:HTMLAnchorElement | null = null;

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

  getUserReportPdf(userId:string){
      UsersStore.userServices.reportUserInPdf(userId).then(blob=>{
      let newBlob = new Blob([blob], {type: "application/pdf"});

      // IE doesn't allow using a blob object directly as link href
	  // instead it is necessary to use msSaveOrOpenBlob
	  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
		window.navigator.msSaveOrOpenBlob(newBlob);
		return;
	  }
      
      const data = window.URL.createObjectURL(newBlob);
	  //var link = document.createElement('a');
	  //link.href = data;
	  //link.download="file.pdf";
      this.reportData=data;
      this.anchorEl!.href = data;
      this.anchorEl!.click();
	  //link.click();
	  setTimeout(function(){
		// For Firefox it is necessary to delay revoking the ObjectURL
		window.URL.revokeObjectURL(data);
      },100);
  });
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
            <TableCell>Név</TableCell>
            <TableCell>Jelszó</TableCell>
            <TableCell>E-mail</TableCell>
            <TableCell>Típus</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.props.usersList.map((user) =>
            <TableRow key={user.userId}>
              <TableCell>{user.userName}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.password}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.type}</TableCell>
              <TableCell>
              <Button
                color="primary" 
                onClick={() => { this.getUserReportPdf(user.userId!); }}
               > 
                Exportálás
              </Button>
              <a target="_blank" ref={(anchorEl) => { this.anchorEl = anchorEl; }}>
              </a>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      </div>
      </Paper>
    </div>
  }
}

//const UsersImpl = withStyles(styles)(Users);

export default connect(
  (state: ApplicationState) => (state.users), // Selects which state properties are merged into the component's props
  {...UsersStore.actionCreators, ...SessionStore.actionCreators }                // Selects which action creators are merged into the component's props
)(withStyles(styles)(Users));
/*export default connect(
  (state: ApplicationState) => (state.users), // Selects which state properties are merged into the component's props
  {...UsersStore.actionCreators, ...SessionStore.actionCreators }                // Selects which action creators are merged into the component's props
)(withStyles(styles)(Users)) as typeof Users;*/
