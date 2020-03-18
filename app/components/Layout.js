import Header from './Header';
import Head from 'next/head';
import Loading from './Loading';
import { Button } from 'semantic-ui-react';

const layoutStyle = {
    // margin: 20,
    // padding: 20,
    // border: '1px solid #DDD'
};

export const withStyles = Page => {
    return () => (
        <div style={layoutStyle}>
            <Head>
                <title>Min madplan</title>
                <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" />
            </Head>
            <Page />
        </div>
    )
}
const Layout = ({ children, showBackBtn, title, simple, actions }) =>

    (<div style={layoutStyle}>
        <Head>
            <title>Min madplan</title>
            <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" />
        </Head>
        <Loading />
        {!simple && <Header showBackBtn={showBackBtn} title={title} />}
        <div className="content">
            {children}
        </div>
        <div className="actions-button-group">

            <Button.Group className="actions-group">
                {(actions || []).map(action =>
                    <Button key={action.name}
                        className="action-button"
                        primary>
                        {action.name}
                    </Button>
                )}
            </Button.Group>
        </div>
        <style jsx>{`
            .content {
                margin-left: 0.5rem;
                margin-right: 0.5rem;
                margin: 0.5rem;
            }
            .actions-button-group {
                display: flex;
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
            }
            :global(.action-button){
                flex: 1 1 0;
            }
            :global(.actions-group){
                width: 100%;
                display: flex;
                align-items: stretch;
            }
        `}</style>
    </div>);

// export const withLayout = (Page, showBackBtn) => {
//     return withStyles(() => (
//         <div>
//             <Header showBackBtn={showBackBtn} />
//             <Page />
//         </div>
//     ));
// }

export default Layout;