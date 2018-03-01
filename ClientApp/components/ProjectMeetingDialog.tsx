import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import Button  from 'material-ui/Button';
import TextField from 'material-ui/TextField';

import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';

import * as ProjectDetailsStore from '../store/ProjectDetails';
import * as moment from 'moment';

type ProjectDetailsProps =
    ProjectDetailsStore.ProjectDetailsState
    & typeof  ProjectDetailsStore.actionCreators
    & RouteComponentProps<{}>

interface ProjectMeetingForm extends ProjectDetailsStore.ProjectMeeting {
	startDate?: moment.Moment;
	startDateText: string;
	startTimeText: string;
	endTimeText: string;
}

export class ProjectMeetingDialog extends React.Component<ProjectDetailsProps , ProjectMeetingForm> {
   
   state:ProjectMeetingForm = {

	   description:'',
	   room: '',
	   startDateText:'',
	   startTimeText:'',
	   endTimeText:'',
	   isCancelled: false,
	   hasWeekly: false
   }
   
   constructor(props) {
	   super(props);
   }
  
  
   setProjectMeetingDate = (event) => {
	//let date = moment(event.target.value);
	const pattern = /([0-9]{4})-([0-9]{2})-([0-9]{2})/g;
	const match = pattern.exec(event.target.value);
	console.log(event.target.value);
	if(match&&match.length>=4) {
	 let dateText=event.target.value;
	 let date = moment(event.target.value);
	 this.setState((prevState, props) => 
	 {
		let newState : {
			startDate: moment.Moment;
			startTime?: moment.Moment;
			endTime?: moment.Moment;
			startDateText:string;
			
		}= {
			 startDate: moment(date),
			 startDateText:dateText
			 /*startTime:  null,
			 endTime: null*/
		};
	    if(prevState.startTime) {
		   newState.startTime = moment({ 
		   year : date.year(), 
		   month :date.month(), 
		   day : date.date(), 
		   hour : prevState.startTime.hour(), 
		   minute :  prevState.startTime.minute()
		  });
		 
	   }

       if(prevState.endTime) {
		   newState.endTime =  moment({ 
		   year : date.year(), 
		   month :date.month(), 
		   day : date.date(), 
		   hour : prevState.endTime.hour(), 
		   minute : prevState.endTime.minute()
		  })
		 
	   }

       return newState;	   
	    
	 });

   } else {
	  this.setState({
		startDateText:''
	  });
   }
    
   };
   
   setProjectMeetingStartTime = (event) => {
		const pattern = /([0-9]{1,2}):([0-9]{1,2})/g;
		const match = pattern.exec(event.target.value);
		 let timeText=event.target.value;
		if(match&&match.length>=3) {
			const hours = parseInt(match[1]);
			const minutes = parseInt(match[2]);
			let date = moment();
			date.hours(hours);
			date.minutes(minutes);
			this.setState((prevState, props) => {
				if(prevState.startDate) {
				return {
					startTime: moment({ 
					year : prevState.startDate.year(), 
					month : prevState.startDate.month(), 
					day :  prevState.startDate.date(), 
					hour : date.hours(), 
					minute : date.minutes() 
					}),
					startTimeText:timeText
				}
				}
			
			else {
			return {
				startTime: moment(date),
				startTimeText:timeText
			}
		}
		});

	}  else {
	   this.setState({
		   startTimeText:''
	   });
	}
   };
   
   setProjectMeetingEndTime = (event) => {
	const pattern = /([0-9]{1,2}):([0-9]{1,2})/g;
	const match = pattern.exec(event.target.value);
     let timeText=event.target.value;
    if(match&&match.length>=3) {

		const hours = parseInt(match[1]);
		const minutes = parseInt(match[2]);
		let date = moment();
		date.hours(hours);
		date.minutes(minutes);
		
		this.setState((prevState, props) => {
				if(prevState.startDate) {
				return {
					endTime: moment({ 
					year : prevState.startDate.year(), 
					month : prevState.startDate.month(), 
					day :  prevState.startDate.date(), 
					hour : date.hours(), 
					minute : date.minutes() 
					}),
					endTimeText:timeText
				}
				}
			
			else {
			return {
				endTime: moment(date),
				endTimeText:timeText
			}
			}
		});
	} else {
	   this.setState({
		   endTimeText:''
	   });
	}
   };
 
  render() {
      return (
          <Dialog
		    maxWidth="sm"
            fullWidth  
            open={this.props.projectMeetingDialog.open}
          >
		  <DialogTitle>
		  Megbeszélés létrehozása
		 </DialogTitle>
		 <DialogContent>
           <div>
			   <TextField
                            id="startDate"
                            label="Campus kezdete"
                            type="date"
							onChange={ (event)=> {
								this.setState({
								  startDateText:event.target.value
								});
							}}
                            onBlur={this.setProjectMeetingDate}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={this.state.startDateText}
                        />
		  </div>      
		  <div>

		  <TextField
        id="time1"
        label="Kezdő időpont"
        type="time"
		onChange={ (event)=> {
								this.setState({
								  startTimeText:event.target.value
								});
							}}
		onBlur={this.setProjectMeetingStartTime}
		value={this.state.startTimeText}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          step: 300, // 5 min
        }}
      />
	  <TextField
        id="time3"
        label="Végzés időpont"
        type="time"
		onChange={ (event)=> {
								this.setState({
								  endTimeText:event.target.value
								});
							}}
		onBlur={this.setProjectMeetingEndTime}
		value={this.state.endTimeText}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          step: 300, // 5 min
        }}
      />
		  </div>
		  </DialogContent>
		  <DialogActions>
		  <Button 
				color="primary" 
				onClick={() => {
                        if (this.props.projectMeetingDialog.mode == 'create') {
                            this.props.addProjectMeeting(this.state);
                        } else {
                            //this.props.editProjectMeeting(this.state);
                        }
                    }
                    }>
					{this.props.projectMeetingDialog.mode == 'create' ? "Hozzáadás" : "Módosítás"}
					</Button>
				<Button 
				color="primary" 
				onClick={() => { this.props.toggleProjectMeetingDialog(false, ''); }}>
				Mégse
				</Button>
		  </DialogActions>
          </Dialog>
      )
  }
}

export default connect(
    (state: ApplicationState) => state.projectDetails,
    ProjectDetailsStore.actionCreators)
    (ProjectMeetingDialog) as React.ComponentClass<{}>;