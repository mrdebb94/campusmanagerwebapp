import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as CampusStore from '../store/Campus';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import InputLabel  from '@material-ui/core/InputLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import { WithStyles, StyledComponentProps, withStyles } from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import * as moment from 'moment';

export interface DateRangeText {
    startDateText: string;
    endDateText: string;
}

export interface DateRangeError {
    startDate: string;
    endDate: string;
}

export interface CampusDialogState {
    campusId?: string;
    startDateText: string;
    endDateText: string;
    
    campusInactiveText: DateRangeText;
    campusActiveNotStartedText: DateRangeText;
    campusActiveStartedText: DateRangeText;
    campusFinishedText: DateRangeText;
    
    dateFormError: {
		startDate: string;
		endDate: string;
		campusInactive: DateRangeError;
		campusActiveNotStarted: DateRangeError;
		campusActiveStarted: DateRangeError;
		campusFinished: DateRangeError;
    };
    /*startDate: moment.Moment;
    endDate: moment.Moment;
    campusInactive?: DateRange;
    campusActiveNotStarted?: DateRange;
    campusActiveStarted?: DateRange;
    campusFinished?: DateRange;*/
}

// At runtime, Redux will merge together...
type CampusProps =
    CampusStore.CampusState        // ... state we've requested from the Redux store
    & typeof CampusStore.actionCreators      // ... plus action creators we've requested
    & WithStyles<'button' | 'textField' | 'datePickerTextField'
	                        | 'root' |'heading' | 'secondaryHeading'
						  >;

const styles = theme => ({
	root: {
	  flexGrow: 1,
	},
    button: {
        margin: theme.spacing.unit,
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200
    },
    datePickerTextField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 150
    },
	heading: {
		fontSize: theme.typography.pxToRem(15),
		flexBasis: '33.33%',
		flexShrink: 0,
    },
	secondaryHeading: {
		fontSize: theme.typography.pxToRem(15),
		color: theme.palette.text.secondary,
    }
});

class CampusDialog extends React.Component<CampusProps, CampusDialogState> {

    styles = {
        block: {
            maxWidth: 250,
        },
        checkbox: {
            marginBottom: 16,
        },
        chip: {
            margin: 4,
            width: 180,
            height: 32
        },
        stateBlock: {
            display: 'flex',
            flexFlow: 'row wrap',
        },
        datePickerTextField: {
            width: 150
        }
    }

    state:CampusDialogState={
		startDateText: '',
		endDateText: '',
		campusInactiveText: {
						startDateText: '', 
					   endDateText: '' 
					},
		campusActiveNotStartedText: {
						startDateText: '', 
					   endDateText: '' 
					},
		campusActiveStartedText: {
						startDateText: '', 
					   endDateText: '' 
					},
		campusFinishedText: {
						startDateText:'', 
					   endDateText: '' 
					},
        dateFormError: {
			startDate: '',
			endDate: '',
			campusInactive: {
				startDate: '',
				endDate: ''
		    },
			campusActiveNotStarted: {
				startDate: '',
				endDate: ''
		    },
			campusActiveStarted: {
				startDate: '',
				endDate: ''
		    },
			campusFinished: {
				startDate: '',
				endDate: ''
		    }
        }
    };

    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {
        //fel fog nyílni a dialógusablak
        if (this.props.campusDialog.open == false
            && nextProps.campusDialog.open == true) {
                //van kijelölve felhasználó
            if (nextProps.editedCampus != null) {
                this.setState({
                    startDateText: nextProps.editedCampus
                                   ? nextProps.editedCampus.startDate.format('YYYY-MM-DD')
								   : '',
					endDateText: nextProps.editedCampus
                                   ? nextProps.editedCampus.endDate.format('YYYY-MM-DD')
								   : '',
					campusInactiveText: {
									startDateText: nextProps.editedCampus.campusInactive
                                && nextProps.editedCampus.campusInactive.startDate
                                ? nextProps.editedCampus.campusInactive.startDate.format('YYYY-MM-DD') 
                                : '', 
                                   endDateText: nextProps.editedCampus.campusInactive
                                && nextProps.editedCampus.campusInactive.endDate
                                ? nextProps.editedCampus.campusInactive.endDate.format('YYYY-MM-DD') 
                                : '' 
                                },
					campusActiveNotStartedText: {
									startDateText: nextProps.editedCampus.campusActiveNotStarted
                                && nextProps.editedCampus.campusActiveNotStarted.startDate
                                ? nextProps.editedCampus.campusActiveNotStarted.startDate.format('YYYY-MM-DD') 
                                : '', 
                                   endDateText: nextProps.editedCampus.campusActiveNotStarted
                                && nextProps.editedCampus.campusActiveNotStarted.endDate
                                ? nextProps.editedCampus.campusActiveNotStarted.endDate.format('YYYY-MM-DD') 
                                : '' 
                                },
					campusActiveStartedText: {
									startDateText: nextProps.editedCampus.campusActiveStarted
                                && nextProps.editedCampus.campusActiveStarted.startDate
                                ? nextProps.editedCampus.campusActiveStarted.startDate.format('YYYY-MM-DD') 
                                : '', 
                                   endDateText: nextProps.editedCampus.campusActiveStarted
                                && nextProps.editedCampus.campusActiveStarted.endDate
                                ? nextProps.editedCampus.campusActiveStarted.endDate.format('YYYY-MM-DD') 
                                : '' 
                                },
					campusFinishedText: {
									startDateText: nextProps.editedCampus.campusFinished
                                && nextProps.editedCampus.campusFinished.startDate
                                ? nextProps.editedCampus.campusFinished.startDate.format('YYYY-MM-DD') 
                                : '', 
                                   endDateText: nextProps.editedCampus.campusFinished
                                && nextProps.editedCampus.campusFinished.endDate
                                ? nextProps.editedCampus.campusFinished.endDate.format('YYYY-MM-DD') 
                                : '' 
                    },
					dateFormError: {
						startDate: '',
						endDate: '',
						campusInactive: {
							startDate: '',
							endDate: ''
						},
						campusActiveNotStarted: {
							startDate: '',
							endDate: ''
						},
						campusActiveStarted: {
							startDate: '',
							endDate: ''
						},
						campusFinished: {
							startDate: '',
							endDate: ''
						}
					}
                });
            } else {
                //nincs kijelölve felhasználó
                this.setState({
                    startDateText: '',
					endDateText: '',
					campusInactiveText: {
									startDateText: '', 
                                   endDateText: '' 
                                },
					campusActiveNotStartedText: {
									startDateText: '', 
                                   endDateText: '' 
                                },
					campusActiveStartedText: {
									startDateText: '', 
                                   endDateText: '' 
                                },
					campusFinishedText: {
									startDateText:'', 
                                   endDateText: '' 
                                },
					dateFormError: {
						startDate: '',
						endDate: '',
						campusInactive: {
							startDate: '',
							endDate: ''
						},
						campusActiveNotStarted: {
							startDate: '',
							endDate: ''
						},
						campusActiveStarted: {
							startDate: '',
							endDate: ''
						},
						campusFinished: {
							startDate: '',
							endDate: ''
						}
					}
                });
            }
        //be fog záródni a dialógusablak
        } else if (this.props.campusDialog.open == true
            && nextProps.campusDialog.open == false) {
             this.setState({
                    startDateText: '',
					endDateText: '',
					campusInactiveText: {
									startDateText: '', 
                                   endDateText: '' 
                                },
					campusActiveNotStartedText: {
									startDateText: '', 
                                   endDateText: '' 
                                },
					campusActiveStartedText: {
									startDateText: '', 
                                   endDateText: '' 
                                },
					campusFinishedText: {
									startDateText:'', 
                                   endDateText: '' 
                    },
					dateFormError: {
						startDate: '',
						endDate: '',
						campusInactive: {
							startDate: '',
							endDate: ''
						},
						campusActiveNotStarted: {
							startDate: '',
							endDate: ''
						},
						campusActiveStarted: {
							startDate: '',
							endDate: ''
						},
						campusFinished: {
							startDate: '',
							endDate: ''
						}
					}
            });
        }
    }

    
    setCampusStartDate = (event) => {
        let date = event.target.value;
		let dateError='';
        const pattern = /([0-9]{4})-([0-9]{2})-([0-9]{2})/g;
	    const match = pattern.exec(date);
		if(match&&match.length>=4) {
            let newDate = moment(date);
            if(newDate.isValid()) {
				this.props.modifyEditedCampus({ ...this.props.editedCampus, startDate: newDate });
            } else {
				dateError="Érvénytelen dátum";
            }
		} else {
			dateError="Érvénytelen dátum";
		};
		
			this.setState((prevState, props) => ({
                        dateFormError: { ...prevState.dateFormError, 
                                          startDate: dateError
                        }
             }));
    }

    setCampusEndDate = (event) => {
        let date = event.target.value;
		let dateError='';
        const pattern = /([0-9]{4})-([0-9]{2})-([0-9]{2})/g;
	    const match = pattern.exec(date);
		if(match&&match.length>=4) {
			let newDate = moment(date);
            if(newDate.isValid()) {
				this.props.modifyEditedCampus({ ...this.props.editedCampus, endDate: newDate });
			} else {
				dateError="Érvénytelen dátum";
			}
        } else {
			dateError="Érvénytelen dátum";
		}
		
		this.setState((prevState, props) => ({
                        dateFormError: { ...prevState.dateFormError, 
                                          endDate: dateError
                        }
        }));
    };

    setActualCampus = (event) => {
        this.props.modifyEditedCampus({ ...this.props.editedCampus, active: event.target.checked });
    };

    setCampusInactiveStartDate = (event) => {
        let date = event.target.value;
		let dateError='';
        const pattern = /([0-9]{4})-([0-9]{2})-([0-9]{2})/g;
	    const match = pattern.exec(date);
		if(match&&match.length>=4) {
			let newDate = moment(date);
            if(newDate.isValid()) {
				this.props.modifyEditedCampus({
					...this.props.editedCampus,
					campusInactive: {
						startDate: moment(date),
						endDate: (this.props.editedCampus && this.props.editedCampus.campusInactive) ?
							this.props.editedCampus.campusInactive.endDate : undefined
					}
				});
			} else {
				dateError="Érvénytelen dátum";
			}
		} else {
			dateError="Érvénytelen dátum";
		}
		
		this.setState((prevState, props) => ({
                        dateFormError: { ...prevState.dateFormError, 
                                          campusInactive: {
											  ...prevState.dateFormError.campusInactive,
											  startDate:dateError
										  }
                        }
        }));
		
    };

    setCampusInactiveEndDate = (event) => {
        let date = event.target.value;
		let dateError='';
		const pattern = /([0-9]{4})-([0-9]{2})-([0-9]{2})/g;
	    const match = pattern.exec(date);
		if(match&&match.length>=4) {
			let newDate = moment(date);
            if(newDate.isValid()) {
				this.props.modifyEditedCampus({
					...this.props.editedCampus,
					campusInactive: {
						startDate: (this.props.editedCampus && this.props.editedCampus.campusInactive) ?
							this.props.editedCampus.campusInactive.startDate : undefined,
						endDate: moment(date)
					}
				});
			} else {
				dateError="Érvénytelen dátum";
			}
		} else {
			dateError="Érvénytelen dátum";
		}
		
		this.setState((prevState, props) => ({
                        dateFormError: { ...prevState.dateFormError, 
                                          campusInactive: {
											  ...prevState.dateFormError.campusInactive,
											  endDate:dateError
										  }
                        }
        }));
    };

    setCampusActiveNotStartedStartDate = (event) => {
        let date = event.target.value;
		let dateError='';
		const pattern = /([0-9]{4})-([0-9]{2})-([0-9]{2})/g;
	    const match = pattern.exec(date);
		if(match&&match.length>=4) {
			let newDate = moment(date);
            if(newDate.isValid()) {
				this.props.modifyEditedCampus({
					...this.props.editedCampus,
					campusActiveNotStarted: {
						startDate: moment(date),
						endDate: (this.props.editedCampus && this.props.editedCampus.campusActiveNotStarted) ?
							this.props.editedCampus.campusActiveNotStarted.endDate : undefined
					}
				});
			} else {
				dateError="Érvénytelen dátum";
			}
		} else {
			dateError="Érvénytelen dátum";
		}
		this.setState((prevState, props) => ({
                        dateFormError: { ...prevState.dateFormError, 
                                          campusActiveNotStarted: {
											  ...prevState.dateFormError.campusActiveNotStarted,
											  startDate:dateError
										  }
                        }
        }));
    };

    setCampusActiveNotStartedEndDate = (event) => {
        let date = event.target.value;
		let dateError='';
		const pattern = /([0-9]{4})-([0-9]{2})-([0-9]{2})/g;
	    const match = pattern.exec(date);
		if(match&&match.length>=4) {
			let newDate = moment(date);
            if(newDate.isValid()) {
				this.props.modifyEditedCampus({
					...this.props.editedCampus,
					campusActiveNotStarted: {
						startDate: (this.props.editedCampus && this.props.editedCampus.campusActiveNotStarted) ?
							this.props.editedCampus.campusActiveNotStarted.startDate : undefined,
						endDate: moment(date)
					}
				});
			} else {
				dateError="Érvénytelen dátum";
			}
		} else {
			dateError="Érvénytelen dátum";
		}
		
		this.setState((prevState, props) => ({
                        dateFormError: { ...prevState.dateFormError, 
                                          campusActiveNotStarted: {
											  ...prevState.dateFormError.campusActiveNotStarted,
											  endDate:dateError
										  }
                        }
        }));
    };

    setCampusActiveStartedStartDate = (event) => {
        let date = event.target.value;
		let dateError='';
		const pattern = /([0-9]{4})-([0-9]{2})-([0-9]{2})/g;
	    const match = pattern.exec(date);
		if(match&&match.length>=4) {
			let newDate = moment(date);
            if(newDate.isValid()) {
				this.props.modifyEditedCampus({
					...this.props.editedCampus,
					campusActiveStarted: {
						startDate: moment(date),
						endDate: (this.props.editedCampus && this.props.editedCampus.campusActiveStarted) ?
							this.props.editedCampus.campusActiveStarted.endDate : undefined
					}
				});
			} else {
				dateError="Érvénytelen dátum";
			}
		} else {
			dateError="Érvénytelen dátum";
		}
		
		this.setState((prevState, props) => ({
                        dateFormError: { ...prevState.dateFormError, 
                                          campusActiveStarted: {
											  ...prevState.dateFormError.campusActiveNotStarted,
											  startDate:dateError
										  }
                        }
        }));
    };

    setCampusActiveStartedEndDate = (event) => {
        let date = event.target.value;
		let dateError='';
		const pattern = /([0-9]{4})-([0-9]{2})-([0-9]{2})/g;
	    const match = pattern.exec(date);
		if(match&&match.length>=4) {
			let newDate = moment(date);
            if(newDate.isValid()) {
				this.props.modifyEditedCampus({
					...this.props.editedCampus,
					campusActiveStarted: {
						startDate: (this.props.editedCampus && this.props.editedCampus.campusActiveStarted) ?
							this.props.editedCampus.campusActiveStarted.startDate : undefined,
						endDate: moment(date)
					}
				});
			} else {
			   dateError="Érvénytelen dátum";
			}
		} else {
			dateError="Érvénytelen dátum";
		}
		this.setState((prevState, props) => ({
                        dateFormError: { ...prevState.dateFormError, 
                                          campusActiveStarted: {
											  ...prevState.dateFormError.campusActiveNotStarted,
											  endDate:dateError
										  }
                        }
        }));
    };

    public render() {
        const { classes } = this.props;
        const { styles } = this;
        return (<div>
            <Dialog
                aria-labelledby="campus-create-dialog-title"
                title={this.props.campusDialog.mode == 'create' ? "Új campus szemeszter létrehozása" : "Szemeszter módosítása"}
                maxWidth="sm"
                fullWidth
                open={this.props.campusDialog.open}
            >
                <DialogTitle id="campus-create-dialog-title">
                    {this.props.campusDialog.mode == 'create'
                        ? "Új campus szemeszter létrehozása"
                        : "Szemeszter módosítása"
                    }
                </DialogTitle>
                <DialogContent>
                    <div>
                        <TextField
                            id="campusStartDate"
                            label="Campus kezdete"
                            type="date"
                            onBlur={this.setCampusStartDate}
                            onChange={ (event)=>{this.setState({startDateText: event.target.value});}}
                            className={classes!.textField}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={this.state.startDateText}
							error={this.state.dateFormError.startDate!=''}
                            helperText={this.state.dateFormError.startDate}
                        />
                    </div>
                    <div>
                        <TextField
                            id="campusEndDate"
                            label="Campus vége"
                            type="date"
                            onBlur={this.setCampusEndDate}
                            onChange={ (event)=>{this.setState({endDateText: event.target.value});}}
                            className={classes!.textField}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={this.state.endDateText}
							error={this.state.dateFormError.endDate!=''}
                            helperText={this.state.dateFormError.endDate}
                        />
                    </div>
                    <div style={styles.block}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={this.props.editedCampus ? this.props.editedCampus.active : false}
                                    onChange={this.setActualCampus}
                                />
                            }
                            label="Aktív"
                        />
                    </div>
					<div className={classes!.root}>
					<div>
					  <ExpansionPanel>
						  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
							<Typography className={classes!.heading}>Inaktív időszak</Typography>
							<Typography className={classes!.secondaryHeading}>Ide a dátum fog jönni</Typography>
						  </ExpansionPanelSummary>
						  <ExpansionPanelDetails>
						   <div style={{ ...styles.stateBlock, justifyContent: 'space-between' }}>
							 <TextField
                            id="campusCampusInactiveStartDate"
                            label="Időszak kezdete"
                            type="date"
                            onBlur={this.setCampusInactiveStartDate}
							onChange={ (event)=>{
                                       let dateText=event.target.value;
                                       this.setState((prevState, props) => ({
                                        campusInactiveText: { ...prevState.campusInactiveText, 
                                                              startDateText: dateText
                                        }
                                       }));
                            }}
                            className={classes!.datePickerTextField}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={this.state.campusInactiveText.startDateText}
							error={this.state.dateFormError.campusInactive.startDate!=''}
                            helperText={this.state.dateFormError.campusInactive.startDate}
                           
                        />
                            <TextField
                            id="campusCampusInactiveEndDate"
                            label="Időszak vége"
                            type="date"
                            onBlur={this.setCampusInactiveEndDate}
							onChange={ (event)=>{
                                       let dateText=event.target.value;
                                       this.setState((prevState, props) => ({
                                        campusInactiveText: { ...prevState.campusInactiveText, 
                                                              endDateText: dateText
                                        }
                                       }));
                            }}
                            className={classes!.datePickerTextField}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={this.state.campusInactiveText.endDateText}
							error={this.state.dateFormError.campusInactive.endDate!=''}
                            helperText={this.state.dateFormError.campusInactive.endDate}
                           
                        />
						</div>
						  </ExpansionPanelDetails>
						</ExpansionPanel>
					</div>
					 {/*
                    <div style={{ ...styles.stateBlock, justifyContent: 'space-between' }}>
                        
                       <Chip
                            style={styles.chip}
                            label="Inaktív"
                        />
                        <TextField
                            id="campusCampusInactiveStartDate"
                            label="Időszak kezdete"
                            type="date"
                            onBlur={this.setCampusInactiveStartDate}
							onChange={ (event)=>{
                                       let dateText=event.target.value;
                                       this.setState((prevState, props) => ({
                                        campusInactiveText: { ...prevState.campusInactiveText, 
                                                              startDateText: dateText
                                        }
                                       }));
                            }}
                            className={classes!.datePickerTextField}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={this.state.campusInactiveText.startDateText}
							error={this.state.dateFormError.campusInactive.startDate!=''}
                            helperText={this.state.dateFormError.campusInactive.startDate}
                           
                        />
                            <TextField
                            id="campusCampusInactiveEndDate"
                            label="Időszak vége"
                            type="date"
                            onBlur={this.setCampusInactiveEndDate}
							onChange={ (event)=>{
                                       let dateText=event.target.value;
                                       this.setState((prevState, props) => ({
                                        campusInactiveText: { ...prevState.campusInactiveText, 
                                                              endDateText: dateText
                                        }
                                       }));
                            }}
                            className={classes!.datePickerTextField}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={this.state.campusInactiveText.endDateText}
							error={this.state.dateFormError.campusInactive.endDate!=''}
                            helperText={this.state.dateFormError.campusInactive.endDate}
                           
                        />
                    </div>
					*/}
					 <div>
					 <ExpansionPanel>
						  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
							<Typography className={classes!.heading}>Jelentkezési időszak</Typography>
							<Typography className={classes!.secondaryHeading}>Ide a dátum fog jönni</Typography>
						  </ExpansionPanelSummary>
						 <ExpansionPanelDetails>
                       <div style={{ ...styles.stateBlock, justifyContent: 'space-between' }}>  
                        <TextField
                            id="campusActiveNotStartedStartDate"
                            label="Időszak kezdete"
                            type="date"
                            onBlur={this.setCampusActiveNotStartedStartDate}
							onChange={ (event)=>{
                                       let dateText=event.target.value;
                                       this.setState((prevState, props) => ({
                                        campusActiveNotStartedText: { ...prevState.campusActiveNotStartedText, 
                                                              startDateText: dateText
                                        }
                                       }));
                            }}
                            className={classes!.datePickerTextField}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={this.state.campusActiveNotStartedText.startDateText}
                            error={this.state.dateFormError.campusActiveNotStarted.startDate!=''}
                            helperText={this.state.dateFormError.campusActiveNotStarted.startDate}
                            />
                         <TextField
                            id="campusActiveNotStartedEndDate"
                            label="Időszak vége"
                            type="date"
                            onBlur={this.setCampusActiveNotStartedEndDate}
                            onChange={ (event)=>{
                                       let dateText=event.target.value;
                                       this.setState((prevState, props) => ({
                                        campusActiveNotStartedText: { ...prevState.campusActiveNotStartedText, 
                                                              endDateText: dateText
                                        }
                                       }));
                            }}
                            className={classes!.datePickerTextField}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={this.state.campusActiveNotStartedText.endDateText}
                            error={this.state.dateFormError.campusActiveNotStarted.endDate!=''}
                            helperText={this.state.dateFormError.campusActiveNotStarted.endDate}
                            />
                       </div>
					  </ExpansionPanelDetails>
					  </ExpansionPanel>
					</div>
					
					<div>
					 <ExpansionPanel>
						  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
							<Typography className={classes!.heading}>Projekt időszak</Typography>
							<Typography className={classes!.secondaryHeading}>Ide a dátum fog jönni</Typography>
						  </ExpansionPanelSummary>
						  <ExpansionPanelDetails>
                        <div style={{ ...styles.stateBlock, justifyContent: 'space-between' }}>
                        <TextField
                            id="campusActiveStartedStartDate"
                            label="Időszak kezdete"
                            type="date"
                            onBlur={this.setCampusActiveStartedStartDate}
							onChange={ (event)=>{
                                       let dateText=event.target.value;
                                       this.setState((prevState, props) => ({
                                        campusActiveStartedText: { ...prevState.campusActiveStartedText, 
                                                              startDateText: dateText
                                        }
                                       }));
                            }}
                            className={classes!.datePickerTextField}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={this.state.campusActiveStartedText.startDateText}
							error={this.state.dateFormError.campusActiveStarted.startDate!=''}
                            helperText={this.state.dateFormError.campusActiveStarted.startDate}
                            />
                        
                        <TextField
                            id="campusActiveStartedEndDate"
                            label="Időszak vége"
                            type="date"
                            onBlur={this.setCampusActiveStartedEndDate}
							onChange={ (event)=>{
                                       let dateText=event.target.value;
                                       this.setState((prevState, props) => ({
                                        campusActiveStartedText: { ...prevState.campusActiveStartedText, 
                                                              endDateText: dateText
                                        }
                                       }));
                            }}
                            className={classes!.datePickerTextField}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={this.state.campusActiveStartedText.endDateText}
							error={this.state.dateFormError.campusActiveStarted.endDate!=''}
                            helperText={this.state.dateFormError.campusActiveStarted.endDate}
                            />
                       </div>
					   </ExpansionPanelDetails>
					  </ExpansionPanel>
					  </div>
                      {/*<div style={{ ...styles.stateBlock, justifyContent: 'space-between' }}>
                        <Chip
                            style={styles.chip}
                            label="Lezárási időszak"   
                        />             
                      </div>
					  */}
				   </div>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        onClick={() => {
                            if (this.props.campusDialog.mode == 'create') {
                                this.props.addCampus();
                            } else {
                                this.props.editCampus();
                            }
                        }
                        }
                    >
                        {this.props.campusDialog.mode == 'create' ? "Hozzáadás" : "Módosítás"}
                    </Button>
                    <Button
                        color="primary"
                        onClick={() => { this.props.toggleCampusDialog(false, ''); }}
                    >
                        Mégse
                </Button>
                </DialogActions>
            </Dialog>
        </div>);
    }
}

export default connect(
    (state: ApplicationState) => state.campus,
    CampusStore.actionCreators
)(withStyles(styles)(CampusDialog)) as React.ComponentClass<{}>;