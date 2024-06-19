export const calculateSalary = ({
    nb_abs,
    indice_grade,
    indice_ech,
    indice_poste_supt,
    indice_doc_cat,
    ind_enc_suivi_cat,
    ind_qual_cat,
    irg,
    mutuelle,
    nb_enfants,
    nb_enfants_p,
    conjointe,
    sexe,
    situaion
}) => {

    const vpi = 45;/* Valeur du point indicière */
    const tind_exp = 0.04; /* Taux d'indemnité d'experience pédagogique */

    const traitement = indice_grade * vpi;
    const exp_prof = indice_ech * vpi

    const Salaire_base = traitement + exp_prof;
    /* 
    Salaire_base: Salaire de base
    indice_ech: Indices de l'échelon
    exp_prof: Éxpérience professeur
    indice_grade: Indice de grade / Indice minimale
     */


    const ind_exp = Salaire_base * tind_exp;
    const ind_poste_sup = indice_poste_supt * vpi;
    const ind_doc = indice_doc_cat;
    const ind_enc_suivi = Salaire_base * ind_enc_suivi_cat;
    const ind_qual = Salaire_base * ind_qual_cat;

    const Ind = ind_exp + ind_poste_sup + ind_doc + ind_enc_suivi + ind_qual;
    /* 
    Ind: Indemnités
    ind_exp: Indemnité d'expérience pédagogique
    ind_poste_sup: Indemnité de poste suppérieur
    ind_doc: Indemnité de doumentation
    ind_enc_suivi: Indemnité d'encadrement et de suivi pédagogique
    ind_qual: Indemnité de qualifications scientifiques
     */



    let salaire_unique = 0;
    if (nb_enfants === 1 && (conjointe === 0 || (sexe === 1 && situaion === 2))) {
        salaire_unique = 800;
    }
    if (nb_enfants === 0 && conjointe === 0) {
        salaire_unique = 5.5;
    }
    let Alloc_enfants = nb_enfants * 300;
    Alloc_enfants += 11.25 * nb_enfants_p;
    /* 
    Alloc_enfants: Allocation des enfants
    Alloc_Fam: Allocation Familiale
    */

    const Alloc_Fam = salaire_unique + Alloc_enfants;

    const Montant_brute = Salaire_base + Ind + Alloc_Fam;

    let valeur_irg = 0;

    if (Montant_brute > irg.min) {
        valeur_irg = irg.a * Montant_brute + irg.b;
    }

    const ss = (Salaire_base + Ind) * 0.09;
    const retenu_abs = (Salaire_base - Alloc_Fam) * nb_abs / 30;
    const cot_mutuelle = (Montant_brute - Alloc_Fam) * 0.01 * mutuelle;
    const retenus = ss + valeur_irg + retenu_abs + cot_mutuelle;
    /* 
    ss: Sécurité Sociale
    irg: Impôts sur le revenue globale
    retenu_abs: Retenu d'absence
    cot_mutuelle: Cotisation mutuelle
    */

    const Salaire = Montant_brute - retenus;

    return { Salaire, Salaire_base, ind_exp, ind_poste_sup, ind_doc, ind_enc_suivi, ind_qual, Alloc_Fam, ss, valeur_irg, cot_mutuelle, retenu_abs, retenus, Montant_brute };
};