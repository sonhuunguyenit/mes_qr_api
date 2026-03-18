// import { userService } from "~/services/user/user.service";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useWaiting } from "./useWaiting";

const useUserInfo = (id?: string, options?: { showLoader?: boolean }) => {
  // const { start, stop } = useWaiting();
  // const showLoader = options?.showLoader ?? true;
  // const { isError, data, error, isLoading } = useQuery({
  //   queryKey: ["userInfo", id],
  //   queryFn: async () => userService.getUserInfo({ id: id! }),
  //   enabled: !!id,
  // });
  // useEffect(() => {
  //   if (showLoader) {
  //     if (id && isLoading) {
  //       start();
  //     } else {
  //       stop();
  //     }
  //   } else if (!id) {
  //     // If id is null (logout), ensure we stop any active loader
  //     stop();
  //   }
  // }, [id, isLoading, showLoader, start, stop]);
  // return {
  //   isError,
  //   data,
  //   error,
  //   isLoading,
  // };
};

export default useUserInfo;
