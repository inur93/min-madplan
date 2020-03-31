import { Header } from 'semantic-ui-react';
import Link from 'next/link';
import { absUrl } from '../../functions/imageFunctions';


export default function MenuItem({ image, title, link }) {
    const {url} = image || {};

    return <div className="menu-item" style={{backgroundImage: `url('${absUrl(url)}')`}}>
        <Header className="menu-item-header" as="a">
            {title}
        </Header>
        <Link href={link}>
            <a className="menu-item-link"></a>
        </Link>
        <style jsx>{`
        .menu-item{
            flex-grow: 1;
            position: relative;
            border: 2px solid white;
            background-size: cover;
        }
        :global(.menu-item-header){
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 50px;
            margin: 0;
            color: white;
        }
        .menu-item-link{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
        `}</style>
    </div>
}