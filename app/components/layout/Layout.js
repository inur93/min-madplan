import { useState } from 'react';
import { Segment, Sidebar } from 'semantic-ui-react';
import Loading from '../shared/Loading';
import Header from './Header';
import "./layout.scss";
import Menu from './Menu';

export default function Layout({ children, showBackBtn, title, simple, loading, actions }) {
    const [showMenu, setShowMenu] = useState(false);
    return (<div className='app-window'>
        <Loading />
        <Sidebar.Pushable as={Segment}>
            {!simple && <Header loading={loading} className="mmp-header" showMenu={() => setShowMenu(true)} showBackBtn={showBackBtn} title={title} />}

            <Menu visible={showMenu} onHide={() => setShowMenu(false)} />
            <Sidebar.Pusher dimmed={showMenu}>
                <Segment basic>
                    <div className="mmp-content">
                        {children}
                    </div>
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


