import React, { useState, useContext, useEffect } from 'react';
import { Button, Form, Grid, GridColumn, Segment } from 'semantic-ui-react';
import { ActivityFormValues,  } from '../../../app/models/activity';
import { v4 as uuid } from 'uuid';
import ActivityStore from '../../../app/stores/activityStore';
import { RouteComponentProps } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Form as FinalForm, Field } from 'react-final-form';
import TextInput from '../../../app/common/form/TextInput';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import SelectInput from '../../../app/common/form/SelectInput';
import { category } from '../../../app/common/options/categoryOptions';
import DateInput from '../../../app/common/form/DateInput';
import { combineDateTime } from '../../../app/common/util/util';
import { combineValidators, composeValidators, hasLengthGreaterThan, isRequired } from 'revalidate';



const validate = combineValidators({
    title: isRequired({message: 'Event title is required'}),
    category: isRequired('Category'),
    description: composeValidators(
        isRequired('Description'),
        hasLengthGreaterThan(4)({message: 'Description needs to be at least 5 characters'}))(),
    city: isRequired('City'),
    venue: isRequired('Venue'),
    date: isRequired('Date'),
    time: isRequired('Time'),
})

interface DetailParams {
    id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({ match, history }) => {
    const activityStore = useContext(ActivityStore);
    const { createActivity, editActivity, submitting, loadActivity} = activityStore;

    const [activity, setActivity] = useState(new ActivityFormValues());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (match.params.id) {
            setLoading(true);
            loadActivity(match.params.id)
                .then((activity) => setActivity(new ActivityFormValues(activity)))
                .finally(() => setLoading(false));
        }
    }, [loadActivity, match.params.id])

    const handleFinalFormSubmit = (values: any) => {
        const dateTime = combineDateTime(values.date, values.time);
        const { date, time, ...activity } = values;
        activity.date = dateTime;
        console.log(activity);
        if (!activity.id) {
            let newActivity = {
                ...activity,
                id: uuid()
            }
            createActivity(newActivity);
        } else {
            editActivity(activity);
        }
    }
    return (
        <Grid>
            <GridColumn width={10}>
                <Segment clearing>
                    <FinalForm
                    validate={validate}
                        initialValues={activity}
                        onSubmit={handleFinalFormSubmit}
                        render={({ handleSubmit, invalid, pristine }) => {
                            return (
                                <Form onSubmit={handleSubmit} loading={loading}>
                                    <Field component={TextInput} name='title' placeholder='Title' value={activity.title} />
                                    <Field component={TextAreaInput} name='description' rows={3} placeholder='Description' value={activity.description} />
                                    <Field component={SelectInput} options={category} name='category' placeholder='Category' value={activity.category} />
                                    <Form.Group widths='equal'>
                                        <Field component={DateInput} date={true} name='date' placeholder='Date' value={activity.date} />
                                        <Field component={DateInput} time={true} name='time' placeholder='Time' value={activity.date} />
                                    </Form.Group>
                                    <Field component={TextInput} name='city' placeholder='City' value={activity.city} />
                                    <Field component={TextInput} name='venue' placeholder='Venue' value={activity.venue} />
                                    <Button 
                                    loading={submitting} 
                                    disabled={loading || invalid || pristine} 
                                    floated='right' 
                                    positive 
                                    type='submit' 
                                    content='Submit' />
                                    <Button 
                                    onClick={activity.id ? () => history.push(`/activities/${activity.id}`) : () => history.push('/activities')} 
                                    disabled={loading} 
                                    floated='right' 
                                    type='cancel' 
                                    content='Cancel' />
                                </Form>
                            )
                        }} />

                </Segment>
            </GridColumn>
        </Grid>

    )
}

export default observer(ActivityForm);
