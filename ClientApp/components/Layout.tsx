import * as React from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import NavMenu from './NavMenu';
import { StyledComponentProps, WithStyles, withStyles } from 'material-ui/styles';

import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as UsersStore from '../store/Users';

import CreateUserDialog from './CreateUserDialog';

const style = {
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
}

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
}


class Layout extends React.Component<StyledComponentProps<'root'|'flex'|'appBarRoot'>, {}> {

    constructor(props) {
        super(props);
    }
	
    public render() {
        const { classes } = this.props;
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
                            <Typography type="title" color="inherit" className={classes!.flex}>
                               EvoCampus manager
                            </Typography>
                        </Toolbar>
                    </AppBar>
                }
                <div>
                    <NavMenu />
                </div>
                <div>
                    <div style={style.content}>
                        <div style={{ marginLeft: 76, marginRight: 76, marginTop: 30 }}>
						     <CreateUserDialog />
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

/*export default connect(
  (state: ApplicationState) => ({users: state.users}) 
)(withStyles(styles)(Layout)) as typeof Layout;*/

export default withStyles(styles)(Layout) as typeof Layout;