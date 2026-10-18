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
        throw new Error(active ? "فشل تفعيل الطالب" : "فشل تعطيل الطالب");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });

  const disablePatient = (id: string, active = false) =>
    toast.promise(mutation.mutateAsync({ id, active }), {
      loading: active ? "جارٍ تفعيل الطالب..." : "جارٍ تعطيل الطالب...",
      success: active ? "تم تفعيل الطالب بنجاح" : "تم تعطيل الطالب بنجاح",
      error: (err: Error) =>
        err.message || (active ? "فشل تفعيل الطالب" : "فشل تعطيل الطالب"),
    });

  return { disablePatient, isPending: mutation.isPending };
};
