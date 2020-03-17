import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { GetRecipesApi } from './api/recipeApi';
import { useState, useEffect } from 'react';
import { RecipeListItem, List } from '../components/shared/List';
import { SearchInput } from '../components/shared/Input';

const Page = () => {
    const api = GetRecipesApi();
    const router = useRouter();
    const [recipes, setRecipes] = useState([]);
    const [query, setQuery] = useState("");

    const updateRecipes = (query) => {
        api.find(query).then(({ data }) => setRecipes(data));
    }

    useEffect(() => {
        updateRecipes();
    }, []);

    const search = (query) => {
        setQuery(query);
        updateRecipes(query);
    }

    const selectRecipe = (id) => {
        router.push(`/recipes/${id}`);
    }

    return (
        <Layout title="Opskrifter">
            <List selection verticalAlign='middle'>
                {recipes.map(recipe => <RecipeListItem key={recipe._id}
                    id={recipe._id}
                    title={recipe.title}
                    onClick={selectRecipe} />)}
            </List>
            <SearchInput value={query} onChange={search} placeholder="Søg efter opskrift..." />
        </Layout>
    )
}

export default Page;