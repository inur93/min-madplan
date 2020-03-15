import Header from './Header';
import Head from 'next/head';
import Loading from './Loading';

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
const Layout = ({ children, showBackBtn, title, simple }) =>

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
        <style jsx>{`
            .content {
                margin-left: 0.5rem;
                margin-right: 0.5rem;
                margin: 0.5rem;
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