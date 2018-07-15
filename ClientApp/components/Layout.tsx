import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import NavMenu from './NavMenu';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { StyledComponentProps, WithStyles, withStyles } from '@material-ui/core/styles';

import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link, RouteComponentProps } from 'react-router-dom';
import { ApplicationState } from '../store';
import * as UsersStore from '../store/Users';

import CreateUserDialog from './CreateUserDialog';


/*const style = {
    component: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
    } as React.CSSProperties,
    navmenu: {
        width: 300
    },
    content: {
        paddingLeft: 300,
        paddingTop: 64,
        height: '100%'
    }
 };*/

const createStyle = (navMenuOpen) => {
    //const isMobile = props.browser!.lessThan.medium;
    return {
        component: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
        } as React.CSSProperties,
        navmenu: {
            width: 300
        },
        content: {
            paddingLeft: (navMenuOpen) ? 300 : 0,
            paddingTop: 64,
            height: '100%'
        }
    }
};

const styles = {
    root: {
        width: '100%',

    },
    flex: {
        flex: 1,
    },
    /*appBarRoot: {
	   zIndex: 1000
	}*/
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
}

interface LayoutState {
    snackbarOpen: boolean,
    snackbarMessage: string,
    navMenuOpen: boolean
};

class Layout extends React.Component<
    WithStyles<'root' | 'flex' | 'appBarRoot' | 'menuButton'>
    & RouteComponentProps<any>
    & { browser?: any }, LayoutState> {


    componentWillReceiveProps(nextProps) {
        if (!this.props.browser!.lessThan.medium && nextProps.browser!.lessThan.medium) {
            this.setState({
                navMenuOpen: false
            })
        }
    }

    constructor(props) {
        super(props);
    }

    state = {
        snackbarOpen: false,
        snackbarMessage: '',
        navMenuOpen: true
    };

    public render() {
        const { classes } = this.props;
        const isMobile = this.props.browser!.lessThan.medium;
        console.log(isMobile);
        let style = createStyle(this.state.navMenuOpen);
        return (
            <div className={classes!.root}>
                {/*
                <AppBar
                    title="EvoCampus manager"
                    style={{ zIndex: 1500, position: 'fixed', top: 0, left: 0}}
                />*/
                    <AppBar
                        color='primary'
                        position='fixed'

                    >
                        <Toolbar>
                            <IconButton
                                className={classes!.menuButton}
                                color="inherit"
                                aria-label="Menu"
                                onClick={() => {
                                    this.setState((prevState, props) => ({
                                        navMenuOpen: !prevState.navMenuOpen
                                    }))
                                }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography variant="title" color="inherit" className={classes!.flex}>
                                EvoCampus manager
                            </Typography>
                        </Toolbar>
                    </AppBar>
                }
                <div>
                    <NavMenu open={this.state.navMenuOpen} />
                </div>
                <div>
                    <div style={style.content}>
                        {/*<div style={{ marginLeft: 76, marginRight: 76, marginTop: 30 }}>
                            <CreateUserDialog />
                            {this.props.children}
                        </div>
                        */}
                        <div id="content">
                            <CreateUserDialog />
                            {this.props.children}
                        </div>
                    </div>
                </div>
                {/*
                <Snackbar
				  anchorOrigin={{ vertical: 'bottom', horizontal: 'center'}}
				  open={open}
				  onClose={this.handleClose}
				  SnackbarContentProps={{
					'aria-describedby': 'message-id',
				  }}
				  message={<span id="message-id">I love snacks</span>}
                />
                */
                }
            </div>
        );
    }
}

export default withRouter(connect(
    (state: ApplicationState) => ({ browser: state.browser })
)(withStyles(styles)(Layout)) as any) as any;

/*export default withRouter(connect(
  (state: ApplicationState) => ({browser: state.browser}) 
)(withStyles(styles)(Layout))  as React.ComponentClass<RouteComponentProps<any>>) as typeof Layout;*/


//export default withStyles(styles)(Layout) as typeof Layout;