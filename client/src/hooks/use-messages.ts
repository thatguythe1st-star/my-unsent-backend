import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type MessageInput } from "@shared/routes";

// GET /api/messages
export function useMessages(search?: string, sort?: 'newest' | 'oldest') {
  return useQuery({
    queryKey: [api.messages.list.path, search, sort],
    queryFn: async () => {
      const url = buildUrl(api.messages.list.path);
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (sort) params.append("sort", sort);
      
      const res = await fetch(`${url}?${params.toString()}`, { credentials: "include" });
      if (!res.ok) throw new Error('Failed to fetch messages');
      return api.messages.list.responses[200].parse(await res.json());
    },
  });
}

// GET /api/messages/:id
export function useMessage(id: number) {
  return useQuery({
    queryKey: [api.messages.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.messages.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error('Failed to fetch message');
      return api.messages.get.responses[200].parse(await res.json());
    },
  });
}

// POST /api/messages
export function useCreateMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: MessageInput) => {
      const validated = api.messages.create.input.parse(data);
      const res = await fetch(api.messages.create.path, {
        method: api.messages.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.messages.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error('Failed to create message');
      }
      return api.messages.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.messages.list.path] });
    },
  });
}
