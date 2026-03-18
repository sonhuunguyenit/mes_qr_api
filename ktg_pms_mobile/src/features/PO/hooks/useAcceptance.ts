import { useQuery } from "@tanstack/react-query";
import { acceptanceService } from "~/services/acceptance/acceptance.service";
import { AcceptanceFilterParams } from "~/services/acceptance/acceptance.type";

export const useAcceptanceList = (params: AcceptanceFilterParams) => {
  return useQuery({
    queryKey: ["acceptance-list", params],
    queryFn: () => acceptanceService.getAcceptanceList(params),
    select: (res: any) => {
      const [data, total] = res.data || [[], 0];
      return { data, total };
    },
  });
};
