import { useState } from 'react';
import { Segment, Sidebar } from 'semantic-ui-react';
import Loading from '../shared/Loading';
import Header from './Header';
import "./layout.scss";
import Menu from './Menu';
import { useLayout } from '../../hooks/shared/useLayout';

export default function Layout({ children, title, loading, actions }) {
    const [state, handlers] = useLayout();
    return (<div className='app-window'>
        <Loading />
        <Sidebar.Pushable as={Segment}>
            <Header loading={loading}
                showMenu={handlers.showMenu}
                title={title}
                actions={actions} />
            <Menu visible={state.showMenu} onHide={handlers.hideMenu} />
            <Sidebar.Pusher dimmed={state.showMenu}>
                <Segment basic>
                    <div className="mmp-content">
                        {children}
                    </div>
                    <p style={{display: 'none'}}>{process.env.BASE_URL}</p>
                </Segment>
            </Sidebar.Pusher>
        </Sidebar.Pushable>
    </div>);
}

export function Content({ children }) {
    return <div className="mmp-main-area">{children}</div>
}

export function Actions({ children, fullWidth = true }) {
    return (<div className={`mmp-actions-bottom ${fullWidth && "full-width"}`}>
        {children}
    </div>);
}


