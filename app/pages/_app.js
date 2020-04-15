import 'semantic-ui-css/semantic.min.css';
import '../styles/shared-styles.scss';
import { auth } from '../_api';

function App({ Component, pageProps }) {
    return <Component {...pageProps} />
}

// App.getInitialProps = async (ctx) => {
//     let token;
//     if (ctx.pathname !== '/login') {
//         token = auth(ctx);
//     }
//     console.log('token', { token });
//     return { token }
// }

export default App;