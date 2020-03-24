import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import { GetRecipesApi } from '../api/recipeApi';
import {Instructions} from '../../components/recipe/Instructions';

const Recipe = ({ recipe }) => (
  <Layout title={recipe.title}>
    <Instructions source={recipe.instructions} />
  </Layout>
);

Recipe.getInitialProps = async function (context) {
  const { recipeId } = context.query;
  const recipe = await GetRecipesApi(context).findOne(recipeId);

  return { recipe };
};

export default Recipe;