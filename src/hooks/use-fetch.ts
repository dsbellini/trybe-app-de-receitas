import { useEffect, useState } from 'react';

type Fetch = () => Promise<Response>;

function useFetch(Fetch: Fetch) {
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await Fetch();
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        }
      }
    }
    fetchData();
  }, [Fetch]);
  return { data, error };
}
export default useFetch;
