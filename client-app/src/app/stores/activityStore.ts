import { observable, action, makeObservable, computed, configure, runInAction } from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import { IActivity } from '../models/activity';
import agent from '../api/agent';

configure({enforceActions: 'always'});

class ActivityStore {
    @observable activityRegistry = new Map();
    @observable activity: IActivity | null = null;
    @observable loadingInitial = false;
    @observable submitting = false;
    @observable target = '';

    constructor(){
        makeObservable(this);
    }

    @computed get activitiesByDate() {
        return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()));
    }

    groupActivitiesByDate = (activities: IActivity[]) => {
        const sortedActivities = activities.sort((a,b) => Date.parse(a.date) - Date.parse(b.date));
        const reducedActivities = sortedActivities.reduce((accumulator, activity: IActivity) => {
            const date = activity.date.split('T')[0];
            accumulator[date] = accumulator[date] ? [...accumulator[date], activity] : [activity];
            return accumulator;
        }, {} as {[key: string]: IActivity[]});
        return Object.entries(reducedActivities);
    }

    @action loadActivities = async () => {
        this.loadingInitial = true; 
        try {
            const activities = await agent.Activities.list();
            runInAction(() => {
                activities.forEach(a => {
                    a.date = a.date.split('.')[0];
                    this.activityRegistry.set(a.id, a);
                });
            });
            //console.log(this.groupActivitiesByDate(activities));
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.loadingInitial = false;
            })
        }
    };

    @action clearActivity = () => {
        this.activity = null;
    }

    getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }

    @action loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity) {
            this.activity = activity
        } else {
            this.loadingInitial = true;
            try {
                activity = await agent.Activities.details(id);
                runInAction(() => {
                    this.activity = activity;
                    this.loadingInitial = false;
                });
            } catch(error) {
                runInAction(() => {
                    this.loadingInitial = false;
                });
                console.log(error);
            }
        }
    }


    @action createActivity = async (activity: IActivity) => {
        this.submitting = true; 
        try {
            await agent.Activities.create(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.submitting = false;
            });
        }
    }

    @action editActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.update(activity); 
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.activity = activity;
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.submitting = false; 
            })
        }
    }

    @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        this.submitting = true;
        this.target = event.currentTarget.name;
        try {
            await agent.Activities.delete(id);
            this.activityRegistry.delete(id);
        } catch (error) {
            console.log(error);
        } finally {
            this.target = '';
            this.submitting = false; 
        }


    }
}

export default createContext(new ActivityStore());