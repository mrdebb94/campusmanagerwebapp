import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import { FlatButton } from 'material-ui';
import { TextField } from 'material-ui';

import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';

import { Dialog } from 'material-ui';

import * as ProjectDetailsStore from '../store/ProjectDetails';
import * as moment from 'moment';

type ProjectDetailsProps =
    ProjectDetailsStore.ProjectDetailsState
    & typeof  ProjectDetailsStore.actionCreators
    & RouteComponentProps<{}>

interface ProjectMeetingForm extends ProjectDetailsStore.ProjectMeeting {
	startDate?: moment.Moment;
}

export class ProjectMeetingDialog extends React.Component<any , ProjectMeetingForm> {
   
   state:ProjectMeetingForm = {

	   description:'',
	   room: '',
	 
	   isCancelled: false,
	   hasWeekly: false
   }
   
   constructor() {
	   super();
   }
  
  
   setProjectMeetingDate = (event, date) => {
     
	 this.setState((prevState, props) => 
	 {
		let newState : {
			startDate: moment.Moment;
			startTime: moment.Moment | null;
			endTime: moment.Moment | null;
			
		}= {
			 startDate: moment(date),
			 startTime:  null,
			 endTime: null
		};
	    if(prevState.startTime) {
		
		  
		   newState.startTime = moment({ 
		   year : date.getFullYear(), 
		   month :date.getMonth(), 
		   day : date.getDate(), 
		   hour : prevState.startTime.hour(), 
		   minute :  prevState.startTime.minute()
		  });
		 
	   }

       if(prevState.endTime) {
		   newState.endTime =  moment({ 
		   year : date.getFullYear(), 
		   month :date.getMonth(), 
		   day : date.getDate(), 
		   hour : prevState.endTime.hour(), 
		   minute : prevState.endTime.minute()
		  })
		 
	   }

       return newState;	   
	    
	 });

    
   };
   
   setProjectMeetingStartTime = (event, date) => {
         this.setState((prevState, props) => {
			if(prevState.startDate) {
			   return {
				   startTime: moment({ 
				   year : prevState.startDate.year(), 
				   month : prevState.startDate.month(), 
				   day :  prevState.startDate.date(), 
				   hour : date.getHours(), 
				   minute : date.getMinutes() 
				 })
			  }
		    }
		
	    else {
		   return {
			  startTime: moment(date)
		   }
	   }
	 });
   };
   
   setProjectMeetingEndTime = (event, date) => {
       
	  this.setState((prevState, props) => {
			if(prevState.startDate) {
			   return {
				   endTime: moment({ 
				   year : prevState.startDate.year(), 
				   month : prevState.startDate.month(), 
				   day :  prevState.startDate.date(), 
				   hour : date.getHours(), 
				   minute : date.getMinutes() 
				 })
			  }
		    }
		
	    else {
		   return {
			  endTime: moment(date)
		   }
	   }
	 });
   
   };
 
  render() {
      return (
          <Dialog
          title={
              "Megbeszélés létrehozása"
			  }
                modal={false}
                open={this.props.projectMeetingDialog.open}
                autoScrollBodyContent={false}
                autoDetectWindowHeight={true}
                actions={[<FlatButton label={this.props.projectMeetingDialog.mode == 'create' ? "Hozzáadás" : "Módosítás"}
                    primary={true} onClick={() => {
                        if (this.props.projectMeetingDialog.mode == 'create') {
                            this.props.addProjectMeeting(this.state);
                        } else {
                            //this.props.editProjectMeeting(this.state);
                        }
                    }
                    } />,
                <FlatButton label="Mégse" primary={true} onClick={() => { this.props.toggleProjectMeetingDialog(false, ''); }} />]
				}
          >
           <div>
		  <DatePicker
		            floatingLabelText="Megbeszélés napja"
                    hintText="Megbeszélés napja"
                    onChange={this.setProjectMeetingDate}
                    value={ this.state.startDate ? this.state.startDate.toDate() : undefined} />
		  </div>      
		  <div>
		  <TimePicker
            format="24hr"
            hintText="Kezdő időpont"
			floatingLabelText="Kezdés időpont"
			onChange={this.setProjectMeetingStartTime}
            value={this.state.startTime ? this.state.startTime.toDate() : undefined} />
		  </div>
		  <div>
		  <TimePicker
            format="24hr"
            hintText="Végzés időpont"
			floatingLabelText="Végzés időpont"
            value={this.state.endTime?this.state.endTime.toDate():undefined}
            onChange={this.setProjectMeetingEndTime}
			/>
		  </div>
		   
          </Dialog>
      )
  }
}