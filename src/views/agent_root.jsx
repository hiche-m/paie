import NavBar from '../components/navbar'
import SideMenu from '../components/side_menu'
import { Outlet } from 'react-router-dom'
import { Grid as GridSpinner } from 'react-loader-spinner'
import AdminSideMenu from '../components/admin_side_menu'

const AgentRoot = ({ context }) => {

    if (context === null) {
        return ((<div className='h-screen w-screen flex items-center justify-center bg-primaryIdle'>
            <GridSpinner
                visible={true}
                height="20"
                width="20"
                color="#FFFFFF"
                ariaLabel="grid-loading"
                radius="12.5"
                wrapperStyle={{}}
                wrapperClass="grid-wrapper"
            />
        </div>));
    }

    return (
        <div className='flex'>
            {context["poste"] === 1 ? <AdminSideMenu className="flex flex-col w-1/6 bg-gradient-to-b from-primaryIdle to-primaryDarker " /> : <SideMenu className="flex flex-col w-1/6 bg-gradient-to-b from-primaryIdle to-primaryDarker " />}
            <div className='flex flex-col w-5/6 justify-start overflow-y-auto'>
                <NavBar username={context?.username} />
                <Outlet context={context} />
            </div>
        </div>
    );
}

export default AgentRoot;