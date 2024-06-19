import AddingForm from "../components/add_form";
import Settings from "./settings";
import FichePDF from "../components/preview_fiche";
import useFetchEForm from "../services/useFetchEForm";
import { Grid as GridSpinner } from 'react-loader-spinner'
import { useEffect, useState } from "react";
import Functions from "../utils/functions";

const AgentForm = () => {
    const [data, isLoading, error] = useFetchEForm();
    const [matricule, setMatricule] = useState("");
    const [nom, setNom] = useState("");
    const [ss, setSS] = useState("");
    const [prenom, setPrenom] = useState("");
    const [sexe, setSexe] = useState("");
    const [grade, setGrade] = useState("");
    const [echelon, setEchelon] = useState("");
    const [rendement, setRendement] = useState("");
    const [mutuel, setMutuel] = useState("");
    const [situation, setSituation] = useState("");
    const [enfants, setEnfants] = useState("0");
    const [dixEnfants, setDixEnfants] = useState("0");
    const [poste, setPoste] = useState("");
    const [femme, setFemme] = useState("");

    const [dateChange, setDateChange] = useState(new Date());
    const [recChange, setRecChange] = useState(new Date());
    const [categorie, setCategorie] = useState("");
    const [agence, setAgence] = useState("");
    const [compte, setCompte] = useState("");

    const [isFetching, setFetching] = useState(false);

    if (error !== null) {
        return (
            <div className="flex flex-row grow justify-center items-center text-lg text-red-500 italic">Un erreur s'est produit, veuillez réessayez ultérieurement.</div>
        );
    }

    if (isLoading) {
        return (<div className='flex grow items-center justify-center'>
            <GridSpinner
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

    return (
        <>
            <div className='text-2xl font-bold pt-12 pb-12 pr-14 pl-14'>Ajouter un nouveau enseignant</div>
            <div className='pr-14 pl-14 max-w-full'>
                <AddingForm data={data} isLoading={isLoading} error={error}
                    matricule={matricule} setMatricule={setMatricule}
                    nom={nom} setNom={setNom}
                    ss={ss} setSS={setSS}
                    prenom={prenom} setPrenom={setPrenom}
                    sexe={sexe} setSexe={setSexe}
                    grade={grade} setGrade={setGrade}
                    echelon={echelon} setEchelon={setEchelon}
                    rendement={rendement} setRendement={setRendement}
                    mutuel={mutuel} setMutuel={setMutuel}
                    situation={situation} setSituation={setSituation}
                    enfants={enfants} setEnfants={setEnfants}
                    dixEnfants={dixEnfants} setDixEnfants={setDixEnfants}
                    poste={poste} setPoste={setPoste}
                    femme={femme} setFemme={setFemme}
                    isFetching={isFetching} setFetching={setFetching}
                    dateChange={dateChange} setDateChange={setDateChange}
                    recChange={recChange} setRecChange={setRecChange}
                    categorie={categorie} setCategorie={setCategorie}
                    agence={agence} setAgence={setAgence}
                    compte={compte} setCompte={setCompte}
                />
            </div>
            <div className='text-2xl font-bold pt-12 pb-12 pr-14 pl-14'>Aperçu de la fiche de paie</div>
            <FichePDF infoPersonel={{ infoPersonel: { matricule, nom, prenom, dateChange, grade, recChange, categorie, echelon, agence, compte } }} />
        </>
    );
}

export default AgentForm;