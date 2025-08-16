import useSWR from "swr";
import { UsersAPI } from "../services/api";

const KEY = "/users";

const fetcher = () => UsersAPI.list();

export function useUsers() {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    KEY,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  const createUser = async (payload) => {
    const created = await UsersAPI.create(payload);
    await mutate((current) => [...(current || []), created], {
      revalidate: false,
    });
    return created;
  };

  const updateUser = async (id, payload) => {
    const updated = await UsersAPI.update(id, payload);
    await mutate(
      (current) => (current || []).map((u) => (u.id === id ? updated : u)),
      { revalidate: false }
    );
    return updated;
  };

  const deleteUser = async (id) => {
    await UsersAPI.remove(id);
    await mutate((current) => (current || []).filter((u) => u.id !== id), {
      revalidate: false,
    });
  };

  const refresh = () => mutate();

  return {
    users: data || [],
    error,
    isLoading,
    isValidating,
    createUser,
    updateUser,
    deleteUser,
    refresh,
  };
}
