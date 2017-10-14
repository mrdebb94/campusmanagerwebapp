import * as React from 'react';
import { NavLink, Link } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import Drawer from 'material-ui/Drawer';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';

export class NavMenu extends React.Component<any, {}> {
    public render() {
        //TODO: mobil nézetbe az open-t szabályozni
        return (
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
                        <MenuItem primaryText="Jelentkezés" />
                    </NavLink>
                    <NavLink to={'/currentparticipants'} activeClassName='active'>
                        <MenuItem primaryText="Résztvevők" />
                    </NavLink>
                    <NavLink to={'/projects'} activeClassName='active'>
                        <MenuItem primaryText="Projektek" />
                    </NavLink>
                </Menu>
                </Drawer>
        )
    }
}
