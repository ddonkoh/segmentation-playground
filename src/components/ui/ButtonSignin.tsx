"use client";

import Link from "next/link";
import config from "@/config";

const ButtonSignin = ({ text = "Get started", extraStyle = "" }: { text?: string; extraStyle?: string }) => {
  return (
    <Link href={config.auth.loginUrl} className={`btn ${extraStyle ? extraStyle : ""}`}>
      {text}
    </Link>
  );
};

export default ButtonSignin;
