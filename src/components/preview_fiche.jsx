import um from '../assets/UM.svg';
import fsei from '../assets/Fsei.svg';
import Functions from '../utils/functions';
import { forwardRef } from 'react';

const FichePDF = forwardRef((printData, ref) => {

    const data = printData.infoPersonel;

    let { infoPersonel, infoSalaire } = data;

    infoPersonel = infoPersonel ?? {};
    infoSalaire = infoSalaire ?? {};

    return (<div className="bg-disabled flex grow justify-center items-center mr-16 ml-16 mb-10">
        <div className='mt-8 mb-8 shadow-xl'>
            <div ref={ref} className='p-10 h-[297mm] w-[210mm] bg-white flex flex-col space-y-2'>
                <div title='header' className='flex flex-row space-x-5 mb-3'>
                    <img src={um} className='w-[15%]' />
                    <span className='flex flex-col grow justify-between items-center h-full'>
                        <span className='text-base font-medium'>REPUBLIQUE ALGERIENNE DEMOCRATIQUE ET POPULAIRE</span>
                        <span className='text-xs'>MINISTERE DE L'ENSEIGNEMENT SUPERIEUR ET DE LA RECHERCHE SCIENTIFIQUE</span>
                        <span className='text-xs'>UNIVERSITE ABDELHAMID IBN BADIS - MOSTAGANEM</span>
                        <span className='text-xs'>FACULTE DES SCIENCES EXACTES ET DE L'INFORMATIQUE</span>
                    </span>
                    <img src={fsei} className='w-[12%]' />
                </div>
                <span title='date' className='flex flex-row text-xs justify-end pt-3'>Mostaganem le: <span className='pl-5'>{Functions.formatDate(new Date())}</span></span>
                <span title='title' className='flex flex-row text-2xl font-medium justify-center'>BULLETIN DE PAIE</span>
                <span title='subtitle' className='flex flex-row font-medium justify-center italic'>Période: {infoPersonel.month === "" || infoPersonel.month === undefined || infoPersonel.month === null ? "{Mois}" : infoPersonel.month} {infoPersonel.year === "" || infoPersonel.year === undefined || infoPersonel.year === null ? "{Année}" : infoPersonel.year}</span>
                <div title='info_personel' className='flex flex-row justify-around rounded-lg border border-black p-2'>
                    <span title='left' className='flex flex-row justify-between space-x-5'>
                        <span title='keys' className='flex flex-col'>
                            <span className='font-bold'>Matricule:</span>
                            <span className='font-bold'>Nom:</span>
                            <span className='font-bold'>Prénom:</span>
                            <span className='font-bold'>Né(e) le:</span>
                            <span className='font-bold'>Grade:</span>
                        </span>
                        <span title='values' className='flex flex-col'>
                            <span>{infoPersonel.matricule !== "" ? infoPersonel.matricule : "Vide"}</span>
                            <span>{infoPersonel.nom !== "" ? infoPersonel.nom : "Vide"}</span>
                            <span>{infoPersonel.prenom !== "" ? infoPersonel.prenom : "Vide"}</span>
                            <span>{Functions.formatDate(infoPersonel.dateChange)}</span>
                            <span>{infoPersonel.grade !== "" ? infoPersonel.grade : "Vide"}</span>
                        </span>
                    </span>
                    <span title='right' className='flex flex-row justify-between space-x-5'>
                        <span title='keys' className='flex flex-col'>
                            <span className='font-bold'>Recrutement:</span>
                            <span className='font-bold'>Catégorie:</span>
                            <span className='font-bold'>Échelon:</span>
                            <span className='font-bold'>Agence:</span>
                            <span className='font-bold'>N° Compte:</span>
                        </span>
                        <span title='values' className='flex flex-col'>
                            <span>{Functions.formatDate(infoPersonel.recChange)}</span>
                            <span>{infoPersonel.categorie !== "" ? infoPersonel.categorie : "Vide"}</span>
                            <span>{infoPersonel.echelon !== "" ? infoPersonel.echelon : "Vide"}</span>
                            <span>{infoPersonel.agence !== "" ? infoPersonel.agence : "Vide"}</span>
                            <span>{infoPersonel.compte !== "" ? infoPersonel.compte : "Vide"}</span>
                        </span>
                    </span>
                </div>
                <div title='tableau' className='flex flex-row  items-stretch'>
                    <div title='Details' className='w-1/3 rounded-tl-lg border border-black'>
                        <span className='flex flex-row p-1 mb-2 text-lg font-medium border-b border-black'>
                            <span className='flex flex-row grow'></span>DETAILS<span className='flex flex-row grow'></span>
                        </span>
                        <span className='flex flex-col pl-5 pb-5 space-y-1'>
                            <span>Salaire de base</span>
                            <span>I.E.P</span>
                            <span>I. Poste Superieur</span>
                            <span>I. Documentation</span>
                            <span>I. Encadrement</span>
                            <span>I. Qualification</span>
                            <span>Allocation Familiale</span>
                            <span>Sécurité Sociale</span>
                            <span>I.R.G</span>
                            <span>C. Mutelle</span>
                            <span>Retenue Abs</span>
                            <span>Les Retenues</span>
                            <span>Montant Brut</span>
                        </span>
                    </div>
                    <div title='Gains' className='w-1/3 border border-black'>
                        <span className='flex flex-row p-1 mb-2 text-lg font-medium border-b border-black'>
                            <span className='flex flex-row grow'></span>GAINS<span className='flex flex-row grow'></span>
                        </span>
                        <span className='flex flex-col pb-5 space-y-1 items-center'>
                            <span>{!isNaN(Functions.formatNumber(infoSalaire.Salaire_base)) ? Functions.formatNumber(infoSalaire.Salaire_base) : "/"}</span>
                            <span>{!isNaN(Functions.formatNumber(infoSalaire.ind_exp)) ? Functions.formatNumber(infoSalaire.ind_exp) : "/"}</span>
                            <span>{!isNaN(Functions.formatNumber(infoSalaire.ind_poste_sup)) ? Functions.formatNumber(infoSalaire.ind_poste_sup) : "/"}</span>
                            <span>{!isNaN(Functions.formatNumber(infoSalaire.ind_doc)) ? Functions.formatNumber(infoSalaire.ind_doc) : "/"}</span>
                            <span>{!isNaN(Functions.formatNumber(infoSalaire.ind_enc_suivi)) ? Functions.formatNumber(infoSalaire.ind_enc_suivi) : "/"}</span>
                            <span>{!isNaN(Functions.formatNumber(infoSalaire.ind_qual)) ? Functions.formatNumber(infoSalaire.ind_qual) : "/"}</span>
                            <span>{!isNaN(Functions.formatNumber(infoSalaire.Alloc_Fam)) ? Functions.formatNumber(infoSalaire.Alloc_Fam) : "/"}</span>
                            <span className='invisible'>/</span>
                            <span className='invisible'>/</span>
                            <span className='invisible'>/</span>
                            <span className='invisible'>/</span>
                            <span className='invisible'>/</span>
                            <span className='italic'>{!isNaN(Functions.formatNumber(infoSalaire.Montant_brute)) ? Functions.formatNumber(infoSalaire.Montant_brute) : "{Montant Brute}"}</span>
                        </span>
                    </div>
                    <div title='Retenues' className='w-1/3 rounded-tr-lg border border-black'>
                        <span className='flex flex-row p-1 mb-2 text-lg font-medium border-b border-black'>
                            <span className='flex flex-row grow'></span>RETENUES<span className='flex flex-row grow'></span>
                        </span>
                        <span className='flex flex-col pr-5 pb-5 space-y-1 items-end'>
                            <span className='invisible'>/</span>
                            <span className='invisible'>/</span>
                            <span className='invisible'>/</span>
                            <span className='invisible'>/</span>
                            <span className='invisible'>/</span>
                            <span className='invisible'>/</span>
                            <span className='invisible'>/</span>
                            <span>{!isNaN(Functions.formatNumber(infoSalaire.ss)) ? Functions.formatNumber(infoSalaire.ss) : "/"}</span>
                            <span>{!isNaN(Functions.formatNumber(infoSalaire.valeur_irg)) ? Functions.formatNumber(infoSalaire.valeur_irg) : "/"}</span>
                            <span>{!isNaN(Functions.formatNumber(infoSalaire.cot_mutuelle)) ? Functions.formatNumber(infoSalaire.cot_mutuelle) : "/"}</span>
                            <span>{!isNaN(Functions.formatNumber(infoSalaire.retenu_abs)) ? Functions.formatNumber(infoSalaire.retenu_abs) : "/"}</span>
                            <span>{!isNaN(Functions.formatNumber(infoSalaire.retenus)) ? Functions.formatNumber(infoSalaire.retenus) : "/"}</span>
                            <span className='invisible'>/</span>
                        </span>
                    </div>
                </div>
                <span title='total' className='flex flex-row justify-end'>
                    <span className='border border-black rounded-lg p-2 italic'>
                        <span className='mr-10 font-bold'>Net à Payer:</span> {!isNaN(Functions.formatNumber(infoSalaire.Salaire)) ? Functions.formatNumber(infoSalaire.Salaire) : "{Salaire}"}</span>
                </span>
                <span className='flex flex-row grow'></span>
                <span title='signature' className='flex flex-row justify-end items-end pt-3'>
                    <span className='text-lg font-medium pr-[10%]'>LE RECTEUR</span>
                    <span className='pr-[10%]'>x</span>
                </span>
                <span className='flex flex-row grow'></span>
            </div>
        </div>
    </div>);
})

export default FichePDF;