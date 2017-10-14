import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as CampusStore from '../store/Campus';
import { Dialog } from 'material-ui';
import { FlatButton } from 'material-ui';
import { TextField } from 'material-ui';
import DatePicker from 'material-ui/DatePicker';
import Checkbox from 'material-ui/Checkbox';
import Chip from 'material-ui/Chip';
import * as moment from 'moment';

// At runtime, Redux will merge together...
type CampusProps =
    CampusStore.CampusState        // ... state we've requested from the Redux store
    & typeof CampusStore.actionCreators      // ... plus action creators we've requested
    & RouteComponentProps<{}>

const styles = {
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
};

class CampusDialog extends React.Component<CampusProps, {}> {

    setCampusStartDate = (event, date) => {
        this.props.modifyEditedCampus({ ...this.props.editedCampus, startDate: moment(date) });
    };

    setCampusEndDate = (event, date) => {
        this.props.modifyEditedCampus({ ...this.props.editedCampus, endDate: moment(date) });
    };

    setActualCampus = (event, isInputChecked) => {
        this.props.modifyEditedCampus({ ...this.props.editedCampus, active: isInputChecked });
    };

    setCampusInactiveStartDate = (event, date) => {
        this.props.modifyEditedCampus({
            ...this.props.editedCampus,
            campusInactive: {
                startDate: moment(date),
                endDate: (this.props.editedCampus && this.props.editedCampus.campusInactive) ?
                    this.props.editedCampus.campusInactive.endDate : undefined
            }
        });
    };

    setCampusInactiveEndDate = (event, date) => {
        this.props.modifyEditedCampus({
            ...this.props.editedCampus,
            campusInactive: {
                startDate: (this.props.editedCampus && this.props.editedCampus.campusInactive) ?
                    this.props.editedCampus.campusInactive.startDate : undefined,
                endDate: moment(date)
            }
        });
    };

    setCampusActiveNotStartedStartDate = (event, date) => {
        this.props.modifyEditedCampus({
            ...this.props.editedCampus,
            campusActiveNotStarted: {
                startDate: moment(date),
                endDate: (this.props.editedCampus && this.props.editedCampus.campusActiveNotStarted) ?
                    this.props.editedCampus.campusActiveNotStarted.endDate : undefined
            }
        });
    };

    setCampusActiveNotStartedEndDate = (event, date) => {
        this.props.modifyEditedCampus({
            ...this.props.editedCampus,
            campusActiveNotStarted: {
                startDate: (this.props.editedCampus && this.props.editedCampus.campusActiveNotStarted) ?
                    this.props.editedCampus.campusActiveNotStarted.startDate : undefined,
                endDate: moment(date)
            }
        });
    };


    public render() {
        return <div>
            <Dialog
                title={this.props.campusDialog.mode == 'create' ? "Új campus szemeszter létrehozása" : "Szemeszter módosítása"}
                modal={false}
                open={this.props.campusDialog.open}
                autoScrollBodyContent={false}
                autoDetectWindowHeight={true}
                actions={[<FlatButton label={this.props.campusDialog.mode == 'create' ? "Hozzáadás" : "Módosítás"}
                    primary={true} onClick={() => {
                        if (this.props.campusDialog.mode == 'create') {
                            this.props.addCampus();
                        } else {
                            this.props.editCampus();
                        }
                    }
                    } />,
                <FlatButton label="Mégse" primary={true} onClick={() => { this.props.toggleCampusDialog(false, ''); }} />]}
            > {/* this.props.modifyEditedUser({ ...this.props.editedUser, name: target.value }); */}
                <DatePicker
                    hintText="Campus kezdete"
                    onChange={this.setCampusStartDate}
                    value={this.props.editedCampus ? this.props.editedCampus.startDate.toDate() : undefined}
                /><br />
                <DatePicker
                    hintText="Campus vége"
                    onChange={this.setCampusEndDate}
                    value={this.props.editedCampus ? this.props.editedCampus.endDate.toDate() : undefined} /><br />
                <div style={styles.block}>
                    <Checkbox
                        label="Aktuális campus"
                        labelPosition="left"
                        style={styles.checkbox}
                        onCheck={this.setActualCampus}
                        checked={this.props.editedCampus ? this.props.editedCampus.active : false}
                    />
                </div>
                <div style={{...styles.stateBlock, justifyContent: 'space-between'}}>
                    <Chip
                        style={styles.chip}>
                        Inaktív
                </Chip>
                    <DatePicker
                        hintText="Időszak kezdete"
                        textFieldStyle={styles.datePickerTextField}
                        onChange={this.setCampusInactiveStartDate}
                        value={this.props.editedCampus && this.props.editedCampus.campusInactive
                            && this.props.editedCampus.campusInactive.startDate
                            ? this.props.editedCampus.campusInactive.startDate.toDate() : undefined}
                    />
                    <DatePicker
                        hintText="Időszak vége"
                        textFieldStyle={styles.datePickerTextField}
                        onChange={this.setCampusInactiveEndDate}
                        value={this.props.editedCampus && this.props.editedCampus.campusInactive
                            && this.props.editedCampus.campusInactive.endDate
                            ? this.props.editedCampus.campusInactive.endDate.toDate() : undefined}
                    />
                </div>
                <div style={{...styles.stateBlock, justifyContent: 'space-between'}}>
                    <Chip
                        style={styles.chip}>
                        Jelentkezési időszak
                </Chip>
                    <DatePicker
                        hintText="Időszak kezdete"
                        textFieldStyle={styles.datePickerTextField}
                        onChange={this.setCampusActiveNotStartedStartDate}
                        value={this.props.editedCampus && this.props.editedCampus.campusActiveNotStarted
                            && this.props.editedCampus.campusActiveNotStarted.startDate
                            ? this.props.editedCampus.campusActiveNotStarted.startDate.toDate() : undefined}
                    />
                    <DatePicker
                        hintText="Időszak vége"
                        textFieldStyle={styles.datePickerTextField}
                        onChange={this.setCampusActiveNotStartedEndDate}
                        value={this.props.editedCampus && this.props.editedCampus.campusActiveNotStarted
                            && this.props.editedCampus.campusActiveNotStarted.endDate
                            ? this.props.editedCampus.campusActiveNotStarted.endDate.toDate() : undefined}
                    />
                </div>
                <div style={{...styles.stateBlock, justifyContent: 'space-between'}}>
                    <Chip
                        style={styles.chip}>
                        Projekt időszak
                        <DatePicker
                        hintText="Időszak kezdete"
                        textFieldStyle={styles.datePickerTextField}
                        onChange={this.setCampusActiveNotStartedStartDate}
                        value={this.props.editedCampus && this.props.editedCampus.campusActiveStarted
                            && this.props.editedCampus.campusActiveStarted.startDate
                            ? this.props.editedCampus.campusActiveStarted.startDate.toDate() : undefined}
                    />
                    <DatePicker
                        hintText="Időszak vége"
                        textFieldStyle={styles.datePickerTextField}
                        onChange={this.setCampusActiveNotStartedEndDate}
                        value={this.props.editedCampus && this.props.editedCampus.campusActiveStarted
                            && this.props.editedCampus.campusActiveStarted.endDate
                            ? this.props.editedCampus.campusActiveStarted.endDate.toDate() : undefined}
                    />
                </Chip>
                </div>
                <div style={{...styles.stateBlock, justifyContent: 'space-between'}}>
                    <Chip
                        style={styles.chip}>
                        Lezárási időszak
                </Chip>
                </div>

            </Dialog>
        </div>;
    }
}

// Wire up the React component to the Redux store
export default connect(
    (state: ApplicationState) => state.campus, // Selects which state properties are merged into the component's props
    CampusStore.actionCreators                 // Selects which action creators are merged into the component's props
)(CampusDialog) as typeof CampusDialog;