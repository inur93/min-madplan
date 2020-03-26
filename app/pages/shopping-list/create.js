import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import { auth } from '../api/auth';
import { Form, FormField } from '../../components/shared/Form';
import { ButtonSave } from '../../components/shared/Button';
import {getWeek, setWeek, formatDate} from '../../stores/dateStore';
import { GetShoppingListApi } from '../api/shoppingListsApi';


const Page = () => {
    const router = useRouter();
    const handleSave = async (data) => {
        const response = await GetShoppingListApi().createShoppingList(data);
        console.log('response:', response);
        router.replace(`/shopping-list/${response.data._id}`);
    }
    const nextWeek = getWeek(new Date()) + 1;
    const defaultTitle = `Uge ${nextWeek}`;
    const defaultValidFrom = formatDate(setWeek(new Date(), nextWeek-1));
    return (
        <Layout showBackBtn={true} title='Opret indkøbsliste'>
            <Form id="create-shopping-list" onSubmit={handleSave}>
                <FormField label="Titel" name="name" defaultValue={defaultTitle} required />
                <FormField label="Gældende fra" type="date" name="validFrom" defaultValue={defaultValidFrom} required />
                <ButtonSave type="submit" />
            </Form>

        </Layout>
    )
}

Page.getInitialProps = async (ctx) => {
    const token = auth(ctx);
    // await new Promise(resolve => {
    //   setTimeout(resolve, 3000)
    // })
    return {}
}
export default Page;
