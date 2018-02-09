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

const navMenuWidth: number = 300;
const navMenuPaddingTop = 0;

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
        overflowY:'scroll'

    } as React.CSSProperties,
    scrollDiv: {
      
        height: '100%',
        overflowY:'scroll'
        
    } as React.CSSProperties,
    text: {},
    icon: {},
});

class NavMenu extends React.Component<StyledComponentProps<'menuItem' | 'text' | 
'icon' | 'drawerPaper'|'scrollDiv'>, {}> {
    constructor(props) {
        super(props);
    }
    public render() {
        const { classes } = this.props;
        //TODO: mobil nézetbe az open-t szabályozni
        return (
            <Drawer
                anchor='left'
                open={true}
                type='persistent'
                classes={{
                    paper: classes!.drawerPaper,
                }}
            >
                <Paper>
                    
                    <MenuList subheader={<ListSubheader>Felhasználó</ListSubheader>}>
                        <MenuItem className={classes!.menuItem}>
                            <ListItemText classes={{ text: classes!.text }} inset primary="Home" />
                        </MenuItem>
                        <MenuItem className={classes!.menuItem}>
                            <NavLink exact to={'/login'} activeClassName='active'>
                                <ListItemText classes={{ text: classes!.text }} inset primary="Bejelentkezés" />
                            </NavLink>
                        </MenuItem>
                    </MenuList>
                    <Divider />
                    <MenuList subheader={<ListSubheader>Admin</ListSubheader>}>
                        <MenuItem className={classes!.menuItem}>
                            <NavLink exact to={'/users'} activeClassName='active'>
                                <ListItemText classes={{ text: classes!.text }} inset primary="Felhasználók" />
                            </NavLink>
                        </MenuItem>
                        <MenuItem className={classes!.menuItem}>
                            <NavLink exact to={'/campus'} activeClassName='active'>
                                <ListItemText classes={{ text: classes!.text }} inset primary="Szemeszterek" />
                            </NavLink>
                        </MenuItem>
                    </MenuList>
                    <MenuList subheader={<ListSubheader>Aktuális félév</ListSubheader>}>
                        <MenuItem className={classes!.menuItem}>
                            <NavLink exact to={'/currentcampus'} activeClassName='active'>
                                <ListItemText classes={{ text: classes!.text }} inset
                                    primary="Szemeszter jelentkezés" />
                            </NavLink>
                        </MenuItem>
                        <MenuItem className={classes!.menuItem}>
                            <NavLink exact to={'/currentparticipants'} activeClassName='active'>
                                <ListItemText classes={{ text: classes!.text }} inset
                                    primary="Résztvevők" />
                            </NavLink>
                        </MenuItem>
                    <MenuItem className={classes!.menuItem}>
                            <NavLink exact to={'/subscribe/add'} activeClassName='active'>
                                <ListItemText classes={{ text: classes!.text }} inset
                                    primary="Projekt jelentkezés" />
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
                                    primary="Projekt jelentkezések" />
                            </NavLink>
                        </MenuItem>
                        <MenuItem className={classes!.menuItem}>
                            <NavLink exact to={'/projectmeetings/list'} activeClassName='active'>
                                <ListItemText classes={{ text: classes!.text }} inset
                                    primary="Megbeszélések" />
                            </NavLink>
                        </MenuItem>
                    </MenuList>
                    
                </Paper>

                {/*
             <Drawer width={this.props.width} open={true} containerStyle={{paddingTop: this.props.paddingTop}}>
                <Menu width={this.props.width} autoWidth={false}>
                    <NavLink exact to={'/'} activeClassName='active'>
                        <MenuItem primaryText="Home">
                        </MenuItem>
                    </NavLink>
                    <NavLink exact to={'/login'} activeClassName='active'>
                        <MenuItem primaryText="Bejelentkezés">
                        </MenuItem>
                    </NavLink>
                </Menu>
                <Divider />
                <Subheader inset={true}>Admin</Subheader>
                <Menu  width={this.props.width} autoWidth={false}>
                    <NavLink to={'/users'} activeClassName='active'>
                        <MenuItem primaryText="Felhasználók">
                        </MenuItem>
                    </NavLink>
                    <NavLink to={'/campus'} activeClassName='active'>
                        <MenuItem primaryText="Szemeszterek">
                        </MenuItem>
                    </NavLink>
                </Menu>
                <Divider />
                <Subheader inset={true}>Aktuális félév</Subheader>
                <Menu  width={this.props.width} autoWidth={false}>
                    <NavLink to={'/currentcampus'} activeClassName='active'>
                        <MenuItem primaryText="Szemeszter jelentkezés" />
                    </NavLink>
                    <NavLink to={'/currentparticipants'} activeClassName='active'>
                        <MenuItem primaryText="Résztvevők" />
                    </NavLink>
                    <NavLink to={'/projects'} activeClassName='active'>
                        <MenuItem primaryText="Projektek" />
                    </NavLink>
                    <NavLink to={'/subscribe/add'} activeClassName='active'>
                        <MenuItem primaryText="Projekt jelentkezés" />
                    </NavLink>
                    <NavLink to={'/subscribe/list'} activeClassName='active'>
                        <MenuItem primaryText="Projekt jelentkezések" />
                    </NavLink>
                    <NavLink to={'/projectmeetings/list'} activeClassName='active'>
                        <MenuItem primaryText="Megbeszélések" />
                    </NavLink>
                </Menu>
                </Drawer>
            */}
            </Drawer>
        )
    }
}

export default withStyles(styles)(NavMenu) as typeof NavMenu;