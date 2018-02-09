import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as CampusStore from '../store/Campus';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Input, { InputLabel } from 'material-ui/Input';
import Checkbox from 'material-ui/Checkbox';
import Chip from 'material-ui/Chip';
import { WithStyles, StyledComponentProps, withStyles } from 'material-ui/styles';
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import * as moment from 'moment';

// At runtime, Redux will merge together...
type CampusProps =
    CampusStore.CampusState        // ... state we've requested from the Redux store
    & typeof CampusStore.actionCreators      // ... plus action creators we've requested
    & StyledComponentProps<'button' | 'textField' | 'datePickerTextField'>;

const styles = theme => ({
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
    }
});

class CampusDialog extends React.Component<CampusProps, {}> {

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

    constructor(props) {
        super(props);
    }
    setCampusStartDate = (event) => {
        let date = event.target.value;
        this.props.modifyEditedCampus({ ...this.props.editedCampus, startDate: moment(date) });
    };

    setCampusEndDate = (event) => {
        let date = event.target.value;
        this.props.modifyEditedCampus({ ...this.props.editedCampus, endDate: moment(date) });
    };

    setActualCampus = (event) => {
        this.props.modifyEditedCampus({ ...this.props.editedCampus, active: event.target.checked });
    };

    setCampusInactiveStartDate = (event) => {
        let date = event.target.value;
        this.props.modifyEditedCampus({
            ...this.props.editedCampus,
            campusInactive: {
                startDate: moment(date),
                endDate: (this.props.editedCampus && this.props.editedCampus.campusInactive) ?
                    this.props.editedCampus.campusInactive.endDate : undefined
            }
        });
    };

    setCampusInactiveEndDate = (event) => {
        let date = event.target.value;
        this.props.modifyEditedCampus({
            ...this.props.editedCampus,
            campusInactive: {
                startDate: (this.props.editedCampus && this.props.editedCampus.campusInactive) ?
                    this.props.editedCampus.campusInactive.startDate : undefined,
                endDate: moment(date)
            }
        });
    };

    setCampusActiveNotStartedStartDate = (event) => {
        let date = event.target.value;
        this.props.modifyEditedCampus({
            ...this.props.editedCampus,
            campusActiveNotStarted: {
                startDate: moment(date),
                endDate: (this.props.editedCampus && this.props.editedCampus.campusActiveNotStarted) ?
                    this.props.editedCampus.campusActiveNotStarted.endDate : undefined
            }
        });
    };

    setCampusActiveNotStartedEndDate = (event) => {
        let date = event.target.value;
        this.props.modifyEditedCampus({
            ...this.props.editedCampus,
            campusActiveNotStarted: {
                startDate: (this.props.editedCampus && this.props.editedCampus.campusActiveNotStarted) ?
                    this.props.editedCampus.campusActiveNotStarted.startDate : undefined,
                endDate: moment(date)
            }
        });
    };

    setCampusActiveStartedStartDate = (event) => {
        let date = event.target.value;
        this.props.modifyEditedCampus({
            ...this.props.editedCampus,
            campusActiveStarted: {
                startDate: moment(date),
                endDate: (this.props.editedCampus && this.props.editedCampus.campusActiveStarted) ?
                    this.props.editedCampus.campusActiveStarted.endDate : undefined
            }
        });
    };

    setCampusActiveStartedEndDate = (event) => {
        let date = event.target.value;
        this.props.modifyEditedCampus({
            ...this.props.editedCampus,
            campusActiveStarted: {
                startDate: (this.props.editedCampus && this.props.editedCampus.campusActiveStarted) ?
                    this.props.editedCampus.campusActiveStarted.startDate : undefined,
                endDate: moment(date)
            }
        });
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
                    {/*
                    <DatePicker
                        hintText="Campus kezdete"
                        onChange={this.setCampusStartDate}
                        value={this.props.editedCampus ? this.props.editedCampus.startDate.toDate() : undefined}
                    /><br />
                    <DatePicker
                        hintText="Campus vége"
                        onChange={this.setCampusEndDate}
                        value={this.props.editedCampus ? this.props.editedCampus.endDate.toDate() : undefined} /><br />
                    */}
                    <div>
                        <TextField
                            id="campusStartDate"
                            label="Campus kezdete"
                            type="date"
                            onChange={this.setCampusStartDate}
                            className={classes!.textField}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={this.props.editedCampus
                                ? this.props.editedCampus.startDate.format('YYYY-MM-DD')
                                : moment().format('YYYY-MM-DD')
                            }
                        />
                    </div>
                    <div>
                        <TextField
                            id="campusEndDate"
                            label="Campus vége"
                            type="date"
                            onChange={this.setCampusEndDate}
                            className={classes!.textField}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={this.props.editedCampus
                                ? this.props.editedCampus.endDate.format('YYYY-MM-DD')
                                : moment().format('YYYY-MM-DD')
                            }
                        />
                    </div>
                    <div style={styles.block}>
                        {/*
                        <Checkbox
                            label="Aktuális campus"
                            labelPosition="left"
                            style={styles.checkbox}
                            onCheck={this.setActualCampus}
                            checked={this.props.editedCampus ? this.props.editedCampus.active : false}
                        />
                        */}
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
                    <div style={{ ...styles.stateBlock, justifyContent: 'space-between' }}>
                        
                        <Chip
                            style={styles.chip}
                            label="Inaktív"
                        />
                        <TextField
                            id="campusCampusInactiveStartDate"
                            label="Időszak kezdete"
                            type="date"
                            onChange={this.setCampusInactiveStartDate}
                            className={classes!.datePickerTextField}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={this.props.editedCampus && this.props.editedCampus.campusInactive
                                && this.props.editedCampus.campusInactive.startDate
                                ? this.props.editedCampus.campusInactive.startDate.format('YYYY-MM-DD') 
                                : undefined}
                           
                        />
                            <TextField
                            id="campusCampusInactiveEndDate"
                            label="Időszak vége"
                            type="date"
                            onChange={this.setCampusInactiveEndDate}
                            className={classes!.datePickerTextField}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={this.props.editedCampus && this.props.editedCampus.campusInactive
                                && this.props.editedCampus.campusInactive.endDate
                                ? this.props.editedCampus.campusInactive.endDate.format('YYYY-MM-DD') 
                                : undefined}
                           
                        />
                    </div>
                    <div style={{ ...styles.stateBlock, justifyContent: 'space-between' }}>
                        <Chip
                            style={styles.chip}
                            label="Jelentkezési időszak"
                        />    
                        <TextField
                            id="campusActiveNotStartedStartDate"
                            label="Időszak kezdete"
                            type="date"
                            onChange={this.setCampusActiveNotStartedStartDate}
                            className={classes!.datePickerTextField}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={this.props.editedCampus && this.props.editedCampus.campusActiveNotStarted
                                && this.props.editedCampus.campusActiveNotStarted.startDate
                                ? this.props.editedCampus.campusActiveNotStarted.startDate.format('YYYY-MM-DD')
                                : undefined}
                        
                            />
                         <TextField
                            id="campusActiveNotStartedEndDate"
                            label="Időszak vége"
                            type="date"
                            onChange={this.setCampusActiveNotStartedEndDate}
                            className={classes!.datePickerTextField}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={this.props.editedCampus && this.props.editedCampus.campusActiveNotStarted
                                && this.props.editedCampus.campusActiveNotStarted.endDate
                                ? this.props.editedCampus.campusActiveNotStarted.endDate.format('YYYY-MM-DD')
                                : undefined}
                        
                            />
                    </div>
                    <div style={{ ...styles.stateBlock, justifyContent: 'space-between' }}>
                        <Chip
                            style={styles.chip}
                            label="Projekt időszak"
                        />
                        <TextField
                            id="campusActiveStartedStartDate"
                            label="Időszak kezdete"
                            type="date"
                            onChange={this.setCampusActiveStartedStartDate}
                            className={classes!.datePickerTextField}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={this.props.editedCampus && this.props.editedCampus.campusActiveStarted
                                && this.props.editedCampus.campusActiveStarted.startDate
                                ? this.props.editedCampus.campusActiveStarted.startDate.format('YYYY-MM-DD')
                                : undefined}
                            />
                        
                        <TextField
                            id="campusActiveStartedEndDate"
                            label="Időszak vége"
                            type="date"
                            onChange={this.setCampusActiveStartedEndDate}
                            className={classes!.datePickerTextField}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={this.props.editedCampus && this.props.editedCampus.campusActiveStarted
                                && this.props.editedCampus.campusActiveStarted.endDate
                                ? this.props.editedCampus.campusActiveStarted.endDate.format('YYYY-MM-DD')
                                : undefined}
                            />
                    </div>
                    <div style={{ ...styles.stateBlock, justifyContent: 'space-between' }}>
                        <Chip
                            style={styles.chip}
                            label="Lezárási időszak"   
                        />             
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

// Wire up the React component to the Redux store
export default connect(
    (state: ApplicationState) => state.campus, // Selects which state properties are merged into the component's props
    CampusStore.actionCreators                 // Selects which action creators are merged into the component's props
)(withStyles(styles)(CampusDialog)) as React.ComponentClass<{}>;