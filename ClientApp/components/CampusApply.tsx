import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import * as CampusStore from '../store/Campus';
import { ApplicationState } from '../store';
import Chip from '@material-ui/core/Chip';
import { StyledComponentProps, WithStyles, withStyles } from '@material-ui/core/styles';


const styles = theme=>({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 2,
    },
});

// At runtime, Redux will merge together...
type CampusProps =
    CampusStore.CampusState        // ... state we've requested from the Redux store
    & typeof CampusStore.actionCreators      // ... plus action creators we've requested
    & RouteComponentProps<{}>
    & WithStyles<'root'>;

class CampusApply extends React.Component<CampusProps, any> {
    

    componentDidMount() {
        this.props.getActiveCampus();
    }

    constructor(props) {
        super(props);
    }

    public render() {

        const styles = {
            chip: {
                margin: 4,
            },
        }

        const { classes } = this.props;
        return <Card className={classes!.root}>
          
            <CardHeader
                title="Aktuális EvoCampus"
                subheader="Információk"
            />
            <CardContent>
                {this.props.activeCampus ? (<div>
                    <div>Campus kezdete:
                        <Chip
                            style={styles.chip}
                            label={this.props.activeCampus.startDate.format('YYYY-MM-DD')}
                        />
                    </div>
                    <div> Campus vége:
                        <Chip
                            style={styles.chip}
                            label={this.props.activeCampus.endDate.format('YYYY-MM-DD')}
                        />
                    </div>
                </div>) : (
                        <div>Nincs jelenleg campus jelentkezési időszak!</div>)
                }
            </CardContent>
            <CardActions>
                <Button 
                   color="primary"
                   onClick={()=>this.props.applyActiveCampus()}>
                   Jelentkezés
                </Button>
            </CardActions>
        </Card>
    }
}

export default connect(
    (state: ApplicationState) => state.campus, // Selects which state properties are merged into the component's props
    CampusStore.actionCreators                 // Selects which action creators are merged into the component's props
)(withStyles(styles)(CampusApply));