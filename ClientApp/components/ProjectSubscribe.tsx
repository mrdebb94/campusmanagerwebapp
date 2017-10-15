import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { ApplicationState } from '../store';
import * as ProjectStore from '../store/Project';

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
            <Card containerStyle={{marginBottom:10}}>
            <CardTitle title={project.name} subtitle="Információk" />
            <CardText>
                <h3>Leírás</h3>
                <p>{project.description}</p>
            </CardText>
            <CardActions>
                <FlatButton label="Jelentkezés" onClick={()=>{}}/>
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