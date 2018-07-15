import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';

import { WithStyles, StyledComponentProps, withStyles } from '@material-ui/core/styles';
import * as CampusParticipationStore from '../store/CampusParticipation';

// At runtime, Redux will merge together...
type CampusProps =
    CampusParticipationStore.CampusParticipationState        // ... state we've requested from the Redux store
    & typeof CampusParticipationStore.actionCreators;     // ... plus action creators we've requested

class CampusParticipationDialog extends React.Component<CampusProps, any> {

    public render() {
        const { editedCampusParticipation } = this.props;
        let student, mentor, role;

        if (editedCampusParticipation) {
            ({ student, mentor, role } = editedCampusParticipation);
        }

        return <div>
            <Dialog
                aria-labelledby="user-dialog-title"
                title="Campus résztvétel módosítása"

                open={this.props.campusParticipationDialog ? this.props.campusParticipationDialog.open : false}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle id="campus-participation-dialog-title">Campus résztvétel módosítása</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Név"
                        value={editedCampusParticipation ? (student ? student.user.name : (mentor ? mentor.user.name : '')) : ''}
                        disabled={true}
                    /><br />
                    <InputLabel htmlFor="role-change-helper">Új szerep</InputLabel>
                    <Select
                        value={this.props.editedCampusParticipation ? this.props.editedCampusParticipation.role
                            : ''}
                        onChange={(event) => {
                            let target = event.target as HTMLSelectElement;
                            this.props.modifyEditedCampusParticipation({
                                ...this.props.editedCampusParticipation, role: event.target.value 
                            });
                        }}
                        inputProps={{
                            name: 'role-change',
                            id: 'role-change-helper',
                        }}
                    >
                        <MenuItem value={"Mentor"}>Mentor</MenuItem>
                        <MenuItem value={"Student"}>Tanuló</MenuItem>
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        onClick={() => { this.props.editCampusParticipation(); }} >
                        Módosítás
                </Button>
                    <Button
                        color="primary"
                        onClick={
                            () => { this.props.toggleCampusParticipationDialog(false); }}
                    >
                        Mégse
                </Button>
                </DialogActions>
            </Dialog>

        </div>
    }
}

export default connect(
    (state: ApplicationState) => state.campusParticipation,
    CampusParticipationStore.actionCreators
)(CampusParticipationDialog) as React.ComponentClass<{}>;