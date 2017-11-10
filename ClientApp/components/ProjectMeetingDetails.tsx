import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';

import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';

import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

import * as ProjectDetailsStore from '../store/ProjectDetails';

type ProjectDetailsProps =
ProjectDetailsStore.ProjectDetailsState
& typeof  ProjectDetailsStore.actionCreators
& RouteComponentProps<{}>


export class ProjectMeetingDetails extends React.Component<any, any> {

    componentDidMount() {
        this.props.getProjectMeetingDetails(this.props.match.params.id);
   }

    render() {
        return (<div>
            <Card containerStyle={{ marginBottom: 10 }}>
                <CardTitle title={"egy"} subtitle="Információk" />
                <CardText>
              
                <Table>
            <TableHeader>
                <TableRow>
                     <TableHeaderColumn>Kezdés</TableHeaderColumn>
                     <TableHeaderColumn>Végzés</TableHeaderColumn>
                     <TableHeaderColumn>Státusz</TableHeaderColumn>
                 </TableRow>
             </TableHeader>
             <TableBody>
			   {
				   this.props.projectMeetingDetails&&this.props.projectMeetingDetails.
                   teamMemberParticipationMeetings.map(teamMember=>(
                       <TableRow>
                       <TableRowColumn>{teamMember.student.name}</TableRowColumn>
                       <TableRowColumn>
                       <Checkbox
                                            checked={teamMember.checked}
                                            disabled={true}
                                        />
                       </TableRowColumn>
                        </TableRow>
                   ))
               }
            </TableBody>
            </Table>
                </CardText>
                <CardActions>
                    <FlatButton label="Mentés" onClick={() => {

                    }} />
                </CardActions>
            </Card>
        </div>)
    }
}

export default connect( 
    (state:ApplicationState)=>state.project,
     ProjectDetailsStore.actionCreators )
    (ProjectMeetingDetails) as typeof ProjectMeetingDetails;
