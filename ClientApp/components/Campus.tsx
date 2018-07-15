import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as CampusStore from '../store/Campus';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Checkbox from '@material-ui/core/Checkbox';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { StyledComponentProps, WithStyles, withStyles } from '@material-ui/core/styles';
import CampusDialog from './CampusDialog';

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
    },
    tableWrapper: {
        overflowX: 'auto',
    } as React.CSSProperties
});

// At runtime, Redux will merge together...
type CampusProps =
    CampusStore.CampusState        // ... state we've requested from the Redux store
    & typeof CampusStore.actionCreators      // ... plus action creators we've requested
    & RouteComponentProps<{}>
    & WithStyles<'root' | 'tableWrapper'>;

interface CampusTabState {
    //slideIndex: number;
    selected: string | null;

}

class Campus extends React.Component<CampusProps, CampusTabState> {

    state = {
        selected:null
    };
    constructor(props) {
        super(props);
        /*this.setState({
            selected:null
        });*/
    }

    componentDidMount() {
        this.props.setCampusList();
    }

    //isSelected = id => this.state.selected == id;

    handleClick = (event, campus) => {
        if(this.state.selected==campus.campusId) {
            this.setState({ selected: null });
            this.props.modifyEditedCampus({});

        } else {
            this.setState({ selected: campus.campusId });
            this.props.modifyEditedCampus({ ...campus });
        }
    }

    public render() {
        const { classes } = this.props;
        return <div>

            <CampusDialog />
            <Paper className={classes!.root}>
                <Toolbar>
                    <Button color="primary" onClick={() => {
                        this.props.toggleCampusDialog(true, "edit");
                    }} >
                        Módosítás
                            </Button>
                    <Button color="primary" onClick={() => {
                        this.props.modifyEditedCampus({});
                        this.props.toggleCampusDialog(true, "create");
                    }}>
                        Új campus
                            </Button>

                </Toolbar>
                <div className={classes!.tableWrapper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox disabled />
                                </TableCell>
                                <TableCell>Campus kezdete</TableCell>
                                <TableCell>Campus vége</TableCell>
                                <TableCell>Aktív</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.props.campusList.map((campus, i) => {
                                const isSelected = this.state.selected == campus.campusId;
                                return (<TableRow
                                    hover
                                    key={campus.campusId}
                                    selected={isSelected}
                                    onClick={event => this.handleClick(event, campus)}
                                    role="checkbox"
                                >
                                    <TableCell
                                        padding="checkbox"
                                    >
                                        <Checkbox
                                            checked={isSelected}
                                        />
                                    </TableCell>
                                    <TableCell>{campus.startDate.format('YYYY-MM-DD')}</TableCell>
                                    <TableCell>{campus.endDate.format('YYYY-MM-DD')}</TableCell>
                                    <TableCell>
                                        <Checkbox
                                            checked={campus.active}
                                            disabled={true}
                                        />
                                    </TableCell>
                                </TableRow>)
                            }
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Paper>
        </div>
    }
}

// Wire up the React component to the Redux store
export default connect(
    (state: ApplicationState) => state.campus, // Selects which state properties are merged into the component's props
    CampusStore.actionCreators                 // Selects which action creators are merged into the component's props
)(withStyles(styles)(Campus));