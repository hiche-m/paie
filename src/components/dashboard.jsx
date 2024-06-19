import { useOutletContext } from "react-router-dom";
import AdminDash from "../views/admin_dashboard";
import AgentDashboard from "../views/AgentDashboard";
import { Grid as GridSpinner } from 'react-loader-spinner'

const Dashboard = () => {
    const context = useOutletContext();

    if (context === null) {
        return ((<div className='flex items-center justify-center'>
            <GridSpinner
                visible={true}
                height="20"
                width="20"
                color="#2B52EA"
                ariaLabel="grid-loading"
                radius="12.5"
                wrapperStyle={{}}
                wrapperClass="grid-wrapper"
            /></div>));
    }

    if (context["poste"] === 1) {
        return <AdminDash />
    }

    return (<AgentDashboard />);
}

export default Dashboard;