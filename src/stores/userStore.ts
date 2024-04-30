import { AuthState } from "@/types/ui";
import PersistedStore from "./PersistedStore";

const onLoadKeys = ["user", "token"];
const onResetKeys = onLoadKeys;

class UserStore extends PersistedStore {
  public user?: User;
  public token?: string;
  public authState: AuthState = AuthState.INIT;

  constructor() {
    super(onLoadKeys, onResetKeys);
  }

  public get loggedIn() {
    return !!this.user;
  }

  setUser(user: User) {
    this.set("user", user);
  }

  setToken(token: string) {
    this.set("token", token);
  }

  setAuthState(authState: AuthState) {
    this.set("authState", authState);
  }
}

export default UserStore;
