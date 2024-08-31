import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { UserAuthForm } from "@/app/authentication/components/user-auth-form"

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
}

export default function AuthenticationPage() {
  return (
    <>
      <div className="container p-0 h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 inset-0 bg-gradient-to-tl to-neutral-900 from-orange-700">
        <div className="lg:p-8 w-screen h-full flex justify-center items-center">
          <div className="flex w-full flex-col justify-center space-y-6 sm:w-[350px] md:w-[450px] rounded-lg md:bg-[hsl(28,93%,8%,38%)] p-10">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-white">
                Let's craft your email
              </h1>
            </div>
            <UserAuthForm />
          </div>
        </div>
      </div>
    </>
  )
}
