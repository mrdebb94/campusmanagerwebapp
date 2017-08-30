import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as CampusStore from '../store/Campus';
import { RaisedButton } from 'material-ui';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import { Tabs, Tab } from 'material-ui/Tabs';
import Checkbox from 'material-ui/Checkbox';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import CampusDialog from './CampusDialog';

// At runtime, Redux will merge together...
type CampusProps =
    CampusStore.CampusState        // ... state we've requested from the Redux store
    & typeof CampusStore.actionCreators      // ... plus action creators we've requested
    & RouteComponentProps<{}>

interface CampusTabState {
    slideIndex: number;
}

class Campus extends React.Component<CampusProps, CampusTabState> {

    constructor(props) {
        super(props);
        this.state = {
            slideIndex: 0,
        };
    }

    handleChange = (value) => {
        this.setState({
            slideIndex: value,
        });
    };

    componentDidMount() {
        this.props.setCampusList();
    }

    public render() {
        return <div>
            {/*<CreateUserDialog {...this.props}/>*/}
            <Tabs
                value={this.state.slideIndex}
                onChange={this.handleChange}
            >
                <Tab label="Campus szemeszterek" value={0} >
                    <CampusDialog {...this.props} />
                    <Toolbar>
                        <ToolbarGroup>
                            <RaisedButton label="Új campus" primary={true} onClick={() => { this.props.toggleCampusDialog(true); }} />
                        </ToolbarGroup>
                    </Toolbar>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHeaderColumn>Campus kezdete</TableHeaderColumn>
                                <TableHeaderColumn>Campus vége</TableHeaderColumn>
                                <TableHeaderColumn>Aktív</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {this.props.campusList.map((campus) =>
                                <TableRow key={campus.id}>
                                    <TableRowColumn>{campus.startDate.format('YYYY-MM-DD')}</TableRowColumn>
                                    <TableRowColumn>{campus.endDate.format('YYYY-MM-DD')}</TableRowColumn>
                                    <TableRowColumn>
                                        <Checkbox
                                            checked={campus.active}
                                            disabled={true}
                                        />
                                    </TableRowColumn>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Tab>
                <Tab label="Jelentkezett diákok" value={1} />
                <Tab label="Jelentkezett mentorok" value={2} />
            </Tabs>
        </div>
    }
}

// Wire up the React component to the Redux store
export default connect(
    (state: ApplicationState) => state.campus, // Selects which state properties are merged into the component's props
    CampusStore.actionCreators                 // Selects which action creators are merged into the component's props
)(Campus) as typeof Campus;