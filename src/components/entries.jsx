import { useOutletContext } from "react-router-dom";
import AgentForm from "../views/AgentForm";
import Settings from "../views/settings";

const Entries = () => {
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
        return <Settings />
    }

    return (<AgentForm />);
}

export default Entries;