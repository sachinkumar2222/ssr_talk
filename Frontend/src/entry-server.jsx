import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router"; 
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.jsx";

export function render(url) {
  const queryClient = new QueryClient();

  return ReactDOMServer.renderToString(
    <QueryClientProvider client={queryClient}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </QueryClientProvider>
  );
}
