import { Header } from 'semantic-ui-react';
import Link from 'next/link';
import { absUrl } from '../../functions/imageFunctions';
import './menu-item.scss';


export default function MenuItem({ image, title, link }) {
    const {url} = image || {};

    return <div className="menu-item" style={{backgroundImage: `url('${absUrl(url)}')`}}>
        <Header as='h2' className="menu-item-header">
            {title}
        </Header>
        <Link href={link}>
            <a className="menu-item-link"></a>
        </Link>
    </div>
}