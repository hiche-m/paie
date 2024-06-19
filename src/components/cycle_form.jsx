import CustomCatInput from "./custom_cat_input";
import CustomDate from "./custom_date";
import CustomInput from "./custom_input";
import { Grid as GridSpinner, ThreeDots } from 'react-loader-spinner'
import CustomOutput from "./custom_output";
import Spacer from "./spacer";
import CustomButton from "./custom_button";
import newIcon from '../assets/Icons/new.svg';
import { useEffect, useState } from "react";
import { database, getCategories, getParams } from "../services/firebase";
import Functions from "../utils/functions";

const CycleForm = ({ params, data, inputs, setInput, handleGradeChange, handleAddOnClick, isFetching }) => {

    if (isFetching) {
        return (<div className='flex items-center justify-center'>
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
        <form id="form" className="flex flex-col space-y-7 p-5 pr-5 pl-5">
            <div className='flex flex-row justify-between items-center'>
                <CustomInput label="N° d'absences (h)" type="text" placeholder="Ex: 15" value={inputs.absence} onChange={(event) => { setInput("absence", event.target.value.toString()) }} autoFocus={true} />{isFetching ?
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
                    : <CustomButton icon={newIcon} text="Sauvegarder" onClick={(event) => handleAddOnClick(event)} />}
            </div>
            <span className="text-lg font-medium">Informations Personnelles</span>
            <div id="row1" className="flex justify-between items-end">
                <CustomInput className="w-1/5" type="text" placeholder="Content" label="Nom" onChange={(event) => { setInput("nom", event.target.value.toString()) }} value={inputs.nom} />
                <CustomInput className="w-1/5" type="text" placeholder="Content" label="Prenom" onChange={(event) => { setInput("prenom", event.target.value.toString()) }} value={inputs.prenom} />
                <CustomOutput label="Sexe" value={inputs.sexe} className="w-1/5 justify-center" />
            </div>
            <div id="row2" className="flex justify-between items-end">
                <CustomOutput label="Date de naissance" value={Functions.formatDate(inputs.dateChange)} className="w-1/5 justify-center" />
                <CustomInput className="w-1/5" type="text" placeholder="Content" label="Situation Familiale" values={Array.from(params["situaions"])} onChange={(event) => { setInput("situation", event.target.value.toString()) }} value={inputs.situation} />
                <CustomInput className="w-1/5" type="text" placeholder="Content" label="Épouse (Femme)" values={Array.from(params["conjointe"])} onChange={(event) => { setInput("femme", event.target.value.toString()) }} value={inputs.femme} />
            </div>
            <div id="row3" className="flex justify-between items-center ">
                <CustomInput className="w-1/5" type="text" placeholder="Content" label="Nombre d'enfants" onChange={(event) => { setInput("enfants", event.target.value.toString()) }} value={inputs.enfants} />
                <CustomInput className="w-1/5" type="text" placeholder="Content" label="Nombre d’enfants +10 ans" onChange={(event) => { setInput("dixEnfants", event.target.value.toString()) }} value={inputs.dixEnfants} />
                <div className="w-1/5" />
            </div>
            <span className="text-lg font-medium pt-10">Informations Administratives</span>
            <div id="row4" className="flex justify-between items-end ">
                <CustomOutput label="Matricule" value={inputs.matricule} className="w-1/5 justify-center" />
                <CustomInput className="w-1/5" type="text" placeholder="Content" label="Numéro de sécurité sociale" onChange={(event) => { setInput("ss", event.target.value.toString()) }} value={inputs.ss} />
                <CustomInput className="w-1/5" type="text" placeholder="Content" label="Mutuelle Sociale" values={Array.from(params["mutuelle"])} onChange={(event) => { setInput("mutuel", event.target.value.toString()) }} value={inputs.mutuel} />
            </div>
            <div id="row5" className="flex justify-between items-end ">
                <CustomOutput label="Date de recrutement" value={Functions.formatDate(inputs.recChange)} className="w-1/5 justify-center" />
                <CustomInput className="w-1/5" type="text" placeholder="Content" label="Établissement de paiement" onChange={(event) => { setInput("agence", event.target.value.toString()) }} value={inputs.agence} />
                <CustomInput className="w-1/5" type="text" placeholder="Content" label="N° de compte" onChange={(event) => { setInput("compte", event.target.value.toString()) }} value={inputs.compte} />
            </div>
            <span className="text-lg font-medium pt-10">Informations Académiques</span>
            <div id="row6" className="flex justify-between items-end">
                <CustomInput className="w-1/5" type="text" placeholder="Content" label="Grade" values={Array.from(params["grades"])} onChange={handleGradeChange} value={inputs.grade} />
                <CustomCatInput className="w-1/5" type="text" placeholder="Content" label="Poste Supérieur" values={data["Poste supérieur"].values} onChange={(event) => { setInput("poste", event.target.value) }} value={inputs.poste} />
                <div className="w-1/5" />
            </div>
            <div id="row7" className="flex justify-between items-end">
                <CustomOutput label="Catégorie" value={inputs.categorie} className="w-1/5 justify-center" />
                <CustomInput className="w-1/5" type="text" placeholder="Content" label="Echélon" values={Array.from(params["echelons"])} onChange={(event) => { setInput("echelon", event.target.value.toString()) }} value={inputs.echelon} />
                <CustomInput className="w-1/5" type="text" placeholder="Content" label="Rendement" values={Array.from(params["rendements"])} onChange={(event) => { setInput("rendement", event.target.value.toString()) }} value={inputs.rendement} />
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
                    : <CustomButton icon={newIcon} text="Sauvegarder" onClick={(event) => handleAddOnClick(event)} />}
            </div>
        </form>
    );
}

export default CycleForm;