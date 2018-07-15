import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import { ApplicationState } from '../store';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Switch from '@material-ui/core/Switch';
import { WithStyles, StyledComponentProps, withStyles } from '@material-ui/core/styles';
import * as ProjectStore from '../store/Project';
import * as SessionStore from '../store/Session';
import * as SignalRConnectionsStore from '../store/SignalRConnections';


const styles = (theme) => ({
    chip: {
        margin: 4,
    },
    cardItem: {
        width: 400
    },
    cardContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        flexWrap: "wrap",
        alignItems: "stretch",
    } as React.CSSProperties,
    chipContainer: {
        display: "flex",
        flexDirection: "row"
    } as React.CSSProperties,
    iconStyles: {
        marginRight: 24,
    }
});

type ProjectProps =
    ProjectStore.ProjectState        // ... state we've requested from the Redux store
    & SessionStore.SettingsState
    & typeof ProjectStore.actionCreators      // ... plus action creators we've requested
    & typeof SignalRConnectionsStore.actionCreators
    & RouteComponentProps<{}>
    & WithStyles<'chip' | 'chipContainer' |
    'iconStyles' | 'cardContainer' | 'cardItem'>

interface OwnState {
    // activateOnlineSubscribe (event);
    isActivateOnlineSubscribe: boolean;
}
type State = Readonly<OwnState>;

class ProjectSubscribe extends React.Component<ProjectProps, State> {

    readonly state: State = {
        isActivateOnlineSubscribe: false
    }

    constructor(props) {
        super(props);
        //this.props.setActiveProjectList();
    }

    /* activateOnlineSubscribe = (event) => {
         console.log(event.target.checked);
         this.setState({
             isActivateOnlineSubscribe:event.target.checked
         })
     }*/

    componentDidMount() {
        this.props.setActiveProjectList();
        this.props.startProjectSubscribeConnection();
    }

    public render() {
        const { classes } = this.props;
        let isAdmin = this.props.roles && this.props.roles.indexOf("Admin") != -1;
        return (
    
            <div>{
                /*(this.props.roles && this.props.roles.indexOf("Admin") != -1) && (
                  <Switch
                    checked={this.state.isActivateOnlineSubscribe}
                    onChange={this.activateOnlineSubscribe}/>
                )*/
            }
                <div className={classes!.cardContainer}>
                    {
                        this.props.activeProjectList && this.props.activeProjectList.map((project) => (
                            <Card
                                key={project.projectCampusId!}
                                style={{ marginBottom: 10 }}
                                className={classes!.cardItem}

                            >
                                <CardHeader
                                    title={project.name}
                                    subheader={"Információk"}
                                />

                                <CardContent>
                                    <p>{project.description}</p>
                                    <div className={classes!.chipContainer}>
                                        <div>
                                            {project.subscribedMentors ? project.subscribedMentors.map(({ mentor }) => (
                                                <Chip key={mentor.mentorId}
                                                    className={classes!.chip}
                                                    avatar={<Avatar>M</Avatar>}
                                                    label={mentor.user.name}
                                                />
                                            )) : <span>Nem ismert</span>
                                            }
                                        </div>
                                        <div>
                                            {project.subscribedStudents ? project.subscribedStudents.map(({ student }) => (
                                                <Chip key={student.studentId}
                                                    className={classes!.chip}
                                                    avatar={<Avatar>T</Avatar>}
                                                    label={student.user.name}
                                                />
                                            )) : <span>Nem ismert</span>
                                            }
                                        </div>
                                    </div>
                                </CardContent>
                                <CardActions>
                                    {!isAdmin&&(((project.subscribedStudents
                                        .filter(subscribedStudent => subscribedStudent.student.user.id == this.props.id).length == 0)
                                        &&
                                        (project.subscribedMentors
                                            .filter(subscribedMentor => subscribedMentor.mentor.user.id == this.props.id).length == 0))
                                        ? (
                                            <Button
                                                onClick={() => {
                                                    // this.props.subscribeProject(project.projectCampusId);
                                                    this.props.subscribeProjectSignalR(project.projectCampusId!);
                                                }}>
                                                Jelentkezés
                                            </Button>
                                        )
                                        : (
                                            <Button onClick={() => {
                                                //this.props.unSubscribeProject(project.projectCampusId);
                                                this.props.unSubscribeProjectSignalR(project.projectCampusId!);
                                            }}>
                                                Lejelentkezés
                                            </Button>))
                                    }
                                </CardActions>
                            </Card>
                        )
                        )
                    }
                </div>
            </div>
        );
    }
}

export default connect(
    (state: ApplicationState) => ({ ...state.project, ...state.session }),
    { ...ProjectStore.actionCreators, ...SignalRConnectionsStore.actionCreators })
    (withStyles(styles)(ProjectSubscribe));