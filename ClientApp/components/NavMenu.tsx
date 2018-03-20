import * as React from 'react';
import { NavLink, Link } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import Drawer from 'material-ui/Drawer';
import Menu from 'material-ui/Menu';
import Divider from 'material-ui/Divider';
import { MenuList, MenuItem } from 'material-ui/Menu';
import { ListItemIcon, ListItemText } from 'material-ui/List';
import ListSubheader from 'material-ui/List/ListSubheader';
import { WithStyles, StyledComponentProps, withStyles } from 'material-ui/styles';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as UsersStore from '../store/Users';
import * as SessionStore from '../store/Session';

const navMenuWidth: number = 300;
const navMenuPaddingTop = 64;

const styles = theme => ({
    menuItem: {
        '&:focus': {
            backgroundColor: theme.palette.primary[500],
            '& $text, & $icon': {
                color: theme.palette.common.white,
            },
        },
    },
    drawerPaper: {
        zIndex: 1,
        position: 'fixed',
        height: '100%',
        width: navMenuWidth,
        paddingTop: navMenuPaddingTop,
       

    } as React.CSSProperties,
    scrollDiv: {
      
        height: 'calc(100% - ' + navMenuPaddingTop + 'px)',
        overflowY:'scroll'
        
    } as React.CSSProperties,
    text: {},
    icon: {},
});

type NavMenuProps =
        // ... state we've requested from the Redux store
  & SessionStore.SettingsState      // ... plus action creators we've requested
  & typeof SessionStore.actionCreators 
 
  & StyledComponentProps<'menuItem' | 'text' | 
'icon' | 'drawerPaper'|'scrollDiv'>
  & { open: boolean };

class NavMenu extends React.Component<NavMenuProps, {}> {
    constructor(props) {
        super(props);
    }
    public render() {
        const { classes } = this.props;
        //TODO: mobil n�zetbe az open-t szab�lyozni
        return (
            <Drawer
                anchor='left'
                open={this.props.open}
                type='persistent'
                classes={{
                    paper: classes!.drawerPaper,
                }}
            >
                <div className={classes!.scrollDiv}>
                    <MenuList subheader={<ListSubheader disableSticky={true}>Felhaszn�l�</ListSubheader>}>
                        <MenuItem className={classes!.menuItem}>
                            <ListItemText classes={{ text: classes!.text }} inset primary="Home" />
                        </MenuItem>
                        <MenuItem className={classes!.menuItem}>
                            <NavLink exact to={'/login'} activeClassName='active'>
                                <ListItemText classes={{ text: classes!.text }} inset primary="Bejelentkez�s" />
                            </NavLink>
                        </MenuItem>
                    </MenuList>
                    <Divider />
					{ (this.props.roles&&this.props.roles.indexOf("Admin")!=-1)&&(
                    <MenuList subheader={<ListSubheader disableSticky={true}>Admin</ListSubheader>}>
                        <MenuItem className={classes!.menuItem}>
                            <NavLink exact to={'/users'} activeClassName='active'>
                                <ListItemText classes={{ text: classes!.text }} inset primary="Felhaszn�l�k" />
                            </NavLink>
                        </MenuItem>
                        <MenuItem className={classes!.menuItem}>
                            <NavLink exact to={'/campus'} activeClassName='active'>
                                <ListItemText classes={{ text: classes!.text }} inset primary="Szemeszterek" />
                            </NavLink>
                        </MenuItem>
                    </MenuList> )
					}
                    <Divider />
                    <MenuList subheader={<ListSubheader disableSticky={true}>Aktu�lis f�l�v</ListSubheader>}>
                        <MenuItem className={classes!.menuItem}>
                            <NavLink exact to={'/currentcampus'} activeClassName='active'>
                                <ListItemText classes={{ text: classes!.text }} inset
                                    primary="Szemeszter jelentkez�s" />
                            </NavLink>
                        </MenuItem>
                        <MenuItem className={classes!.menuItem}>
                            <NavLink exact to={'/currentparticipants'} activeClassName='active'>
                                <ListItemText classes={{ text: classes!.text }} inset
                                    primary="R�sztvev�k" />
                            </NavLink>
                        </MenuItem>
                    <MenuItem className={classes!.menuItem}>
                            <NavLink exact to={'/subscribe/add'} activeClassName='active'>
                                <ListItemText classes={{ text: classes!.text }} inset
                                    primary="Projekt jelentkez�s" />
                            </NavLink>
                        </MenuItem>
                        <MenuItem className={classes!.menuItem}>
                            <NavLink exact to={'/projects'} activeClassName='active'>
                                <ListItemText classes={{ text: classes!.text }} inset
                                    primary="Projektek" />
                            </NavLink>
                        </MenuItem>
                        <MenuItem className={classes!.menuItem}>
                            <NavLink exact to={'/subscribe/list'} activeClassName='active'>
                                <ListItemText classes={{ text: classes!.text }} inset
                                    primary="Projekt jelentkez�sek" />
                            </NavLink>
                        </MenuItem>
                        <MenuItem className={classes!.menuItem}>
                            <NavLink exact to={'/projectmeetings/list'} activeClassName='active'>
                                <ListItemText classes={{ text: classes!.text }} inset
                                    primary="Megbesz�l�sek" />
                            </NavLink>
                        </MenuItem>
                    </MenuList>
                </div>

                {/*
             <Drawer width={this.props.width} open={true} containerStyle={{paddingTop: this.props.paddingTop}}>
                <Menu width={this.props.width} autoWidth={false}>
                    <NavLink exact to={'/'} activeClassName='active'>
                        <MenuItem primaryText="Home">
                        </MenuItem>
                    </NavLink>
                    <NavLink exact to={'/login'} activeClassName='active'>
                        <MenuItem primaryText="Bejelentkez�s">
                        </MenuItem>
                    </NavLink>
                </Menu>
                <Divider />
                <Subheader inset={true}>Admin</Subheader>
                <Menu  width={this.props.width} autoWidth={false}>
                    <NavLink to={'/users'} activeClassName='active'>
                        <MenuItem primaryText="Felhaszn�l�k">
                        </MenuItem>
                    </NavLink>
                    <NavLink to={'/campus'} activeClassName='active'>
                        <MenuItem primaryText="Szemeszterek">
                        </MenuItem>
                    </NavLink>
                </Menu>
                <Divider />
                <Subheader inset={true}>Aktu�lis f�l�v</Subheader>
                <Menu  width={this.props.width} autoWidth={false}>
                    <NavLink to={'/currentcampus'} activeClassName='active'>
                        <MenuItem primaryText="Szemeszter jelentkez�s" />
                    </NavLink>
                    <NavLink to={'/currentparticipants'} activeClassName='active'>
                        <MenuItem primaryText="R�sztvev�k" />
                    </NavLink>
                    <NavLink to={'/projects'} activeClassName='active'>
                        <MenuItem primaryText="Projektek" />
                    </NavLink>
                    <NavLink to={'/subscribe/add'} activeClassName='active'>
                        <MenuItem primaryText="Projekt jelentkez�s" />
                    </NavLink>
                    <NavLink to={'/subscribe/list'} activeClassName='active'>
                        <MenuItem primaryText="Projekt jelentkez�sek" />
                    </NavLink>
                    <NavLink to={'/projectmeetings/list'} activeClassName='active'>
                        <MenuItem primaryText="Megbesz�l�sek" />
                    </NavLink>
                </Menu>
                </Drawer>
            */}
            </Drawer>
        )
    }
}

//export default withStyles(styles)(NavMenu) as typeof NavMenu;


export default connect(
  (state: ApplicationState) => (state.session), // Selects which state properties are merged into the component's props
  { ...SessionStore.actionCreators }                // Selects which action creators are merged into the component's props
)(withStyles(styles)(NavMenu)) as React.ComponentClass<{open:boolean}>;