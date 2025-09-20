import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; 
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HydrationBoundary } from "@tanstack/react-query";
import App from "./App.jsx";
import './index.css';

const queryClient = new QueryClient();

ReactDOM.hydrateRoot(
  document.getElementById("root"),
  <QueryClientProvider client={queryClient}>
    <HydrationBoundary state={window.__REACT_QUERY_STATE__}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HydrationBoundary>
  </QueryClientProvider>
);