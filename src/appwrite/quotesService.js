import { useState, useEffect } from 'react';
import { Client, Functions } from 'appwrite';

export default function useInspirationalQuote({ refetch }) {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('685bbc97000569923490');

  const functions = new Functions(client);

  useEffect(() => {
    if (!refetch) return;

    const fetchQuote = async () => {
      setLoading(true);
      setErrorMsg(null);
      setQuote(null);

      try {
        const execution = await functions.createExecution('68693a9e0001fee507d7');
        const response = JSON.parse(execution.responseBody);
        if (response.success) {
          setQuote(response.data[0]);
          console.log(response.data[0]);
          
        } else {
          setErrorMsg(response.error || 'Failed to fetch quote.');
        }
      } catch (error) {
        console.error('Error calling function:', error);
        setErrorMsg('Something went wrong!');
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, [refetch]);

  return { quote, loading, errorMsg };
}
