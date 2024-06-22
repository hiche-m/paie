import CustomInput from "./custom_input";
import newIcon from '../assets/Icons/new.svg';
import CustomButton from "./custom_button";
import Spacer from "./spacer";
import { useEffect, useState } from "react";
import { database, newprof, checkMatricule, getCategories, getParams } from '../services/firebase'
import { Grid as GridSpinner } from 'react-loader-spinner'
import { ThreeDots } from 'react-loader-spinner';
import CustomDate from "./custom_date";
import CustomCatInput from "./custom_cat_input";
import Functions from "../utils/functions";
import CustomOutput from "./custom_output";

const AddingForm = ({ data, isLoading, error, matricule, setMatricule, nom, setNom, ss, setSS, prenom, setPrenom,
    sexe, setSexe, grade, setGrade, echelon, setEchelon, rendement, setRendement, mutuel, setMutuel, situation,
    setSituation, enfants, setEnfants, dixEnfants, setDixEnfants, poste, setPoste, femme, setFemme, isFetching,
    setFetching, dateChange, setDateChange, recChange, setRecChange, categorie, setCategorie, agence, setAgence, compte,
    setCompte }) => {

    const [catValues, setCatValues] = useState(null);
    const [gradeEq, setGradeEq] = useState(null);
    const [isFetchingData, setIsFetchingData] = useState(false);

    useEffect(() => {
        loadCats();
        clearInputs();

    }, []);

    const clearInputs = () => {
        setGrade(data["grades"][0]);
        setFemme(data["femme"][2]);
        setSexe(data["sexe"][0]);
        setEchelon(data["echelons"][0]);
        setRendement(data["rendements"][0]);
        setMutuel(data["mutuelle"][0]);
        setSituation(data["situaions"][0]);
        setPoste(`${Object.keys(data["posts"])[0]};${Object.values(Object.values(data["posts"])[0])[0]}`);
        setEnfants("0");
        setDixEnfants("0")
        setNom("");
        setPrenom("");
        setMatricule("");
        setSS("");
        setAgence("");
        setCompte("");
        setDateChange(new Date());
        setRecChange(new Date());
    };

    const handleGradeChange = (event) => {
        const value = event.target.value.toString();
        setGrade(value);
        const gradeIndex = data["grades"].indexOf(value);
        const catIndex = gradeEq[gradeIndex];
        const cat = catValues[catIndex - 1];
        setCategorie(cat);
    };

    const handleEditRec = (event) => {
        setRecChange(event);
    };

    const handleEditDate = (event) => {
        setDateChange(event);
    };

    const loadCats = async () => {
        setIsFetchingData(true);
        try {
            const response = await getCategories(database);
            setCatValues(response);
            const params = await getParams(database);
            setGradeEq(params.grade_eq);
            setCategorie(response[0]);
        } catch (error) {
            window.alert(error.message);
        }
        setIsFetchingData(false);
    };

    const showAlert = (text) => {
        window.alert(text);
    }

    const handleAddOnClick = async (event) => {
        event.preventDefault();

        if (matricule === "" || matricule === null || matricule === undefined) {
            showAlert("Le matricule est obligatoire! Veuillez le remplir.");
            return;
        }
        setFetching(true);
        if (await checkMatricule(database, matricule)) {
            setFetching(false);
            showAlert("Ce matricule existe dèja!");
            return;
        }

        const content = {
            "Numéro SS": ss,
            "Sexe": data["sexe"].indexOf(sexe),
            "Conjointe": data["femme"].indexOf(femme),
            "Echélon": data["echelons"].indexOf(echelon),
            "Enfants (+10)": dixEnfants,
            "Nombre d'enfants": enfants,
            "Grade": data["grades"].indexOf(grade),
            "Mutuelle Sociale": data["mutuelle"].indexOf(mutuel),
            "Nom": nom,
            "Poste supérieur": poste,
            "Prénom": prenom,
            "Rendement": data["rendements"].indexOf(rendement),
            "Situation familiale": data["situaions"].indexOf(situation),
            "Catégorie": categorie,
            "Date de naissance": dateChange.getTime(),
            "Date de recrutement": recChange.getTime(),
            "N° Compte": compte,
            "Établissement de paiement": agence,
            "Matricule": matricule,
            "lastEdit": Date.now(),
        };
        for (const [key, value] of Object.entries(content)) {
            if (value === "" || value === null || value === undefined) {
                setFetching(false);
                showAlert("Veuillez remplir tous les champs.");
                return;
            }
        }
        const response = await newprof(database, content, matricule);
        setFetching(false);
        if (response === null) {
            showAlert("Enseignant ajouté avec succés!");
            clearInputs();
            setCategorie(catValues[gradeEq[0] - 1]);
        } else {
            showAlert(response);
        }
    }

    if (isLoading || isFetchingData) {
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

    if (error !== null) {
        return (
            <div className='flex items-center justify-center text-red-500 font-medium'>un erreur s'est produit, veuillez réessayer ultérieurement!</div>
        );
    }

    return (
        <form id="form" className="flex flex-col space-y-7">
            <span className="text-lg font-medium">Informations Personnelles</span>
            <div id="row1" className="flex justify-between items-end">
                <CustomInput className="w-1/5" type="text" placeholder="Content" label="Nom" onChange={(event) => { setNom(event.target.value.toString()) }} value={nom} autoFocus={true} />
                <CustomInput className="w-1/5" type="text" placeholder="Content" label="Prenom" onChange={(event) => { setPrenom(event.target.value.toString()) }} value={prenom} />
                <div className={`flex flex-col w-1/5`}>
                    <label className="mb-2">Sexe</label>
                    <label className="flex items-center space-x-4 p-2 pr-10 ">
                        <input
                            type="radio"
                            id="Homme"
                            checked={sexe === "Homme"}
                            onChange={() => setSexe("Homme")}
                            className="h-4 w-4 cursor-pointer appearance-none rounded-full border border-secoundaryIdle checked:border-secoundaryIdle checked:bg-secoundaryIdle hover:border-secoundaryLighter "
                        />
                        <label htmlFor='Homme' className="text-gray-700">Homme</label>
                        <input
                            type="radio"
                            id="Femme"
                            checked={sexe === "Femme"}
                            onChange={() => setSexe("Femme")}
                            className="h-4 w-4 cursor-pointer appearance-none rounded-full border border-secoundaryIdle checked:border-secoundaryIdle checked:bg-secoundaryIdle hover:border-secoundaryLighter"
                        />
                        <label htmlFor='Femme' className="text-gray-700">Femme</label>
                    </label>
                </div>
            </div>
            <div id="row2" className="flex justify-between items-end">
                <CustomDate className="w-1/5" label="Date de naissance" onChange={handleEditDate} value={dateChange} />
                <CustomInput className="w-1/5" type="text" placeholder="Content" label="Situation Familiale" values={Array.from(data["situaions"])} onChange={(event) => { setSituation(event.target.value.toString()) }} value={situation} />
                <CustomInput className="w-1/5" type="text" placeholder="Content" label="Épouse (Femme)" values={Array.from(data["femme"])} onChange={(event) => { setFemme(event.target.value.toString()) }} value={femme} />
            </div>
            <div id="row3" className="flex justify-between items-center ">
                <CustomInput className="w-1/5" type="text" placeholder="Content" label="Nombre d'enfants" onChange={(event) => { setEnfants(event.target.value.toString()) }} value={enfants} />
                <CustomInput className="w-1/5" type="text" placeholder="Content" label="Nombre d’enfants +10 ans" onChange={(event) => { setDixEnfants(event.target.value.toString()) }} value={dixEnfants} />
                <div className="w-1/5" />
            </div>
            <span className="text-lg font-medium pt-10">Informations Administratives</span>
            <div id="row4" className="flex justify-between items-end ">
                <CustomInput className="w-1/5" type="text" placeholder="Ex: 191912345678" label="Matricule" onChange={(event) => { setMatricule(event.target.value.toString()) }} value={matricule} />
                <CustomInput className="w-1/5" type="text" placeholder="Content" label="Numéro de sécurité sociale" onChange={(event) => { setSS(event.target.value.toString()) }} value={ss} />
                <CustomInput className="w-1/5" type="text" placeholder="Content" label="Mutuelle Sociale" values={Array.from(data["mutuelle"])} onChange={(event) => { setMutuel(event.target.value.toString()) }} value={mutuel} />
            </div>
            <div id="row5" className="flex justify-between items-end ">
                <CustomDate className="w-1/5" label="Date de recrutement" onChange={handleEditRec} value={recChange} />
                <CustomInput className="w-1/5" type="text" placeholder="Content" label="Établissement de paiement" onChange={(event) => { setAgence(event.target.value.toString()) }} value={agence} />
                <CustomInput className="w-1/5" type="text" placeholder="Content" label="N° de compte" onChange={(event) => { setCompte(event.target.value.toString()) }} value={compte} />
            </div>
            <span className="text-lg font-medium pt-10">Informations Académiques</span>
            <div id="row6" className="flex justify-between items-end">
                <CustomInput className="w-1/5" type="text" placeholder="Content" label="Grade" values={Array.from(data["grades"])} onChange={handleGradeChange} value={grade} />
                <CustomCatInput className="w-1/5" type="text" placeholder="Content" label="Poste Supérieur" values={data["posts"]} onChange={(event) => { setPoste(event.target.value) }} value={poste} />
                <div className="w-1/5" />
            </div>
            <div id="row7" className="flex justify-between items-end">
                <CustomOutput label="Catégorie" value={categorie} className="font-medium" />
                <CustomInput className="w-1/5" type="text" placeholder="Content" label="Echélon" values={Array.from(data["echelons"])} onChange={(event) => { setEchelon(event.target.value.toString()) }} value={echelon} />
                <CustomInput className="w-1/5" type="text" placeholder="Content" label="Rendement" values={Array.from(data["rendements"])} onChange={(event) => { setRendement(event.target.value.toString()) }} value={rendement} />
            </div>
            <div id="row8" className="flex justify-between items-center ">
                <Spacer />
                {isFetching ?
                    <div className="cursor-pointer flex flex-row justify-center items-center p-3 bg-secoundaryIdle hover:bg-secoundaryLighter active:bg-secoundaryDarker rounded-lg">
                        <ThreeDots
                            visible={true}
                            height="20"
                            width="20"
                            color="#FFFFFF"
                            radius="5"
                            ariaLabel="three-dots-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                        />
                    </div>
                    : <CustomButton icon={newIcon} text="Ajouter" onClick={(event) => handleAddOnClick(event)} />}
            </div>
        </form>
    );
}

export default AddingForm;