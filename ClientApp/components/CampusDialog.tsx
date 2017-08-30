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

    public render() {
        return <div>
            <Dialog
                title="Új felhasználó létrehozása"
                modal={false}
                open={this.props.openCampusDialog}
                autoScrollBodyContent={false}
                autoDetectWindowHeight={true}
                actions={[<FlatButton label="Hozzádás" primary={true} onClick={() => { this.props.addCampus(); }} />,
                <FlatButton label="Mégse" primary={true} onClick={() => { this.props.toggleCampusDialog(false); }} />]}
            > {/* this.props.modifyEditedUser({ ...this.props.editedUser, name: target.value }); */}
                <DatePicker hintText="Campus kezdete" onChange={this.setCampusStartDate} /><br />
                <DatePicker hintText="Campus vége" onChange={this.setCampusEndDate} /><br />
                <div style={styles.block}>
                    <Checkbox
                        label="Aktuális campus"
                        labelPosition="left"
                        style={styles.checkbox}
                        onCheck={this.setActualCampus}
                    />
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