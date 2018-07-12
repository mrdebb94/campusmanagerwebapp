import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import Card, { CardHeader, CardMedia, CardContent, CardActions } from 'material-ui/Card';
import Button from 'material-ui/Button';
import { ApplicationState } from '../store';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import Switch from 'material-ui/Switch';
import { WithStyles, StyledComponentProps, withStyles } from 'material-ui/styles';
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
    & StyledComponentProps<'chip' | 'chipContainer' |
    'iconStyles' | 'cardContainer' | 'cardItem'>

class ProjectSubscribe extends React.Component<ProjectProps, any> {

    state={
        isActivateOnlineSubscribe:false
    }
    constructor(props) {
        super(props);
        //this.props.setActiveProjectList();
    }

    activateOnlineSubscribe = (event) => {
        console.log(event.target.checked);
        this.setState({
            isActivateOnlineSubscribe:event.target.checked
        })
    }

    componentDidMount() {
        this.props.setActiveProjectList();
        this.props.startProjectSubscribeConnection();
    }

    public render() {
        const { classes } = this.props;
        return (
            <div>{(this.props.roles&&this.props.roles.indexOf("Admin")!=-1)&&(
                 <Switch
                    checked={this.state.isActivateOnlineSubscribe}
                    onChange={this.activateOnlineSubscribe}
                />)
            }
            <div className={classes!.cardContainer}>
            {
            this.props.activeProjectList&&this.props.activeProjectList.map( (project) =>(
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
                        {(!project.subscribed)
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
                                    this.props.unSubscribeProject(project.projectCampusId);
                                }}>
                                    Lejelentkezés
                </Button>)
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
    (state: ApplicationState) => ({...state.project, ...state.session}),
    { ...ProjectStore.actionCreators, ...SignalRConnectionsStore.actionCreators })
    (withStyles(styles)(ProjectSubscribe)) as typeof ProjectSubscribe;