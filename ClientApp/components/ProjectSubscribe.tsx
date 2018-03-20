import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import Card, { CardHeader, CardMedia, CardContent, CardActions } from 'material-ui/Card';
import Button from 'material-ui/Button';
import { ApplicationState } from '../store';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import * as ProjectStore from '../store/Project';



const styles = {
    chip: {
      margin: 4,
    },
    container: {
      display: "flex",
      flexDirection: "row"
    } as React.CSSProperties,
    iconStyles : {
        marginRight: 24,
      }
}

type ProjectProps =
ProjectStore.ProjectState        // ... state we've requested from the Redux store
& typeof ProjectStore.actionCreators      // ... plus action creators we've requested
& RouteComponentProps<{}>

class ProjectSubscribe extends React.Component<ProjectProps,any> {

    constructor(props) {
        super(props);
        //this.props.setActiveProjectList();
    }
    componentDidMount() {
       this.props.setActiveProjectList();
    }
   
    public render() {
        return (
            <div> {
            this.props.activeProjectList&&this.props.activeProjectList.map( (project) =>(
            <Card 
               key={ project.projectCampusId! }
               style={{marginBottom:10}}
              
            >
            <CardHeader
             title={project.name}
             subheader={"Információk"}
            />
                
            <CardContent>
                <p>{project.description}</p>
                <div style={styles.container}>
                    <div>
                    {project.subscribedMentors?project.subscribedMentors.map( ({mentor})=>(
                    <Chip key={mentor.mentorId}
                      style={styles.chip}
                      avatar={<Avatar>M</Avatar>}
                      label= {mentor.user.name}
                    />
                    )):<span>Nem ismert</span>
                    }
                    </div>
                    <div>
                    {project.subscribedStudents?project.subscribedStudents.map( ({student})=>(
                    <Chip key={student.studentId}
                      style={styles.chip}
                      avatar={<Avatar>T</Avatar>}
                      label= {student.user.name}
                    />
                    )):<span>Nem ismert</span>
                    }
                    </div>
                </div>
            </CardContent>
            <CardActions>
                {(!project.subscribed)
                ?(
                <Button 
                   onClick={()=>{
                    this.props.subscribeProject(project.projectCampusId);
                }}>
                Jelentkezés
                </Button>
                )
                :(
                <Button onClick={()=>{
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
    );
    }
}

export default connect( 
    (state:ApplicationState)=>state.project,
     ProjectStore.actionCreators )
    (ProjectSubscribe) as typeof ProjectSubscribe;