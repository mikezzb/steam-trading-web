"use client";
import { login, signup } from "@/apis";
import Loading from "@/components/loading";
import TextField from "@/components/textfield";
import { useUserContext } from "@/stores";
import styles from "@/styles/pages/login.module.scss";
import { Button, Paper, Tab, Tabs } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { FC, useEffect, useReducer, useState } from "react";
import { pick, union } from "lodash-es";
import { useRouter } from "next/navigation";

type LoginFormProps = {
  onSubmit: (form: any) => void;
  fields: string[];
  loading?: boolean;
};

const LOGIN_FIELDS = ["email", "password"];
const REGISTER_FIELDS = ["username", "email", "password"];

const LoginForm: FC<LoginFormProps> = ({ onSubmit, fields, loading }) => {
  const [form, setForm] = useReducer(
    (state: any, newState: any) => ({ ...state, ...newState }),
    {
      username: "",
      email: "",
      password: "",
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const requiredFields = fields.filter((field) => !form[field]);
    if (requiredFields.length) {
      requiredFields.forEach((field) => {
        newErrors[field] = "Required";
      });
    }
    setErrors(newErrors);
    return !requiredFields.length;
  };

  const handleChange = (e: any, label: string) => {
    setForm({ [label]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className={clsx(styles["form"], "column")}>
      {fields.map((field) => (
        <TextField
          key={field}
          type={field === "password" ? "password" : "text"}
          label={field}
          value={form[field]}
          onChange={(e) => handleChange(e, field)}
          error={errors[field]}
        />
      ))}
      <Button type="submit" variant="contained">
        {loading ? <Loading /> : "Submit"}
      </Button>
    </form>
  );
};

const LoginPage: FC = () => {
  const userStore = useUserContext();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const loginMutation = useMutation({
    mutationFn: login,
  });

  const signupMutation = useMutation({
    mutationFn: signup,
  });

  const onFormSubmit = (form: any) => {
    // filter out invalid fields
    form = pick(form, isLogin ? LOGIN_FIELDS : REGISTER_FIELDS);
    if (isLogin) {
      loginMutation.mutate(form);
    } else {
      signupMutation.mutate(form);
    }
  };

  useEffect(() => {
    const data = loginMutation.data ?? signupMutation.data;
    if (data) {
      userStore.login(data.user, data.token);
      // redirect to previous page
      const redirect = new URLSearchParams(window.location.search).get(
        "redirect"
      );
      router.push(redirect || "/");
    }
  }, [loginMutation.data, signupMutation.data, userStore, router]);

  return (
    <div className={clsx(styles["login-page"], "column center")}>
      <Paper elevation={1} className={clsx(styles["login-card"], "column")}>
        <Tabs
          className={clsx(styles["tabs"])}
          value={isLogin ? "login" : "signup"}
          onChange={(e, value) => setIsLogin(value === "login")}
          textColor="secondary"
          indicatorColor="secondary"
        >
          <Tab label="Login" value="login" />
          <Tab label="Sign Up" value="signup" />
        </Tabs>
        <LoginForm
          fields={isLogin ? LOGIN_FIELDS : REGISTER_FIELDS}
          onSubmit={onFormSubmit}
          loading={loginMutation.isPending || signupMutation.isPending}
        />
      </Paper>
    </div>
  );
};

export default observer(LoginPage);
