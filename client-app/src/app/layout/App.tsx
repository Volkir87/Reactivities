import React, { useState, useEffect, Fragment, SyntheticEvent } from 'react';
import { Container, } from 'semantic-ui-react';
import { IActivity } from '../models/activity';
import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
// import { act } from 'react-dom/test-utils';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';


const App = () => {
    const [activities, setActivities] = useState<IActivity[]>([]);
    const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true); 
    const [submitting, setSubmitting] = useState(false);
    const [target, setTarget] = useState('');

    const handleSelectActivity = (id: string) => {
        setSelectedActivity(activities.filter(v => v.id === id)[0]);
        setEditMode(false);
    }

    const handleOpenCreateForm = () => {
        setSelectedActivity(null);
        setEditMode(true);
    }

    const handleCreateActivity = (activity: IActivity) => {
        setSubmitting(true);
        agent.Activities.create(activity).then(() => {
            setActivities([...activities, activity]);
            setSelectedActivity(activity);
            setEditMode(false);
        }).then(() => setSubmitting(false));
    }

    const handleEditActivity = (activity: IActivity) => {
        setSubmitting(true);
        agent.Activities.update(activity).then(() => {
            setActivities([...activities.filter(a => a.id !== activity.id), activity]);
            setSelectedActivity(activity);
            setEditMode(false);
        }).then(() => setSubmitting(false));
    }

    const handleDeleteActivity = (event: SyntheticEvent<HTMLButtonElement>, activityId: string) => {
        setTarget(event.currentTarget.name);
        setSubmitting(true);
        agent.Activities.delete(activityId).then(() => {
            setActivities([...activities.filter(a => a.id !== activityId)]);
        }).then(() => setSubmitting(false));
    }

    useEffect(() => {
        agent.Activities.list().then((response) => {
            //console.log(response);
            let activities: IActivity[] = [];
            response.forEach(a => {
                a.date = a.date.split('.')[0];
                activities.push(a);
            })
            setActivities(activities);
        }).then(() => setLoading(false));
    }, []);

    if (loading) return <LoadingComponent content='Loading activities...'></LoadingComponent>

    return (
        <Fragment>
            <NavBar openCreateForm={handleOpenCreateForm}></NavBar>
            <Container style={{ marginTop: '7em' }}>
                <ActivityDashboard 
                    activities={activities} 
                    selectActivity={handleSelectActivity} 
                    selectedActivity={selectedActivity}
                    editMode={editMode}
                    setEditMode={setEditMode}
                    setSelectedActivity={setSelectedActivity}
                    createActivity={handleCreateActivity}
                    editActivity={handleEditActivity}
                    deleteActivity={handleDeleteActivity}
                    submitting={submitting}
                    target={target} />
            </Container>
        </Fragment>
    );
}


export default App;
