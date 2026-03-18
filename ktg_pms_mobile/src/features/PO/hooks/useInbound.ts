import { useQuery } from "@tanstack/react-query";
import { inboundService } from "~/services/inbound/inbound.service";
import { InboundFilterParams } from "~/services/inbound/inbound.type";

export const useInboundList = (params: InboundFilterParams) => {
  return useQuery({
    queryKey: ["inbound-list", params],
    queryFn: () => inboundService.getInboundList(params),
    select: (res: any) => {
      const [data, total] = res.data || [[], 0];
      return { data, total };
    },
  });
};
