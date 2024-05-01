"use client";
import { redirect } from "next/navigation";
import { FC } from "react";

const Home: FC = () => {
  redirect("/items");
};

export default Home;
