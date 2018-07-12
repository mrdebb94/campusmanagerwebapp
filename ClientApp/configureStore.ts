import { createStore, applyMiddleware, compose, combineReducers, GenericStoreEnhancer, Store, StoreEnhancerStoreCreator, ReducersMapObject } from 'redux';
import thunk from 'redux-thunk';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import * as StoreModule from './store';
import { ApplicationState, reducers } from './store';
import { History } from 'history';
import { responsiveStoreEnhancer } from 'redux-responsive';
import * as signalR from "@aspnet/signalr";
import { ActiveProject } from './store/Project';

let signalrMiddleware = store => next => action => {
    switch (action.type) {

        case 'SET_PROJECT_SUBSCRIBE_CONNECTION':
            console.log("CONNECTION MIDDLAWARE");
            let hubConnection = action.projectSubscribeConnection;
            hubConnection.on('ProjectSubscribeChange', (user, message, projectListJson) => {
                //store.dispatch({ type: 'INCREMENT_COUNT' })
                console.log("Jelentkezes tortent " + user + " " + message);
                let projectList: ActiveProject[] = JSON.parse(projectListJson) as ActiveProject[];
                console.log(projectList);
                store.dispatch({ type: 'SET_ACTIVE_PROJECT_LIST', projectList });
            });
            hubConnection.on('ProjectSubscribeMessage', (message) => {
                //store.dispatch({ type: 'INCREMENT_COUNT' })
                console.log("Jelentkezes kozben " + message);
            });
            break;
        case "SIGNALR_PROJECT_SUBSCRIBE":
            //let connection:signalR.HubConnection
            //TODO: check connection
            let { signalRConnections: { projectSubscribeConnection } } = store.getState();
            
            if (projectSubscribeConnection) {
                console.log(projectSubscribeConnection);
                console.log("Kezd " + action.projectCampusId);
                projectSubscribeConnection.invoke('SubscribeProject', action.projectCampusId);
            } else {
                console.log("FEL KELL IRATKOZNI");
            }
            break;
    }
    return next(action);
};

export default function configureStore(history: History, initialState?: ApplicationState) {
    // Build middleware. These are functions that can process the actions before they reach the store.
    const windowIfDefined = typeof window === 'undefined' ? null : window as any;
    // If devTools is installed, connect to it
    const devToolsExtension = windowIfDefined && windowIfDefined.devToolsExtension as () => GenericStoreEnhancer;
    const createStoreWithMiddleware = compose(
        responsiveStoreEnhancer,
        applyMiddleware(thunk, routerMiddleware(history), signalrMiddleware),
        devToolsExtension ? devToolsExtension() : <S>(next: StoreEnhancerStoreCreator<S>) => next
    )(createStore);

    // Combine all reducers and instantiate the app-wide store instance
    const allReducers = buildRootReducer(reducers);
    const store = createStoreWithMiddleware(allReducers, initialState) as Store<ApplicationState>;

    // Enable Webpack hot module replacement for reducers
    if (module.hot) {
        module.hot.accept('./store', () => {
            const nextRootReducer = require<typeof StoreModule>('./store');
            store.replaceReducer(buildRootReducer(nextRootReducer.reducers));
        });
    }

    return store;
}

function buildRootReducer(allReducers: ReducersMapObject) {
    return combineReducers<ApplicationState>(Object.assign({}, allReducers, { routing: routerReducer }));
}
