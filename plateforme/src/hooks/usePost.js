import { useEffect, useState } from "react"
import axios from "axios"


export default function usePost(url, payload, headers=null){

    const [data,setData] = useState(null)
    const [error,setError] = useState(null)
    const [loading,setLoading] = useState(false)

    useEffect(() => {
        (
            async function(){
                try{
                    setLoading(true)
                    const response = await axios.post(url, payload, headers)
                    setData(response.data)
                }catch(err){
                    if (error.code==="ERR_BAD_REQUEST") return setError("Impossible de créer cet utilisateur");
                    if (error.code==="ERR_NETWORK") return setError("Erreur de connexion : Le serveur n'est pas accessible");
                    if (error.response.data?.message.startsWith("La création a échouée")) return setError("L'utilisateur ou l'email fournit existe déjà");        
                    setError(err)
                }finally{
                    setLoading(false)
                }
            }
        )()
    }, [url])

    return { data, error, loading }

}
