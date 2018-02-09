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
}

export class ProjectMeetingDialog extends React.Component<ProjectDetailsProps , ProjectMeetingForm> {
   
   state:ProjectMeetingForm = {

	   description:'',
	   room: '',
	 
	   isCancelled: false,
	   hasWeekly: false
   }
   
   constructor(props) {
	   super(props);
   }
  
  
   setProjectMeetingDate = (event) => {
	let date = moment(event.target.value);
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

    
   };
   
   setProjectMeetingStartTime = (event) => {
		const pattern = /([0-9]{1,2}):([0-9]{1,2})/g;
		const match = pattern.exec(event.target.value);
		
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
					})
				}
				}
			
			else {
			return {
				startTime: moment(date)
			}
		}
		});

	}
   };
   
   setProjectMeetingEndTime = (event) => {
	const pattern = /([0-9]{1,2}):([0-9]{1,2})/g;
	const match = pattern.exec(event.target.value);

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
					})
				}
				}
			
			else {
			return {
				endTime: moment(date)
			}
			}
		});
	}
   };
 
  render() {
      return (
          <Dialog
		  maxWidth="sm"
        fullWidth
          title={
              "Megbeszélés létrehozása"
			  }
               
                open={this.props.projectMeetingDialog.open}

          >
		  <DialogTitle>
		 </DialogTitle>
		 <DialogContent>
           <div>
			   {/*
		  <DatePicker
		            floatingLabelText="Megbeszélés napja"
                    hintText="Megbeszélés napja"
                    onChange={this.setProjectMeetingDate}
					value={ this.state.startDate ? this.state.startDate.toDate() : undefined} />
			   */}
			   <TextField
                            id="startDate"
                            label="Campus kezdete"
                            type="date"
                            onBlur={this.setProjectMeetingDate}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={
								this.state.startDate ? this.state.startDate.format('YYYY-MM-DD') : undefined
							
                            }
                        />
		  </div>      
		  <div>

		  <TextField
        id="time1"
        label="Kezdő időpont"
        type="time"
		onBlur={this.setProjectMeetingStartTime}
		value={this.state.startTime ? this.state.startTime.format("HH:mm") : undefined}
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
		onBlur={this.setProjectMeetingEndTime}
		value={this.state.endTime ? this.state.endTime.format("HH:mm") : undefined}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          step: 300, // 5 min
        }}
      />

			  {/*
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
			  */}
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