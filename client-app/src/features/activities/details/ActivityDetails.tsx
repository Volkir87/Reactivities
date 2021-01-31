import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom';
import { Grid, GridColumn} from 'semantic-ui-react'
import LoadingComponent from '../../../app/layout/LoadingComponent';
import ActivityStore from '../../../app/stores/activityStore';
import ActivityDetailsChat from './ActivityDetailsChat';
import ActivityDetailsHeader from './ActivityDetailsHeader';
import ActivityDetailsInfo from './ActivityDetailsInfo';
import ActivityDetailsSidebar from './ActivityDetailsSidebar';

interface DetailParams {
    id: string;
}

const ActivityDetails: React.FC<RouteComponentProps<DetailParams>> = ({match, history}) => {
    const activityStore = useContext(ActivityStore);
    const {activity, loadActivity, loadingInitial} = activityStore;

    useEffect(() => {
        console.log('calling useEffect in ActivityDetails');
        loadActivity(match.params.id);
    }, [loadActivity, match.params.id]);

    if (loadingInitial || !activity) return <LoadingComponent content='Loading activity... '/>
    return (
        <Grid>
            <GridColumn width={10}>
                <ActivityDetailsHeader activity={activity}/>
                <ActivityDetailsInfo activity={activity}/>
                <ActivityDetailsChat/>
            </GridColumn>
            <GridColumn width={6}>
                <ActivityDetailsSidebar/>
            </GridColumn>
        </Grid>
    )
}

export default observer(ActivityDetails);
