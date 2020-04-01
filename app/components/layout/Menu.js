import { Menu as MenuSUI, Sidebar, Segment, Image, Dropdown, Icon } from 'semantic-ui-react';
import { useRouter } from 'next/router';
import './menu.scss';
import { absUrl } from '../../functions/imageFunctions';
import { ButtonClose } from '../shared/Button';
import { useSelf } from '../../hooks/useSelf';
import { useData } from '../../hooks/useData';
import { GetGroupsApi, GetUsersApi, logout } from '../../pages/api';

const fullname = (firstname, lastname) => `${firstname || ""} ${lastname || ""}`;
const getSelectedGroupName = (groups, current) => {
    const selected = groups.find(g => g._id == current);
    if (current && selected) return selected.name;
    return "Vælg gruppe";
}
const Menu = function ({ visible, onHide }) {
    const router = useRouter();
    const [self, revalidate] = useSelf();
    const { firstname, lastname, selectedGroup, _id } = self || {};
    const groups = useData('groups', GetGroupsApi().find) || [];

    const selectGroup = (id) => async () => {
        await GetUsersApi().update(_id, {
            selectedGroup: id
        });
        revalidate();
    }
    const goto = (url) => () => {
        router.push(url);
        onHide();
    }

    return (<Sidebar as={MenuSUI}
        className="mmp-sidebar"
        animation='overlay'
        onHide={onHide}
        visible={visible}
        width='wide'
        vertical>

        <div className="mmp-menu-item-profile">
            <div className="mmp-profile-image">
                <Image src={absUrl("/uploads/448301d4d2494c56b1b498eb817e4f0a.jpg")} avatar />
            </div>
            <div className="mmp-info">
                <h3>{fullname(firstname, lastname)}</h3>
                <a>View profile</a>
            </div>
            <ButtonClose onClick={onHide} />

        </div>
        <MenuSUI.Item link onClick={goto('/shopping-list')}>
            Indkøbsliste
            </MenuSUI.Item>
        <MenuSUI.Item link name="Ugeplan" onClick={goto('/plan')} />
        <MenuSUI.Item name="Opskrifter" onClick={goto('/recipes')} />
        <MenuSUI.Item>
            Profil
        </MenuSUI.Item>
        <MenuSUI.Item>
            Grupper
            <MenuSUI.Menu>
                <Dropdown item text={getSelectedGroupName(groups, selectedGroup)}>
                    <Dropdown.Menu>
                        {groups.map(group =>
                            <Dropdown.Item key={group._id} onClick={selectGroup(group._id)}>
                                {group.name}
                            </Dropdown.Item>)}
                    </Dropdown.Menu>
                </Dropdown>
                <MenuSUI.Item onClick={goto('/groups/create')} >
                    Opret gruppe
                    <Icon name="add" />
                </MenuSUI.Item>
            </MenuSUI.Menu>
        </MenuSUI.Item>
        <MenuSUI.Item name='Log ud' onClick={logout} />
    </Sidebar>);
};
export default Menu;