import { database } from '../services/firebase'
import { useOutletContext } from 'react-router-dom'
import { Grid as GridSpinner } from 'react-loader-spinner'
import useFetchUsers from '../services/useFetchUsers';
import { createContext } from 'react';
import GridUsers from '../components/grid_users';

const AdminDash = () => {
    const { data, isLoading, error } = useFetchUsers(database);
    const context = useOutletContext();

    if (isLoading) {
        return (<div className='flex grow justify-center items-center'><GridSpinner
            visible={true}
            height="20"
            width="20"
            color="#2B52EA"
            ariaLabel="grid-loading"
            radius="12.5"
            wrapperStyle={{}}
            wrapperClass="grid-wrapper"
        /></div>);
    }

    if (error !== null) {
        return (
            <div className='flex grow justify-center items-center text-red-500'>Un erreur s'est produit, {error.toString()}</div>
        );
    }

    return (
        <>
            <div className='text-2xl font-bold pt-12 pb-12 pr-14 pl-14'>Gestion des utilisateurs</div>
            {context === null ? (<div className='flex grow items-center justify-center'>
                <GridSpinner
                    visible={true}
                    height="20"
                    width="20"
                    color="#2B52EA"
                    ariaLabel="grid-loading"
                    radius="12.5"
                    wrapperStyle={{}}
                    wrapperClass="grid-wrapper"
                /></div>)
                : (<></>)}
            {<databaseContext.Provider value={database}>
                <div className='pr-14 pl-14 max-w-full'>
                    <GridUsers data={data} isLoading={isLoading} error={error} headers={["username", "nom", "prenom", "poste", "email"]} actionRoute="/entries" actionText="Nouveau compte" showPrint={false} />
                </div>
            </databaseContext.Provider>}
        </>
    );
}
export const databaseContext = createContext()

export default AdminDash;