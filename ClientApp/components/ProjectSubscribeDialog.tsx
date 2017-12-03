import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

import { Dialog } from 'material-ui';
import { FlatButton } from 'material-ui';
import { TextField } from 'material-ui';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import { ApplicationState } from '../store';
import * as ProjectStore from '../store/Project';

// At runtime, Redux will merge together...

type ProjectProps =
ProjectStore.ProjectState        // ... state we've requested from the Redux store
& typeof ProjectStore.actionCreators      // ... plus action creators we've requested
& RouteComponentProps<{}>

interface ProjectSubscribeType {
    selectedProjectId: string | null;
}

export class ProjectSubscribeDialog extends React.Component<ProjectProps, any> {

    state:ProjectSubscribeType={
        selectedProjectId: null
    }
    componentDidMount() {
       
    }

    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {
       
        //fel fog nyílni a dialógusablak
        if(this.props.projectSubscribeDialog.open==false
            &&nextProps.projectSubscribeDialog.open==true) {
            let key;
            if(nextProps.projectSubscribeDialog.subscribedMentor) {
                key = nextProps.projectSubscribeDialog.subscribedMentor.projectCampusId;
            } else if(nextProps.projectSubscribeDialog.subscribedStudent) {
                key = nextProps.projectSubscribeDialog.subscribedStudent.projectCampusId;
            }
            this.setState({
                selectedProjectId:key
            });
        //be fog záródni a dialógusablak
        } else if(this.props.projectSubscribeDialog.open==true
            &&nextProps.projectSubscribeDialog.open==false) {
            this.setState({
                selectedProjectId:null
            });
        }
        
    }

    public render() {
       
        const { projectSubscribeDialog : { subscribedMentor, subscribedStudent } } = this.props;
        return <div>
            <Dialog
                title="Projekt jelentkezés módosítása"
                modal={false}
                open={this.props.projectSubscribeDialog ? this.props.projectSubscribeDialog.open : false}
                autoScrollBodyContent={false}
                autoDetectWindowHeight={true}
                actions={[<FlatButton label="Módosítás" primary={true} onClick={
                    () => { 
                        if(subscribedMentor) { 
                            this.props.modifyMentorProjectSubscribe( { 
                                subscribedMentorId: subscribedMentor.subscribedMentorId,
                                projectCampusId: this.state.selectedProjectId!
                                });
                        } else if(subscribedStudent) {
                            this.props.modifyStudentProjectSubscribe( { 
                                subscribedStudentId: subscribedStudent.subscribedStudentId,
                                projectCampusId: this.state.selectedProjectId!
                                });
                        }
                    
                    }} />,
                <FlatButton label="Mégse" primary={true} onClick={
                    () => { this.props.toggleProjectSubscribeDialog(false, {})}} />]}
            >
              { (subscribedMentor&&subscribedMentor.mentor)&&
                <TextField
                    floatingLabelText="Név:"
                    floatingLabelFixed={true}
                    value={ subscribedMentor.mentor.name }
                    disabled={true}
                />
                
              }
              { (subscribedStudent&&subscribedStudent.student)&&
                <TextField
                    floatingLabelText="Név:"
                    floatingLabelFixed={true}
                    value={ subscribedStudent.student.name }
                    disabled={true}
                />
                
              }
              <br />
                <SelectField
                    floatingLabelText="Jelentkezett project"
                    value={
                       this.state.selectedProjectId?this.state.selectedProjectId:null
                    }
                    onChange={(event, index, value) => {
                       this.setState({selectedProjectId: value})
                    }}
                >
                 { this.props.projectSubscribeDialog.projectList.map( (project, index)=>( 
                    <MenuItem key={index} value={project.projectCampusId} primaryText={project.name} />
                   ))
                 }
                </SelectField>
            </Dialog>
        </div>
    }
}