import * as React from 'react';
import AppBar from 'material-ui/AppBar';
import { NavMenu } from './NavMenu';

const style = {
    component: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
    } as React.CSSProperties,
    navmenu: {
        width: 300
    },
    content: {
        paddingLeft: 300,
        paddingTop: 64,
        height: '100%'
    }
}

export class Layout extends React.Component<{}, {}> {
    /*
     <div className='container-fluid'>
            <div className='row'>
                <div className='col-sm-3'>
                    <NavMenu />
                </div>
                <div className='col-sm-9'>
                    { this.props.children }
                </div>
            </div>
        </div>;
        */
    public render() {
        return (
            <div>
                <AppBar
                    title="EvoCampus manager"
                    style={{ zIndex: 1500, position: 'fixed', top: 0, left: 0}}
                />
                <div>
                    <NavMenu width={style.navmenu.width} paddingTop={64}/>
                </div>
                <div>
                    <div style={style.content}>
                        <div style={{ marginLeft: 76, marginRight: 76, marginTop: 30}}>
                        {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
