import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";

export const useDisablePatient = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const res = await api.patients({ id }).patch({
        active,
        status: active ? "ACTIVE" : "SUSPENDED",
      });
      if (res.error)
        throw new Error(active ? "فشل تفعيل الطفل" : "فشل تعطيل الطفل");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });

  const disablePatient = (id: string, active = false) =>
    toast.promise(mutation.mutateAsync({ id, active }), {
      loading: active ? "جارٍ تفعيل الطفل..." : "جارٍ تعطيل الطفل...",
      success: active ? "تم تفعيل الطفل بنجاح" : "تم تعطيل الطفل بنجاح",
      error: (err: Error) =>
        err.message || (active ? "فشل تفعيل الطفل" : "فشل تعطيل الطفل"),
    });

  return { disablePatient, isPending: mutation.isPending };
};
