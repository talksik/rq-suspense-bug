import './App.css';
import { QueryClient, QueryClientProvider, useQueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary'

// Create a client
const queryClient = new QueryClient()

function App() {
  const { reset } = useQueryErrorResetBoundary()

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary
        onReset={reset}
        fallbackRender={({ resetErrorBoundary }) => (
          <div>
            There was an error!
            <button onClick={() => resetErrorBoundary()}>Try again</button>
          </div>
        )}
      >
        <Todos />
      </ErrorBoundary>
    </QueryClientProvider>
  )
}

// mock the idea of protected component/requiring authentication
let count = 0;

function Todos() {
  const { data } = useSuspenseQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      console.log('fetching data');
      console.log(count);
      if (count === 0) {
        count++;
        throw new Error('This is an error');
      }
      const response = await fetch('https://jsonplaceholder.typicode.com/todos');
      const data = await response.json() as any[];
      return data;
    },
    retry: false,
  });

  return (
    <div className="App">
      {`got data ${data.length}`}
    </div>
  );
}

export default App;
