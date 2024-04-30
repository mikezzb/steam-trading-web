import { AuthState } from "@/types/ui";
import PersistedStore from "./PersistedStore";
import { User } from "@/types/transformed";
import { computed, makeObservable, observable } from "mobx";
import { getUserByToken } from "@/apis";
import UIStore from "./uiStore";
import { handleError } from "@/utils/handlers";

const onLoadKeys = ["token"];
const onResetKeys = onLoadKeys;

class UserStore extends PersistedStore {
  public user?: User = undefined;
  public token: string = "";
  public authState: AuthState = AuthState.INIT;

  constructor(public readonly uiStore: UIStore) {
    super(onLoadKeys, onResetKeys);
    makeObservable(this, {
      user: observable,
      token: observable,
      authState: observable,
      loggedIn: computed,
      loading: computed,
    });
  }

  public get loading() {
    return (
      this.authState === AuthState.PENDING || this.authState === AuthState.INIT
    );
  }

  public get loggedIn() {
    return !!this.user;
  }

  async init() {
    super.init();

    // if token is present, then fetch user data
    await this.fetchUser();
    if (this.authState !== AuthState.LOGGED_IN) {
      this.setAuthState(AuthState.LOGGED_OUT);
    }
  }

  async fetchUser() {
    if (!this.token) {
      return;
    }
    try {
      const data = await getUserByToken();
      this.setUser(data.user);
    } catch (e: any) {
      handleError(new Error("Failed to fetch user data"));
    }
  }

  setUser(user: User) {
    this.update("user", user);
    this.setAuthState(AuthState.LOGGED_IN);
  }

  setToken(token: string) {
    this.set("token", token);
  }

  setAuthState(authState: AuthState) {
    this.set("authState", authState);
  }

  logout() {
    this.remove("user");
    this.remove("token");
  }

  login(user: User, token: string) {
    this.setUser(user);
    this.setToken(token);
  }
}

export default UserStore;
