import * as React from 'react';

import { RaisedButton } from 'material-ui';
import { FlatButton } from 'material-ui';

import { Link, RouteComponentProps } from 'react-router-dom';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import { connect } from 'react-redux';

import * as ProjectDetailsStore from '../store/ProjectDetails';
import { ApplicationState } from '../store';

import { ProjectMeetingDialog } from './ProjectMeetingDialog'

type ProjectDetailsProps =
    ProjectDetailsStore.ProjectDetailsState
    & typeof  ProjectDetailsStore.actionCreators
    & RouteComponentProps<{}>

class ProjectMeetingsList extends React.Component<ProjectDetailsProps,any> {
	
   componentDidMount() {
        this.props.setProjectMeetingList();
   }
	
   render() {
	   return (<div>
	    <ProjectMeetingDialog {...this.props}/>
	  
	    <Toolbar>
             <ToolbarGroup lastChild={true}>
                 <RaisedButton label="Módosítás" primary={true} onClick={() => {
                      this.props.toggleProjectMeetingDialog(true, "edit");
                   }} />
                  <RaisedButton label="Új megbeszélés" primary={true} onClick={() => {
                      this.props.toggleProjectMeetingDialog(true, "create");
                   }} />
                 </ToolbarGroup>
         </Toolbar>
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
				   this.props.projectMeetingList.map((projectMeeting, i) => (
				       <TableRow>
					      <TableRowColumn>{projectMeeting.startTime!.format()}</TableRowColumn>
						  <TableRowColumn>{projectMeeting.endTime!.format()}</TableRowColumn>
						  <TableRowColumn> {/*
                              <FlatButton label="Lebonyolítás" primary={true} onClick={() => {
                              }}/> */}
                              <Link to={`/projectmeetings/details/${projectMeeting.projectMeetingId!}`}>
                                 <FlatButton label="Lebonyolítás" primary={true}/>
                              </Link>
                            </TableRowColumn>
					   </TableRow>
				   ))
			   }
		     </TableBody>
		</Table>
		</div>
	   )
   }   
}

export default connect(
    (state: ApplicationState) => state.projectDetails,
    ProjectDetailsStore.actionCreators)
    (ProjectMeetingsList) as typeof ProjectMeetingsList;