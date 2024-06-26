"use client";
import axios from "axios";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { AiOutlineLoading } from "react-icons/ai";
import { BsGithub } from "react-icons/bs";
import { toast } from "sonner";
import Inputs from "../../../components/ui/inputs/inputs";
import { Button } from "../../../components/ui/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/shadcn/card";
import { SafeUser } from "../../types";

type LoginFormType = {
  currentUser: SafeUser | null;
};

export default function RegisterForm({ currentUser }: LoginFormType) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
  });

  // Register function
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    toast("Creating an account, please wait...");
    console.log("form data: ", data);

    axios
      .post("/api/register", data)
      .then(() => {
        signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        }).then((callback) => {
          setIsLoading(false);
          if (callback?.ok) {
            toast.success("Account successfully created");
            router.push("/");
            router.refresh();
          }
          if (callback?.error) {
            toast.error("Error creating account");
          }
        });
      })
      .catch(() => toast.error("Something went wrong"))
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Redirection to home page when user is logged
  useEffect(() => {
    if (currentUser) {
      router.push("/");
      router.refresh();
    }
  }, [currentUser, router]);

  return (
    <div>
      <main className="mx-auto max-w-6xl font-bold text-black max-xl:px-8">
        <div className="pt-24"></div>
        <div className="m-auto w-3/4 max-sm:w-full"></div>
        <Card className="mx-auto max-w-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              Create an account
            </CardTitle>
            <CardDescription>
              Enter your name, email and password to register your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Inputs
              id="name"
              label="Name"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
            />
            <Inputs
              id="email"
              label="Email"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              type="email"
              validation={{
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Please enter a valid email address.",
                },
              }}
            />
            <Inputs
              id="password"
              disabled={isLoading}
              label="Password"
              register={register}
              errors={errors}
              required
              type="password"
              validation={{
                minLength: {
                  value: 8,
                  message: "Password must have at least 8 characters",
                },
              }}
            />
            <Button className="mt-4 w-full" onClick={handleSubmit(onSubmit)}>
              {isLoading ? (
                <>
                  <AiOutlineLoading className="mr-2 inline-block animate-spin" />
                  Signing up...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
            <div className="p-6 text-center text-xs text-gray-600">
              OR CONTINUE WITH
            </div>
            <Button
              className="w-full gap-3 border bg-transparent px-7"
              onClick={() => signIn("google")}
            >
              <span>
                <Image
                  src="/assets/GOOGLE-icon.png"
                  width={20}
                  height={20}
                  alt="google icon"
                ></Image>{" "}
              </span>
              Google
            </Button>
            <Button
              className="mt-4 w-full gap-3 border bg-transparent px-7"
              onClick={() => signIn("github")}
            >
              <span>
                <BsGithub size={20} />
              </span>
              Github
            </Button>
            <p className="pt-4 text-center text-sm font-semibold">
              Already a account?{" "}
              <Link href="/login" className="underline">
                Log in
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
