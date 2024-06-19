import CycleForm from '../components/cycle_form';
import arrow from '../assets/Icons/down_arrow.svg';
import white_arrow from '../assets/Icons/down_arrow_white.svg';
import search from '../assets/Icons/search.svg';
import { useEffect, useState } from 'react';
import useFetchEForm from '../services/useFetchEForm';
import CustomInput from '../components/custom_input';
import useFetchCycle from '../services/useFetchCycle';
import useFetch from '../services/usefetch';
import { database, editCycle, getCategories, getDataByDate, getParams } from '../services/firebase';
import { Grid as GridSpinner, ThreeDots } from 'react-loader-spinner'
import { get, ref } from 'firebase/database';

const AddCycle = () => {

    const { data: ens_data, isLoading: ens_loading, error: ens_error } = useFetch(database);

    const [inputs, setInputs] = useState({
        nom: "",
        prenom: "",
        sexe: "",
        situation: "",
        femme: "",
        enfants: "",
        dixEnfants: "",
        matricule: "",
        ss: "",
        mutuel: "",
        agence: "",
        compte: "",
        poste: "",
        echelon: "",
        rendement: "",
        grade: "",
        dateChange: "",
        recChange: "",
        categorie: "",
        year: (new Date()).getFullYear(),
        month: (new Date()).getMonth() + 1,
        absence: "",
    });

    const [params, setParams] = useState(null);

    const [gradeEq, setGradeEq] = useState(null);
    const [catValues, setCatValues] = useState(null);
    const [cycles, setCycles] = useState(null);
    const [isFetchingData, setIsFetchingData] = useState(true);
    const [exists, setExists] = useState(true);
    const [empty, setEmpty] = useState(false);

    const [index, setIndex] = useState(0);
    const [existIndex, setExistIndex] = useState(0);
    const [cycleList, setCycleList] = useState([]);

    const [matriculeInput, setMatriculeInput] = useState('');
    const [suggestions, setSuggestions] = useState([]);


    const handleMatriculeInputChange = (e) => {
        const value = e.target.value;
        setMatriculeInput(value);

        const filteredSuggestions = cycleList.filter(item =>
            item.Matricule.includes(value)
        );
        setSuggestions(filteredSuggestions);
    };

    const clearSearch = () => {
        setMatriculeInput("");
        setSuggestions([]);
    };

    const handleMatriculeSelection = (matricule) => {
        setMatriculeInput(matricule);
        const selectedIndex = cycleList.findIndex(item => item.Matricule === matricule);
        setIndex(selectedIndex);
        clearSearch();
    };


    useEffect(() => {
        if (!ens_loading) {
            resetInputs();
        }
    }, [ens_loading]);

    const fetchData = async () => {
        const paramsData = await getParams(database);
        setParams(paramsData);
        setGradeEq(paramsData.grade_eq);

        const cats = await loadCats();

        const cycles = (await get(ref(database, `Cycle`))).val();
        setCycles(cycles);

        let current_cycle_mat;
        try {
            current_cycle_mat = Object.values(cycles[inputs.year][inputs.month]);
        } catch (error) {
            current_cycle_mat = [];
        }
        const ens_list_mat = Object.values(ens_data);

        const idsSet = new Set(current_cycle_mat.map(obj => obj.Matricule));
        const uniqueObjects = ens_list_mat.filter(obj => !idsSet.has(obj.Matricule));

        const mixedArray = [...uniqueObjects, ...current_cycle_mat];

        setExistIndex(uniqueObjects.length);
        setCycleList(mixedArray);

        if (index >= uniqueObjects.length) {
            setExists(true);
        } else {
            setExists(false);
        }

        return [paramsData, cycles, cats];
    };

    const resetInputs = async () => {
        if (index === null || index === undefined || existIndex === null || existIndex === undefined) {
            clearInputs();
            return;
        }

        if (index >= existIndex) {
            setExists(true);
        } else {
            setExists(false);
        }

        setIsFetchingData(true);

        const [paramsData, cycles, cats] = await fetchData();

        if (paramsData === undefined) {
            clearInputs();
        }
        setIsFetchingData(false);
    };

    useEffect(() => {
        if (cycleList !== null && cycleList !== undefined && cycleList.length > 0) {
            if (index >= existIndex) {
                setDataCycle(cycleList[index], params, catValues);
            } else {
                setDataEns(cycleList[index], params);
            }
        }
    }, [cycleList]);

    const loadCats = async () => {
        setIsFetchingData(true);
        try {
            const response = await getCategories(database);
            setCatValues(response);
            return response;
        } catch (error) {
            window.alert(error.message);
        }
        setIsFetchingData(false);
    };


    const changeInputs = (key, value) => {
        setInputs(prevState => ({
            ...prevState,
            [key]: value,
        }));
    };

    const handleAddOnClick = async (e) => {
        e.preventDefault();
        for (const [key, input] of Object.entries(inputs)) {
            if (input === null || input === undefined || input === "") {
                window.alert("Veuillez remplissez tous les champs.");
                return;
            }
        }

        const data = {
            "Absence(h)": inputs.absence,
            "Année": inputs.year,
            "Catégorie": catValues.indexOf(inputs.categorie),
            "Conjointe": params.conjointe.indexOf(inputs.femme),
            "Date de naissance": inputs.dateChange,
            "Date de recrutement": inputs.recChange,
            "Echélon": inputs.echelon,
            "Enfants (+10)": inputs.dixEnfants,
            "Grade": params.grades.indexOf(inputs.grade),
            "Matricule": inputs.matricule,
            "Mois": inputs.month,
            "Mutuelle Sociale": params.mutuelle.indexOf(inputs.mutuel),
            "Nom": inputs.nom,
            "Nombre d'enfants": inputs.enfants,
            "Numéro SS": inputs.ss,
            "N° Compte": inputs.compte,
            "Poste supérieur": inputs.poste,
            "Prénom": inputs.prenom,
            "Rendement": params.rendements.indexOf(inputs.rendement),
            "Sexe": params.sexe.indexOf(inputs.sexe),
            "Situation familiale": params.situaions.indexOf(inputs.situation),
            "Société": inputs.agence,
            "modifiedAt": new Date()
        };
        const response = await editCycle(database, inputs.year, inputs.month, inputs.matricule, data);
        if (response !== null) {
            window.alert("Erreur: ", response);
        } else {
            window.alert("Cycle ajouté!");
            resetInputs();
        }
    };

    const handleGradeChange = (event) => {
        console.log(event.target.value);
        changeInputs("grade", event.target.value);
        changeInputs("categorie", catValues[params.grade_eq[params.grades.indexOf(event.target.value)] - 1]);
    };

    const setDataCycle = (cycle, params, categories) => {
        changeInputs("absence", cycle["Absence(h)"]);
        changeInputs("grade", params["grades"][cycle["Grade"]]);
        changeInputs("femme", params["conjointe"][cycle["Conjointe"]]);
        changeInputs("sexe", params["sexe"][cycle["Sexe"]]);
        changeInputs("echelon", params["echelons"][cycle["Echélon"]]);
        changeInputs("rendement", params["rendements"][cycle["Rendement"]]);
        changeInputs("mutuel", params["mutuelle"][cycle["Mutuelle S]ociale"]]);
        changeInputs("situation", params["situaions"][cycle["Situation f]amiliale"]]);
        changeInputs("poste", cycle["Poste supérieur"]);
        changeInputs("enfants", cycle["Nombre d'enfants"]);
        changeInputs("dixEnfants", cycle["Enfants (+10)"]);
        changeInputs("nom", cycle["Nom"]);
        changeInputs("prenom", cycle["Prénom"]);
        changeInputs("matricule", cycle["Matricule"]);
        changeInputs("agence", cycle["Société"]);
        changeInputs("compte", cycle["N° Compte"]);
        changeInputs("dateChange", new Date(cycle["Date de naissance"]));
        changeInputs("recChange", new Date(cycle["Date de recrutement"]));
        changeInputs("ss", cycle["Numéro SS"]);
        changeInputs("categorie", categories[cycle["Catégorie"]]);
    };

    const setDataEns = (ens, params) => {
        changeInputs("absence", "");
        changeInputs("grade", params["grades"][Object.keys(ens["Grade"])[0]]);
        changeInputs("femme", params["conjointe"][Object.keys(ens["Conjointe"])[0]]);
        changeInputs("sexe", params["sexe"][Object.keys(ens["Sexe"])[0]]);
        changeInputs("echelon", params["echelons"][Object.keys(ens["Echélon"])[0]]);
        changeInputs("rendement", params["rendements"][Object.keys(ens["Rendement"])[0]]);
        changeInputs("mutuel", params["mutuelle"][Object.keys(ens["Mutuelle Sociale"])[0]]);
        changeInputs("situation", params["situaions"][Object.keys(ens["Situation familiale"])[0]]);
        changeInputs("poste", ens["Poste supérieur"].selected);
        changeInputs("enfants", ens["Nombre d'enfants"]);
        changeInputs("dixEnfants", ens["Enfants (+10)"]);
        changeInputs("nom", ens["Nom"]);
        changeInputs("prenom", ens["Prénom"]);
        changeInputs("matricule", ens["Matricule"]);
        changeInputs("agence", ens["Établissement de paiement"]);
        changeInputs("compte", ens["N° Compte"]);
        changeInputs("dateChange", new Date(ens["Date de naissance"]));
        changeInputs("recChange", new Date(ens["Date de recrutement"]));
        changeInputs("ss", ens["Numéro SS"]);
        changeInputs("categorie", Object.keys(ens["Catégorie"])[0]);
    };

    const clearInputs = () => {
        changeInputs("absence", "");
        changeInputs("grade", "");
        changeInputs("femme", "");
        changeInputs("sexe", "");
        changeInputs("echelon", "");
        changeInputs("rendement", "");
        changeInputs("mutuel", "");
        changeInputs("situation", "");
        changeInputs("poste", "");
        changeInputs("enfants", "");
        changeInputs("dixEnfants", "");
        changeInputs("nom", "");
        changeInputs("prenom", "");
        changeInputs("matricule", "");
        changeInputs("agence", "");
        changeInputs("compte", "");
        changeInputs("dateChange", "");
        changeInputs("recChange", "");
        changeInputs("ss", "");
        changeInputs("categorie", "");
    };

    useEffect(() => {
        resetInputs();
    }, [index, inputs.year, inputs.month]);

    const matriculeSuivant = () => {
        if (index === cycleList.length - 1) {
            setIndex(0);
        } else {
            setIndex(prevIndex => prevIndex + 1);
        }
    };

    const matriculePrecedent = () => {
        if (index === 0) {
            setIndex(cycleList.length - 1);
        } else {
            setIndex(prevIndex => prevIndex - 1);
        }
    };

    const anneeSuivante = () => {
        setIsFetchingData(true);
        const current_year = inputs.year;
        if (inputs.year < (new Date()).getFullYear()) {
            if (inputs.year === (new Date()).getFullYear() - 1 && inputs.month > (new Date()).getMonth() + 1) {
                changeInputs("month", (new Date()).getMonth() + 1);
            }

            setIndex(0);
            changeInputs("year", current_year + 1);
        }
    };
    const anneePrecedent = () => {
        setIsFetchingData(true);
        const current_year = inputs.year;
        if (inputs.year > 2000) {
            setIndex(0);
            changeInputs("year", current_year - 1);
        }
    };

    const moisSuivant = () => {
        setIsFetchingData(true);
        const current_month = inputs.month;
        if (!(inputs.month === (new Date()).getMonth() + 1 && inputs.year === (new Date()).getFullYear()) && inputs.month < 12) {
            setIndex(0);
            changeInputs("month", current_month + 1);
        }
    };
    const moisPrecedent = () => {
        setIsFetchingData(true);
        const current_month = inputs.month;
        if (inputs.month > 0) {
            setIndex(0);
            changeInputs("month", current_month - 1);
        }
    };

    if (ens_error !== null) {
        return (
            <div className='flex grow justify-center items-center text-red-500'>Un problème technique s'est produit, veuillez réessayer plus tard.</div>
        );
    }

    if (isFetchingData || ens_loading) {
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
        <div className="flex flex-col m-5 space-y-2">
            <div className='flex flex-row space-x-2'>
                <div className='flex flex-col grow'>
                    <div className='border-b flex grow' />
                    <div className='border-t flex grow' />
                </div>
                {/* Switch Année */}
                <div className='flex flex-row space-x-5 items-center p-2 bg-secoundaryIdle text-white rounded-md'>
                    {inputs.year > 2000 ? (<img src={white_arrow} className='h-6 w-6 rotate-90 hover:bg-secoundaryLighter cursor-pointer' onClick={() => anneePrecedent()} />) : (<div className='h-6 w-6'></div>)}
                    <span className='text-lg pl-10 pr-10'>{inputs.year}</span>
                    {inputs.year < (new Date()).getFullYear() ? (<img src={white_arrow} className='h-6 w-6 rotate-[-90deg] hover:bg-secoundaryLighter cursor-pointer' onClick={() => anneeSuivante()} />) : (<div className='h-6 w-6'></div>)}
                </div>
                <div className='flex flex-row'>
                    <div className='flex flex-col grow'>
                        <div className='border-b flex grow' />
                        <div className='border-t flex grow' />
                    </div>
                    {/* Switch Mois */}
                    <div className='flex flex-row space-x-5 items-center p-2 bg-secoundaryIdle text-white rounded-md'>
                        {inputs.month > 0 ? (<img src={white_arrow} className='h-6 w-6 rotate-90 hover:bg-secoundaryLighter cursor-pointer' onClick={() => moisPrecedent()} />) : (<div className='h-6 w-6'></div>)}
                        <span className='text-lg pl-14 pr-14'>{params.mois[inputs.month]}</span>
                        {!(inputs.month === (new Date()).getMonth() + 1 && inputs.year === (new Date()).getFullYear()) && inputs.month < 12 ? (<img src={white_arrow} className='h-6 w-6 rotate-[-90deg] hover:bg-secoundaryLighter cursor-pointer' onClick={() => moisSuivant()} />) : (<div className='h-6 w-6'></div>)}
                    </div>
                    <div className='flex flex-col grow'>
                        <div className='border-b flex grow' />
                        <div className='border-t flex grow' />
                    </div>
                </div>
                <div className='flex flex-col grow'>
                    <div className='border-b flex grow' />
                    <div className='border-t flex grow' />
                </div>
            </div>
            <div className='flex flex-row space-x-2'>
                <div className='flex flex-col grow'>
                    <div className='border-b flex grow' />
                    <div className='border-t flex grow' />
                </div>
                {/* Switch Matricule */}
                <div className='flex flex-row space-x-5 items-center p-2 bg-white border rounded-md'>
                    <img src={arrow} className='h-6 w-6 rotate-90 hover:bg-gray-50 cursor-pointer' onClick={() => matriculePrecedent()} />
                    <span className='text-lg pl-14 pr-14'>{inputs.matricule}</span>
                    <img src={arrow} className='h-6 w-6 rotate-[-90deg] hover:bg-gray-50 cursor-pointer' onClick={() => matriculeSuivant()} />
                </div>
                {/* Search Matricule */}
                {/* <div className='flex flex-row space-x-5 items-center p-2 bg-white border rounded-md'>
                    <input className='text-lg pl-20 pr-14 outline-none text-center' placeholder='Matricule' />
                    <img src={search} className='h-6 w-6 pr-1 hover:bg-gray-50 cursor-pointer' />
                </div> */}
                {/* Search Matricule */}
                <div className='relative flex flex-row space-x-5 items-center p-2 bg-white border rounded-md'>
                    <input
                        className='text-lg pl-20 pr-14 outline-none text-center'
                        placeholder='Matricule'
                        value={matriculeInput}
                        onChange={handleMatriculeInputChange}
                    />
                    <img src={search} className='h-6 w-6 pr-1 hover:bg-gray-50 cursor-pointer' />
                    {matriculeInput && (
                        <ul className="absolute left-0 top-full mt-2 w-full bg-white border rounded-md shadow-lg z-10">
                            {suggestions.length > 0 ? (
                                suggestions.map((suggestion, index) => (
                                    <li
                                        key={index}
                                        className="p-2 hover:bg-gray-200 cursor-pointer"
                                        onClick={() => handleMatriculeSelection(suggestion.Matricule)}
                                    >
                                        {suggestion.Matricule}
                                    </li>
                                ))
                            ) : (
                                <li className="p-2 text-gray-500">No suggestions</li>
                            )}
                        </ul>
                    )}
                </div>

                <div className='flex flex-col grow'>
                    <div className='border-b flex grow' />
                    <div className='border-t flex grow' />
                </div>
            </div>
            <div className='flex flex-row grow justify-center items-center'>
                {exists && (<span className='text-sm text-textSecound font-medium'>Ce cycle existe déjà, vous pouvez le modifier</span>)}
            </div>
            {empty ? (
                <div className='flex flex-col grow justify-center items-center pt-10'>
                    <span className='text-4xl text-primaryIdle'>Vide!</span>
                    <span className='text-md text-textSecound'>Essayez d'abord de saisir des nouvelles informations d'enseignant.</span>
                </div>
            ) :
                (<CycleForm params={params} data={Object.values(ens_data)[0]} inputs={inputs} setInput={changeInputs} handleGradeChange={handleGradeChange} handleAddOnClick={handleAddOnClick} isFetching={ens_loading || isFetchingData} exists={exists} />
                )}</div>
    );
}

export default AddCycle;