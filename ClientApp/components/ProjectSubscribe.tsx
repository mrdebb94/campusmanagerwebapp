import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { ApplicationState } from '../store';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import SvgIconFace from 'material-ui/svg-icons/action/face';
import FileCloudDownload from 'material-ui/svg-icons/file/cloud-download';
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

    constructor() {
        super();
        //this.props.setActiveProjectList();
    }
    componentDidMount() {
       this.props.setActiveProjectList();
    }
   
    public render() {
        return (
            <div> {
            this.props.activeProjectList&&this.props.activeProjectList.map( (project) =>(
            <Card key={ project.projectCampusId! } containerStyle={{marginBottom:10}}>
            <CardTitle title={project.name} subtitle="Információk" />
            <CardText>
                <p>{project.description}</p>
                <div style={styles.container}>
                    <div>
                    {project.subscribedMentors?project.subscribedMentors.map( ({mentor})=>(
                    <Chip key={mentor.mentorId}
                      style={styles.chip}
                    >
                    {/*<Avatar icon={
                        <FileCloudDownload />} />*/}
                    <Avatar>M</Avatar>
                    {mentor.name}
                    </Chip>
                    )):<span>Nem ismert</span>
                    }
                    </div>
                    <div>
                    {project.subscribedStudents?project.subscribedStudents.map( ({student})=>(
                    <Chip key={student.studentId}
                      style={styles.chip}
                    >
                   {/* <Avatar icon={<SvgIconFace />} /> */}
                   <Avatar>T</Avatar>
                    {student.name}
                    </Chip>
                    )):<span>Nem ismert</span>
                    }
                    </div>
                </div>
            </CardText>
            <CardActions>
                <FlatButton label="Jelentkezés" onClick={()=>{
                    this.props.subscribeProject(project.projectCampusId);
                }}/>
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