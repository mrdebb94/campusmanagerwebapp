import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Toolbar  from '@material-ui/core/Toolbar';

/*
import MenuItem from '@material-ui/core/MenuItem';
import DropDownMenu from '@material-ui/core/DropDownMenu';
*/

import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';

import AppBar from '@material-ui/core/AppBar';
import TextField from '@material-ui/core/TextField';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import * as ProjectDetailsStore from '../store/ProjectDetails';

type ProjectDetailsProps =
    ProjectDetailsStore.ProjectDetailsState
    & typeof ProjectDetailsStore.actionCreators
    & RouteComponentProps<{id:string}>
    

interface ProjectMeetingState {
    filterMenuValue: number;
    editableTeamMemberRatings: ProjectDetailsStore.TeamMemberRating[];
    editedTeamMemberRatingIndex: number,
    editedTeamMemberRatingText: string
}

const styles = {
    container: {
        display: "flex",
        flexDirection: "column"
    } as React.CSSProperties,
    button: {
        alignSelf: "flex-end"
    } as React.CSSProperties
}

class ProjectMeetingDetails extends React.Component< ProjectDetailsProps, any> {

    state: ProjectMeetingState = {
        filterMenuValue: 0,
        editableTeamMemberRatings: [],
        editedTeamMemberRatingIndex: -1,
        editedTeamMemberRatingText: ""
    }

    textboxes: any[4]
    componentDidMount() {
        this.props.getProjectMeetingDetails(this.props.match.params.id);
    }

    constructor(props) {
        super(props);

    } 

    componentWillUnmount() {
        this.props.unSetProjectMeetingDetails();
    }

    componentWillReceiveProps(nextProps) {

        //fel fog nyílni a dialógusablak

        if (((!this.props.projectMeetingDetails) || (this.props.projectMeetingDetails &&
            this.props.projectMeetingDetails.teamMemberParticipationMeetings.length == 0))
            && nextProps.projectMeetingDetails 
            && nextProps.projectMeetingDetails.teamMemberParticipationMeetings.length != 0) {

            let editableTeamMemberRatings =
                nextProps.projectMeetingDetails.teamMemberParticipationMeetings.map(meeting => {
                    let editableRatings = meeting.teamMemberRatings.filter(
                        rating => rating.editable
                    );
                    console.log(editableRatings.length);
                    if(editableRatings.length>0) {
                        editableRatings[0].teamMemberName = meeting.teamMemberName;
                        return editableRatings[0];
                    } else {
                        return null;
                    }
                }
                );
            this.setState({
                editableTeamMemberRatings: [...editableTeamMemberRatings]
            });

        }


    }

    handleFilterChange = (event, index, value) => this.setState({ filterMenuValue: value });

    render() {
        return (<div>
            <AppBar
                
                position="static"
            >
            <Toolbar>
               Jelenléti ív
            </Toolbar>
            </AppBar>
            <Card style={{ marginBottom: 10 }}>
            <CardHeader
               title={"Megbeszélés"}
               subheader={this.props.projectMeetingDetails
                ? `${this.props.projectMeetingDetails.projectMeeting.startTime!.format("YYYY-MM-DD HH:mm")}
                 - ${this.props.projectMeetingDetails.projectMeeting.endTime!.format("HH:mm")}`
                : `Ismeretlen`} />
            
            <CardContent>
                    {this.props.projectMeetingDetails ? (
                        <div>
                            {/*
                            <Toolbar>
                                
                                <ToolbarGroup firstChild={true}>
                                    <DropDownMenu value={this.state.filterMenuValue} onChange={this.handleFilterChange}>
                                        <MenuItem value={0} primaryText="Mindenki" />
                                        <MenuItem value={1} primaryText="Csapattagok" />
                                        <MenuItem value={2} primaryText="Mentorok" />
                                    </DropDownMenu>
                                </ToolbarGroup>
                            
                            </Toolbar>
                            */}
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Név</TableCell>
                                        <TableCell>Megjelent</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        (this.state.filterMenuValue == 0 || this.state.filterMenuValue == 1) &&
                                        this.props.projectMeetingDetails.
                                            teamMemberParticipationMeetings.map(
                                            (teamMemberParticipationMeeting, index) => (
                                                <TableRow
                                                    key={teamMemberParticipationMeeting.teamMemberParticipationMeetingId!}>
                                                    <TableCell>
                                                        {teamMemberParticipationMeeting.teamMemberName}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Checkbox
                                                            checked={teamMemberParticipationMeeting.checked}
                                                            disabled={false}
                                                            onChange={
                                                                (event) => {
                                                                    this.props.editTeamMemberParticipationMeetings(index, event.target.checked);
                                                                }
                                                            }
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                    }
                                    {
                                        (this.state.filterMenuValue == 0 || this.state.filterMenuValue == 2) &&
                                        this.props.projectMeetingDetails.
                                            projectLeaderParticipationMeetings.map(
                                            (projectLeaderParticipationMeeting, index) =>
                                                (
                                                    <TableRow
                                                        key={projectLeaderParticipationMeeting.projectLeaderParticipationMeetingId!}>
                                                        <TableCell>
                                                            {projectLeaderParticipationMeeting.projectLeaderName}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Checkbox
                                                                checked={projectLeaderParticipationMeeting.checked}
                                                                disabled={false}
                                                                onChange={
                                                                    (event) => {
                                                                        this.props.editProjectLeaderParticipationMeetings(index, event.target.checked);
                                                                    }
                                                                }
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                    }
                                </TableBody>
                            </Table>
                        </div>) : (<div>Nem jeleníthető meg</div>)
                    }
                </CardContent>
                <CardActions>
                    <Button  onClick={() => {
                        console.log("Katt");
                        this.props.saveProjectMeetingParticipations();
                    }} >
                     Mentés
                    </Button>
                </CardActions>
            </Card>
            <AppBar
                
                position="static"
            >
            <Toolbar>
               Értékelések
            </Toolbar>
            </AppBar>
            <Card style={{ marginBottom: 10 }}>
                <CardHeader title={"Megbeszélés"} subheader={this.props.projectMeetingDetails
                    ? `${this.props.projectMeetingDetails.projectMeeting.startTime!.format("YYYY-MM-DD HH:mm")}
                     - ${this.props.projectMeetingDetails.projectMeeting.endTime!.format("HH:mm")}`
                    : `Ismeretlen`} />
                <CardContent>
                    {
                        this.state.editableTeamMemberRatings
                        .filter(teamMemberRating=>teamMemberRating!=null)
                        .map((teamMemberRating, index) => (
                            <div style={styles.container}>
                                <h3>{teamMemberRating.teamMemberName}</h3>
                                <TextField
                                    id={teamMemberRating.teamMemberRatingId}
                                    style={{ "width": "100%" }}
                                    multiline={true}
                                    rows={2}
                                    rowsMax={8}
                                    value={this.state.editedTeamMemberRatingIndex==index
                                        ? undefined
                                        : teamMemberRating.text
                                    }
                                    onBlur={(event) => {
                                        //console.log("Fokusz elhagy");
                                        let target = event.target as HTMLInputElement;
                                        let teamMemberRatings = [...this.state.editableTeamMemberRatings];
                                        teamMemberRatings[index].text = target.value;
                                        console.log(teamMemberRatings);
                                        this.setState({
                                            editedTeamMemberRatingIndex: -1,
                                            teamMemberRatings: teamMemberRatings
                                        });
                                    }
                                    }
                                    onFocus={(event) => {
                                        let target = event.target as HTMLInputElement
                                        this.setState({
                                            editedTeamMemberRatingIndex: index,
                                            editedTeamMemberRatingText:
                                            this.state.editableTeamMemberRatings[index].text
                                        });
                                    }}
                                    />
                                <Button style={styles.button} onClick={() => {
                                   this.props.saveTeamMemberRating(this.state.editableTeamMemberRatings[index]);
                                }}
                                >
                                  Értékelés mentése
                                </Button>
                            </div>
                        ))
                    }
                </CardContent>
            </Card>
        </div>)
    }
}

export default connect(
    (state: ApplicationState) => state.projectDetails,
    ProjectDetailsStore.actionCreators)
    (ProjectMeetingDetails);
