import { createTRPCProxyClient, httpLink } from "@trpc/client";
import type { AppRouter } from "./routes";
import SuperJSON from "superjson";
import { useState } from "react";

export const client = createTRPCProxyClient<AppRouter>({
  transformer: SuperJSON,
  links: [httpLink({ url: `/api/trpc` })],
});

export const useAPI = <K extends (...args: any[]) => Promise<any>>(
  fn: K,
  options?: { onSuccess?: (data: Awaited<ReturnType<K>>) => void },
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<Awaited<ReturnType<K>> | null>(null);
  const mutate = async (...args: Parameters<K>): Promise<Awaited<ReturnType<K>>> => {
    setIsLoading(true);
    setError(null);
    setData(null);
    try {
      const result = await fn(...args);
      setData(result);
      if (options?.onSuccess) options.onSuccess(result);
      return result;
    } catch (error) {
      setError(error as any);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  return { isLoading, error, data, mutate };
};
