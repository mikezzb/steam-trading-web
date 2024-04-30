import { getUserByToken } from "@/apis";
import { useUIContext, useUserContext } from "@/stores";
import { AuthState } from "@/types/ui";
import { useQuery } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import Loading from "./loading";

type Options = {};

type HOC = (Component: FC<any>, options?: Options) => FC;

/** Guard route to check if user is authenticated */
const guard: HOC = (Component, options = {}) => {
  const Guard: FC = (props) => {
    const [authState, setAuthState] = useState(AuthState.INIT);
    const userStore = useUserContext();
    const uiStore = useUIContext();
    const router = useRouter();

    const { isPending, error, data, refetch } = useQuery({
      queryKey: ["user"],
      queryFn: getUserByToken,
      enabled: false,
    });

    useEffect(() => {
      // If no prev login data, then redirect to login page
      if (!userStore.token) {
        setAuthState(AuthState.LOGGED_OUT);
        return;
      }
      // If logged in for current session, then return component
      if (userStore.loggedIn) {
        setAuthState(AuthState.LOGGED_IN);
        return;
      }
      // If has prev token but not logged in, then check if token valid
      else {
        refetch();
        setAuthState(AuthState.PENDING);
        return;
      }
    }, [userStore.token, userStore.loggedIn, refetch]);

    useEffect(() => {
      userStore.setAuthState(authState);
      switch (authState) {
        case AuthState.LOGGED_OUT:
          // Redirect to login page
          router.push("/login");
          break;
        default:
          break;
      }
    }, [userStore, authState, router]);

    useEffect(() => {
      if (data) {
        userStore.setUser(data);
        setAuthState(AuthState.LOGGED_IN);
      }
    }, [data, userStore]);

    const renderContent = () => {
      switch (authState) {
        case AuthState.LOGGED_IN:
          return <Component {...props} />;
        case AuthState.LOGGED_OUT:
          return null;
        default:
          return <Loading />;
      }
    };

    return renderContent();
  };

  return observer(Guard);
};

export default guard;
