import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import * as CampusStore from '../store/Campus';
import { ApplicationState } from '../store';
import Chip from 'material-ui/Chip';

const styles = {
    chip: {
        margin: 4,
    },
};

// At runtime, Redux will merge together...
type CampusProps =
    CampusStore.CampusState        // ... state we've requested from the Redux store
    & typeof CampusStore.actionCreators      // ... plus action creators we've requested
    & RouteComponentProps<{}>

class CampusApply extends React.Component<CampusProps, any> {
    componentDidMount() {
        this.props.getActiveCampus();
    }

    public render() {


        return <Card>
            <CardTitle title="Aktuális EvoCampus" subtitle="Információk" />
            <CardText>
                {this.props.activeCampus ? (<div>
                    <div>Campus kezdete:
                        <Chip
                            style={styles.chip}>
                            {this.props.activeCampus.startDate.format('YYYY-MM-DD')}
                        </Chip>
                    </div>
                    <div> Campus vége:
                        <Chip
                            style={styles.chip}>
                            {this.props.activeCampus.endDate.format('YYYY-MM-DD')}
                        </Chip>
                    </div>
                </div>) : (
                        <div>Nincs jelenleg campus jelentkezési időszak!</div>)
                }
            </CardText>
            <CardActions>
                <FlatButton label="Jelentkezés" onClick={()=>this.props.applyActiveCampus()}/>
            </CardActions>
        </Card>
    }
}

export default connect(
    (state: ApplicationState) => state.campus, // Selects which state properties are merged into the component's props
    CampusStore.actionCreators                 // Selects which action creators are merged into the component's props
)(CampusApply) as typeof CampusApply;