import React from 'react';
import { useRouter } from 'next/router';
import { Segment, Header as HeaderSUI, Dropdown, Progress } from 'semantic-ui-react';
import { ButtonMenu } from '../shared/Button';

import './header.scss';

const Header = ({ title, actions, showMenu, loading, ...otherProps }) => {
    const { pathname } = useRouter();
    const showActions = actions && actions.length > 0;
    //indkøbsliste
    //ugeplan
    //opskrifter
    return (
        <div className="mmp-header">
            <Segment clearing>
                <ButtonMenu onClick={showMenu} />

                <HeaderSUI className="custom-header" as='h1' floated='left'>
                    {title}
                </HeaderSUI>
                {showActions &&
                    <Dropdown icon="ellipsis vertical"
                        value=""
                        className="settings-icon"
                        floating
                        size='large'>
                        <Dropdown.Menu>
                            {actions.map(
                                x => <Dropdown.Item key={x.label} text={x.label} onClick={x.onClick} />
                            )}
                        </Dropdown.Menu>
                    </Dropdown>}
            </Segment>
            {loading && <Progress percent={100} active size='tiny' color='blue' />}
        </div>)
}

export default Header;