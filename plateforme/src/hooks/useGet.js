import { useEffect, useState } from "react"
import axios from "axios"


export default function useGet(url, defaultData=null){

    const [data,setData] = useState(defaultData)
    const [error,setError] = useState(null)
    const [loading,setLoading] = useState(false)

    useEffect(() => {
        (
            async function(){
                try{
                    setLoading(true)
                    const response = await axios.get(url)
                    setData(response.data)
                }catch(error){
                    if (defaultData) setData(defaultData)
                    if (error.code==="ERR_NETWORK") return setError(`Impossible de se connecter au serveur`);
                    if (error.code==="ERR_BAD_RESPONSE") return setError(`La base de donnée mets trop de temps à répondre`);
                    setError(`Erreur : ${error.message}`);
                }finally{
                    setLoading(false)
                }
            }
        )()
    }, [url])

    return { data, error, loading }

}
