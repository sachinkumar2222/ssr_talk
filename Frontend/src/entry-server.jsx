import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
  dehydrate,
} from "@tanstack/react-query";
import App from "./App.jsx";
import {
  getAuthUser,
  getUserFriends,
  getRecommUser,
  getOutgoingFriendReqs,
} from "./lib/api.js";

export async function render(url, req) {
  console.log(`[SSR] Rendering URL: ${url}`);

  const queryClient = new QueryClient();
  const cookie = req.headers.cookie;

  const isPublicRoute =
    url.startsWith("/login") ||
    url.startsWith("/signup") ||
    url.startsWith("/forgot-password") ||
    url.startsWith("/reset-password");

  if (isPublicRoute) {
    queryClient.setQueryData(["authUser"], null);
  } else {

    try {

      await queryClient.prefetchQuery({
        queryKey: ["authUser"],
        queryFn: () => getAuthUser(cookie),
      });

      if (url.startsWith("/friends")) {
        await queryClient.prefetchQuery({
          queryKey: ["friends"],
          queryFn: () => getUserFriends(cookie),
        });
      } else if (url === "/") {
        await Promise.all([
          queryClient.prefetchQuery({
            queryKey: ["user"],
            queryFn: () => getRecommUser(cookie),
          }),
          queryClient.prefetchQuery({
            queryKey: ["outgoingFriendReqs"],
            queryFn: () => getOutgoingFriendReqs(cookie),
          }),
        ]);
      }
    } catch (error) {
      console.error(
        `[SSR] Initial data fetch failed for ${url}. Client will take over.`,
        error.message
      );
    }
  }

  const dehydratedState = dehydrate(queryClient);

  const appHtml = renderToString(
    <QueryClientProvider client={queryClient}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </QueryClientProvider>
  );

  return { appHtml, dehydratedState };
}

