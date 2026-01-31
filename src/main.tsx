import ReactDOM from 'react-dom/client';
import {BrowserRouter} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import Modal from "@/components/atoms/modal";
import Alert from "@/components/atoms/alert";
import Snackbar from "@/components/atoms/snackbar";
import {App} from "@/pages/app";
import {useThemeStore} from "@/store/theme";
import {useEffect} from "react";

const queryClient = new QueryClient({
  defaultOptions: {queries: {refetchOnWindowFocus: false, retryOnMount: true, refetchOnReconnect: false, retry: false}},
});

// Theme Provider Component
const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { isDark } = useThemeStore();
  
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);
  
  return <>{children}</>;
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <BrowserRouter basename={'/website'}>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <App/>
        <Modal/>
        <Alert/>
        <Snackbar/>
      </ThemeProvider>
    </QueryClientProvider>
  </BrowserRouter>
);
