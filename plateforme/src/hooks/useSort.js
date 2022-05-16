import { useSearchParams } from 'react-router-dom';

const useSort = function(props) {


    const [searchParams, setSearchParams] = useSearchParams({});

    const readURL = function(searchParams) {
        let output="";
        for (const [key, value] of searchParams.entries()) {
            output+=`&${key}=${value}`
        }
        return output;
    }
    
    const readURLObject = function(searchParams) {
        let output={};
        for (const [key, value] of searchParams.entries()) {
            output[key]=value
        }
        return output;
    }
    const handleChangePage = async (event, newPage) => {
        let param=readURLObject(searchParams);
        param["page"] = newPage;
        setSearchParams(param);
    };

    const sortHandeler = function(event, key) {
        let param=readURLObject(searchParams);
        let order = "-"
        if (param["sort"]===`-${key}`) order ="+"
        param["sort"] = `${order}${key}`;
        setSearchParams(param);
    }

    return {readURL, readURLObject, handleChangePage,sortHandeler}
}

export default useSort;