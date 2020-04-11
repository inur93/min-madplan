import { useState } from "react";
import { GetFilesApi, GetGroupsApi, GetUsersApi } from "../_api";
import { useData } from "./useData";
import { usePageSettings } from "./usePageSettings";



export function useProfile(self) {
    const api = GetUsersApi();
    const fileApi = GetFilesApi();
    const groups = useData('groups', GetGroupsApi().find) || [];
    const settings = usePageSettings('profile');

    const [image, setImage] = useState(null);
    const [group, setGroup] = useState(null);
    const [saved, setSaved] = useState(false);

    const saveImage = async () => {
        if (image) {
            const data = new FormData();
            data.append('ref', 'user');
            data.append('refId', self._id);
            data.append('field', 'avatar');
            data.append('files', image);
            data.append('source', 'users-permissions');
            return fileApi.upload(data);
        }
    }
    const onSave = async (updates) => {
        const data = { ...updates };
        if (group) data.selectedGroup = group;
        Promise.all([
            api.update(self._id, data),
            saveImage()
        ])

        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    }

    const onImageChange = (e) => {
        const file = e.target.files[0];
        const newFile = new File([file], file.name.replace(' ', '-'), { type: file.type });
        setImage(newFile);
    }

    const changeGroup = (e, el) => {
        setGroup(el.value);
    }

    const removeImage = () => {
        setImage(null);
    }

    const state = {
        groups,
        saved,
        image: image && URL.createObjectURL(image),
        fallbackImage: (self && self.avatar) || (settings || {}).fallbackProfileImage || {}
    }
    const handlers = {
        onSave,
        changeGroup,
        onImageChange,
        removeImage
    }
    return [state, handlers];
}