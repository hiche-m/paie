import Grid from '../components/grid'
import { database } from '../services/firebase'
import { createContext } from 'react'
import useFetch from '../services/usefetch'
import { useOutletContext } from 'react-router-dom'
import { Grid as GridSpinner } from 'react-loader-spinner'
import Spacer from '../components/spacer'
import CycleGrid from '../components/grid_cycle'
import useFetchCycle from '../services/useFetchCycle'

function AgentDashboard() {

  const { data, isLoading, error } = useFetch(database);
  const [cycleData, cycleIsLoading, cycleError] = useFetchCycle(database);
  const context = useOutletContext();

  return (
    <>
      {/* <div className='text-2xl font-bold pt-12 pb-12 pr-14 pl-14'>Tableau de bord</div> */}

      {context === null ? (
        <div className='flex items-center justify-center'>
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
        : (<databaseContext.Provider value={database}>
          <div className='pr-14 pl-14 max-w-full flex flex-col mb-20'>
            <span className='text-2xl font-bold mb-5 mt-5'>Cycles de paies</span>
            <CycleGrid data={cycleData} isLoading={cycleIsLoading} error={cycleError} headers={["Matricule", "Nom", "Prénom", "Absence(h)", "Grade", "Echélon", "Rendement", "Poste supérieur", "Situation familiale", "Conjointe", "Nombre d'enfants", "Enfants (+10)", "Mutuelle Sociale", "Société", "N° Compte"]} />
            <span className='text-2xl font-bold mb-5 mt-10'>Enseignants</span>
            <Grid data={data} isLoading={isLoading} error={error} headers={["Nom", "Prénom", "Sexe", "Grade", "Echélon", "Rendement", "Mutuelle Sociale", "Numéro SS", "Situation familiale", "Conjointe", "Nombre d'enfants", "Enfants (+10)", "Poste supérieur"]} actionRoute="/entries" actionText="Ajouter un enseignant" showPrint={false} />
          </div>
        </databaseContext.Provider>)
      }
    </>
  )
}


export const databaseContext = createContext()

export default AgentDashboard
