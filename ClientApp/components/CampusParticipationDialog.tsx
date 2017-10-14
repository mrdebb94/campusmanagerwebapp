import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

import { Dialog } from 'material-ui';
import { FlatButton } from 'material-ui';
import { TextField } from 'material-ui';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import * as CampusParticipationStore from '../store/CampusParticipation';

// At runtime, Redux will merge together...
type CampusProps =
    CampusParticipationStore.CampusParticipationState        // ... state we've requested from the Redux store
    & typeof CampusParticipationStore.actionCreators      // ... plus action creators we've requested
    & RouteComponentProps<{}>

export class CampusParticipationDialog extends React.Component<CampusProps, any> {

    public render() {
        const { editedCampusParticipation } = this.props;
        let student, mentor, role;
    
        if(editedCampusParticipation) {
          ({ student, mentor, role } = editedCampusParticipation);
        }

        return <div>
            <Dialog
                title="Campus résztvétel módosítása"
                modal={false}
                open={this.props.campusParticipationDialog ? this.props.campusParticipationDialog.open : false}
                autoScrollBodyContent={false}
                autoDetectWindowHeight={true}
                actions={[<FlatButton label="Hozzádás" primary={true} onClick={
                    () => { this.props.editCampusParticipation(); }} />,
                <FlatButton label="Mégse" primary={true} onClick={
                    () => { this.props.toggleCampusParticipationDialog(false); }} />]}
            >
                <TextField
                    floatingLabelText="Név:"
                    floatingLabelFixed={true}
                    value={editedCampusParticipation ? (student?student.name:(mentor?mentor.name:'')):'' }
                    disabled={true}
                /><br />
                <SelectField
                    floatingLabelText="Szerep"
                    value={this.props.editedCampusParticipation ? this.props.editedCampusParticipation.role
                        : ''}
                    onChange={(event, index, value) => {
                        let target = event.target as HTMLInputElement;
                        this.props.modifyEditedCampusParticipation({
                            ...this.props.editedCampusParticipation, role: value
                        });
                    }}
                >
                    <MenuItem value={"Mentor"} primaryText="Mentor" />
                    <MenuItem value={"Student"} primaryText="Tanuló" />

                </SelectField>
            </Dialog>
        </div>
    }
}