import 'typeface-roboto';
import * as React from 'react';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { replace } from 'react-router-redux';
import { createMemoryHistory } from 'history';
import { createServerRenderer, RenderResult } from 'aspnet-prerendering';
import { routes } from './routes';
import configureStore from './configureStore';
import { INIT_SESSION } from './store/Session';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

const XSRF_TOKEN_KEY = "xsrfToken";
const XSRF_TOKEN_NAME_KEY = "xsrfTokenName";


const theme = createMuiTheme();


export default createServerRenderer(params => {
    return new Promise<RenderResult>((resolve, reject) => {
        // Prepare Redux store with in-memory history, and dispatch a navigation event
        // corresponding to the incoming URL
        const basename = params.baseUrl.substring(0, params.baseUrl.length - 1); // Remove trailing slash
        const urlAfterBasename = params.url.substring(basename.length);
        const store = configureStore(createMemoryHistory());
        store.dispatch(replace(urlAfterBasename));
		
		//itt nem kéne beállítani az xsrf tokent?
        store.dispatch({
            type: INIT_SESSION, payload: {
                authenticated: params.data.authenticated,
                xsrfToken: '',
                id: params.data.sessionId,
                roles: params.data.roles
            }
        });

        // Prepare an instance of the application and perform an inital render that will
        // cause any async tasks (e.g., data access) to begin
        const routerContext: any = {};
        const app = (
           <MuiThemeProvider theme={theme}>
            <Provider store={ store }>
                <StaticRouter basename={ basename } context={ routerContext } location={ params.location.path } children={ routes } />
            </Provider>
           </MuiThemeProvider>
        );
        renderToString(app);

        // If there's a redirection, just send this information back to the host application
        if (routerContext.url) {
            resolve({ redirectUrl: routerContext.url });
            return;
        }
        
        // Once any async tasks are done, we can perform the final render
        // We also send the redux store state, so the client can continue execution where the server left off
        params.domainTasks.then(() => {
            resolve({
                html: renderToString(app),
                globals: { initialReduxState: store.getState() }
            });
        }, reject); // Also propagate any errors back into the host application
    });
});
