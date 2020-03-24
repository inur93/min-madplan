import Header from './Header';
import Head from 'next/head';
import Loading from '../shared/Loading';
import { Button, Sidebar, Segment } from 'semantic-ui-react';
import "./layout.scss";
import { useState } from 'react';
import Menu from './Menu';

export default function Layout({ children, showBackBtn, title, simple, actions }) {
    const [showMenu, setShowMenu] = useState(false);
    return (<div>
        <Head>
            <title>Min madplan</title>
            <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" />
        </Head>
        <Loading />
        <Sidebar.Pushable as={Segment}>
        {!simple && <Header className="mmp-header" showMenu={() => setShowMenu(true)} showBackBtn={showBackBtn} title={title} />}
        
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


