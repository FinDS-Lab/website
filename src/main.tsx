import ReactDOM from 'react-dom/client';
import {BrowserRouter} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import Modal from "@/components/atoms/modal";
import Alert from "@/components/atoms/alert";
import Snackbar from "@/components/atoms/snackbar";
import {App} from "@/pages/app";

const queryClient = new QueryClient({
  defaultOptions: {queries: {refetchOnWindowFocus: false, retryOnMount: true, refetchOnReconnect: false, retry: false}},
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <BrowserRouter basename={'/website'}>
    <QueryClientProvider client={queryClient}>
      <App/>
      <Modal/>
      <Alert/>
      <Snackbar/>
    </QueryClientProvider>
  </BrowserRouter>
);
