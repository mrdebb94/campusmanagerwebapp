import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import AppBar from 'material-ui/AppBar';
import Button from 'material-ui/Button';
import Toolbar from 'material-ui/Toolbar';
import Tabs, { Tab } from 'material-ui/Tabs';
import Table, {
    TableBody,
    TableHead,
    TableRow,
    TableCell
} from 'material-ui/Table';
import { StyledComponentProps, WithStyles, withStyles } from 'material-ui/styles';
import Checkbox from 'material-ui/Checkbox';

//TODO: rename CampusParticipations ??

import * as CampusParticipationStore from '../store/CampusParticipation';
import CampusParticipationDialog from './CampusParticipationDialog'
// At runtime, Redux will merge together...
type CampusParticipationProps =
    CampusParticipationStore.CampusParticipationState        // ... state we've requested from the Redux store
    & typeof CampusParticipationStore.actionCreators      // ... plus action creators we've requested
    & RouteComponentProps<{}>
    & StyledComponentProps<'root' | 'tableWrapper'>;

interface StudentTabState {
    slideIndex: number;
    selectedRows: string | null;
}

const styles=theme=>({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
    },
    tableWrapper: {
        overflowX: 'auto',
    } as React.CSSProperties
});

class CurrentParticipants extends React.Component<CampusParticipationProps, StudentTabState> {
    componentDidMount() {
        this.props.getCampusParticipations();
    }

    constructor(props) {
        super(props);
        this.state = {
            slideIndex: 0,
            selectedRows: null
        };
    }

    handleChange = (event,value) => {
        this.setState({
            slideIndex: value,
        });
    };

    handleClick = (event,id,campusParticipation) =>{
        
        if(id!=this.state.selectedRows) {
            this.setState({ selectedRows: id });
            this.props.modifyEditedCampusParticipation({ 
                    ...campusParticipation });
        } else {
            this.setState({ selectedRows: null });
            this.props.modifyEditedCampusParticipation({role:''});
        }

    }

    public render() {
        const { classes } = this.props;
        return <div>
            <CampusParticipationDialog />
            <AppBar position="static">
            <Tabs
                value={this.state.slideIndex}
                onChange={this.handleChange}
            >
                <Tab label="Diákok" value={0} />
                <Tab label="Mentorok" value={1} />
            </Tabs>

            </AppBar>
              { this.state.slideIndex==0 &&(<div className={classes!.tableWrapper}>
                     <Toolbar>
                            <Button 
                               color="primary" 
                               onClick={() => {
                                this.props.toggleCampusParticipationDialog(true);
                            }} >
                            Módosítás
                            </Button>
                    </Toolbar>
                    <Table>
                        <TableHead>
                            <TableRow>
                               <TableCell padding="checkbox">
                                    <Checkbox disabled />
                                </TableCell>
                                <TableCell>Tanuló azonosítója</TableCell>
                                <TableCell>Tanuló neve </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.props.campusParticipationList ? this.props.campusParticipationList
                                .map((campusParticipation, i) =>
                                    (campusParticipation.student) &&
                                    <TableRow
                                        hover
                                        key={campusParticipation.student!.studentId!}
                                        onClick={event => this.handleClick(event,
                                             campusParticipation.student!.studentId!,campusParticipation)}
                                        selected={
                                            this.state.selectedRows==campusParticipation.student!.studentId!
                                        }
                                        >
                                        <TableCell
                                        padding="checkbox"
                                    >
                                        <Checkbox
                                            checked={
                                                this.state.selectedRows==campusParticipation.student!.studentId!
                                            }
                                        />
                                    </TableCell>
                                        <TableCell>{campusParticipation.student.studentId!}</TableCell>
                                        <TableCell>{campusParticipation.student.name}</TableCell>
                                    </TableRow>
                                ) : ''}
                        </TableBody>
                    </Table>
              </div>)
              }
                { this.state.slideIndex==1 &&(<div className={classes!.tableWrapper}>
                    <Toolbar>
                        <Button  color="primary"
                            onClick={() => {
                                this.props.toggleCampusParticipationDialog(true);
                            }}>
                        Módosítás
                        </Button>
                    </Toolbar>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox disabled />
                                </TableCell>
                                <TableCell>Mentor azonosítója</TableCell>
                                <TableCell>Mentor neve </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.props.campusParticipationList ? this.props.campusParticipationList
                                .map((campusParticipation, i) => 
                                    (campusParticipation.mentor) &&
                                    <TableRow
                                        key={campusParticipation.mentor!.mentorId!} 
                                        hover
                                        onClick={event => this.handleClick(event,
                                            campusParticipation.mentor!.mentorId!,campusParticipation)}
                                        selected={
                                            this.state.selectedRows==campusParticipation.mentor!.mentorId!
                                        }
                                        >
                                         <TableCell
                                        padding="checkbox"
                                    >
                                        <Checkbox
                                            checked={
                                                this.state.selectedRows==campusParticipation.mentor!.mentorId!
                                            }
                                        />
                                    </TableCell>
                                        <TableCell>{campusParticipation.mentor.mentorId}</TableCell>
                                        <TableCell>{campusParticipation.mentor.name}</TableCell>
                                    </TableRow>  
                                ) : ''}
                            
                        </TableBody>
                    </Table>
               </div>)}
        </div>
    }

}

export default connect(
    (state: ApplicationState) => state.campusParticipation,
    CampusParticipationStore.actionCreators
)(withStyles(styles)(CurrentParticipants)) as typeof CurrentParticipants;