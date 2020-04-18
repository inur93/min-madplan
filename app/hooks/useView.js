import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const views = {
    details: 'details',
    history: 'history',
    create: 'create',
    search: 'search'
}

function useView(pagePath, defaultView) {
    const router = useRouter();
    const [show, setShow] = useState({});
    const [edit, setEdit] = useState(false);

    useEffect(() => {
        setShow(getShow(router.query.view || defaultView || views.view));
    }, [router.query.view])

    useEffect(() => {
        setEdit((router.query.edit === "true"));
    }, [router.query.edit])

    const updateQuery = (query, merge) => {
        router.replace({
            pathname: pagePath,
            query: {
                ...(merge ? router.query : {}),
                ...query
            }
        })
    }
    const goto = {
        history: () => updateQuery({ view: views.history }),
        details: (id, mergeQueries) => updateQuery({ view: views.details, id }, mergeQueries),
        create: () => updateQuery({ view: views.create }),
        edit: () => updateQuery({
            ...router.query,
            edit: !edit
        })

    }
    return [show, edit, goto];
}

function getShow(view) {
    const showViews = Object.keys(views)
        .reduce((map, key) => {
            map[key] = false;
            return map;
        }, {});

    showViews[view] = true;
    showViews.view = view;
    return showViews;
}

useView.views = views;

export { useView, views };