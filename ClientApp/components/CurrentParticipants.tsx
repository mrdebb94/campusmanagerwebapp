import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import { RaisedButton } from 'material-ui';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import { Tabs, Tab } from 'material-ui/Tabs';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

//TODO: rename CampusParticipations ??

import * as CampusParticipationStore from '../store/CampusParticipation';
import { CampusParticipationDialog } from './CampusParticipationDialog'
// At runtime, Redux will merge together...
type CampusParticipationProps =
    CampusParticipationStore.CampusParticipationState        // ... state we've requested from the Redux store
    & typeof CampusParticipationStore.actionCreators      // ... plus action creators we've requested
    & RouteComponentProps<{}>

interface StudentTabState {
    slideIndex: number;
    selectedRows: number[] | string;
}

class CurrentParticipants extends React.Component<CampusParticipationProps, StudentTabState> {
    componentDidMount() {
        this.props.getCampusParticipations();
    }

    constructor(props) {
        super(props);
        this.state = {
            slideIndex: 0,
            selectedRows: []
        };
    }

    handleChange = (value) => {
        this.setState({
            slideIndex: value,
        });
    };

    public render() {
        return <div>
            <CampusParticipationDialog {...this.props} />
            <Tabs
                value={this.state.slideIndex}
                onChange={this.handleChange}
            >
                <Tab label="Diákok" value={0} >
                    <Toolbar>
                        <ToolbarGroup lastChild={true}>
                            <RaisedButton label="Módosítás" primary={true} onClick={() => {
                                this.props.toggleCampusParticipationDialog(true);
                            }} />
                        </ToolbarGroup>
                    </Toolbar>
                    <Table
                        onRowSelection={(selectedRows) => {
                            console.log(selectedRows);
                            //this.setState({ selectedRows });
                            let i, count=0;
                            for(i=0;i<this.props.campusParticipationList!.length;i++) {
                                if(this.props.campusParticipationList![i].student) {
                                  if(count==selectedRows[0]) {
                                     break;
                                  }
                                  count++;
                                }
                            }
                            this.setState({ selectedRows: [i] });
                            this.props.modifyEditedCampusParticipation({ 
                                ...this.props.campusParticipationList![i] });
                        }}
                    >
                        <TableHeader>
                            <TableRow>
                                <TableHeaderColumn>Tanuló azonosítója</TableHeaderColumn>
                                <TableHeaderColumn>Tanuló neve </TableHeaderColumn>

                            </TableRow>
                        </TableHeader>
                        <TableBody
                            deselectOnClickaway={false}>
                            {this.props.campusParticipationList ? this.props.campusParticipationList
                                .map((campusParticipation, i) =>
                                    (campusParticipation.student) &&
                                    <TableRow
                                        key={campusParticipation.student.studentId}
                                        selected={
                                            (this.state.selectedRows as number[]).indexOf(i) !== -1}>
                                        <TableRowColumn>{campusParticipation.student.studentId}</TableRowColumn>
                                        <TableRowColumn>{campusParticipation.student.name}</TableRowColumn>
                                    </TableRow>
                                ) : ''}
                        </TableBody>
                    </Table>
                </Tab>
                <Tab label="Mentorok" value={1} >
                    <Toolbar>
                        <ToolbarGroup lastChild={true}>
                            <RaisedButton label="Módosítás" primary={true} onClick={() => {
                                this.props.toggleCampusParticipationDialog(true);
                            }} />
                        </ToolbarGroup>
                    </Toolbar>
                    <Table
                        onRowSelection={(selectedRows) => {
                            console.log(selectedRows);
                            let i, count=0;
                            for(i=0;i<this.props.campusParticipationList!.length;i++) {
                                if(this.props.campusParticipationList![i].mentor) {
                                  if(count==selectedRows[0]) {
                                     break;
                                  }
                                  count++;
                                }
                            }
                            this.setState({ selectedRows: [i] });
                            /*this.setState({ selectedRows });
                            this.props.modifyEditedCampusParticipation({ 
                                ...this.props.campusParticipationList![selectedRows[0]] });*/
                        }}
                    >
                        <TableHeader>
                            <TableRow>
                                <TableHeaderColumn>Mentor azonosítója</TableHeaderColumn>
                                <TableHeaderColumn>Mentor neve </TableHeaderColumn>

                            </TableRow>
                        </TableHeader>
                        <TableBody
                            deselectOnClickaway={false}>
                            {this.props.campusParticipationList ? this.props.campusParticipationList
                                .map((campusParticipation, i) => 
                                    (campusParticipation.mentor) &&
                                    <TableRow
                                        key={campusParticipation.mentor.mentorId}
                                        selected={(this.state.selectedRows as number[]).indexOf(i) !== -1}>
                                        <TableRowColumn>{campusParticipation.mentor.mentorId}</TableRowColumn>
                                        <TableRowColumn>{campusParticipation.mentor.name}</TableRowColumn>
                                    </TableRow>
                                    
                                ) : ''}
                        </TableBody>
                    </Table>
                </Tab>
            </Tabs>
        </div>
    }

}

export default connect(
    (state: ApplicationState) => state.campusParticipation, // Selects which state properties are merged into the component's props
    CampusParticipationStore.actionCreators                 // Selects which action creators are merged into the component's props
)(CurrentParticipants) as typeof CurrentParticipants;