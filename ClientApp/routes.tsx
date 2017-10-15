import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './components/Home';
import FetchData from './components/FetchData';
import Counter from './components/Counter';
import Users from './components/Users';
import Campus from './components/Campus';
import Login from './components/Login';
import CampusApply from './components/CampusApply';
import CurrentParticipants from './components/CurrentParticipants';
import Project from './components/Projects';
import ProjectSubscribe from './components/ProjectSubscribe';

export const routes = <Layout>
    <Route exact path='/' component={ Home } />
    <Route path='/counter' component={ Counter } />
    <Route path='/fetchdata/:startDateIndex?' component={ FetchData } />
	<Route path='/users' component={ Users } />
    <Route path='/campus' component={ Campus } />
    <Route path='/login' component={ Login } />
    <Route path='/currentcampus' component={ CampusApply } />
    <Route path='/currentparticipants' component={ CurrentParticipants } />
    <Route path='/projects' component={ Project } />
    <Route path='/subscribe' component={ ProjectSubscribe } />
</Layout>;
