import { useRef, useEffect } from 'react';

 function useDidMountEffect() {
  const firstRender = useRef(true);

  useEffect(() => {
    firstRender.current = false;
  }, []);

  return firstRender.current;
}


export default useDidMountEffect;