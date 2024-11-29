import { useEffect, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { GOOGLE_MAPS_LIBRARIES } from './constants';

export const useLoadGMapsLibraries = () => {
  const [libraries, setLibraries] = useState();

  useEffect(() => {
    // console.log('API Key:', import.meta.env.VITE_GOOGLE_MAPS_API_KEY);

    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: 'weekly',
    });

    const promises = GOOGLE_MAPS_LIBRARIES.map((name) =>
      loader.importLibrary(name).then((lib) => [name, lib])
    );

    Promise.all(promises).then((libs) =>
      setLibraries(Object.fromEntries(libs))
    );
  }, []);

  return libraries;
};