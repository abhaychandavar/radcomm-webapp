"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IconBrandGoogleFilled, IconMailFilled } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import authService from '../../../services/auth';
import validator from "validator";
import config from '../../../config/config';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [loginMethod, setLoginMethod] = useState<'emailPass' | 'google' | null>(null);
  const [authCreds, setAuthCreds] = useState<{
    email: string,
    password: string
  }>({
    email: '',
    password: ''
  });
  const [authErrors, setAuthErrors] = useState<{
    email?: string,
    password?: string
  }>({});
  const passwordRef = React.useRef<HTMLInputElement>(null);
  
  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
  }

  const validateEmail = (email: string) => {
    if (!validator.isEmail(authCreds.email)) {
      setAuthErrors((prev) => ({
        ...prev,
        email: 'Oops! Your email ID is feeling shy. Give it a nudge and try again!'
      }));
      return false;
    }
    return true;
  }

  const validatePassword = (password: string) => {
    if (!validator.isStrongPassword(authCreds.password)) {
      setAuthErrors((prev) => ({
        ...prev,
        password: 'Caps, numbers, symbols, and 8+ characters. Spice it up!'
      }));
      return false;
    }
    return true;
  }

  const clearAllErrors = () => {
    setAuthErrors({});
  }
  useEffect(() => {
    console.log('loginMethod', loginMethod)
    if (loginMethod === 'emailPass') {
      passwordRef.current?.focus()
    }
  }, [loginMethod])
  
  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 outline-none placeholder:text-[#AD8C70] text-white p-6 bg-[hsl(28,92%,32%,20%)] transition-all"
              onChange={(e) => {
                setAuthCreds((prev) => ({
                  ...prev,
                  email: e.target.value
                }));
                setAuthErrors((prev) => ({
                  ...prev,
                  email: undefined
                }));
              }}
              error={
                {
                  message: authErrors.email,
                }
              }
            />
          </div>
          <div className={`gap-1 ${loginMethod === 'emailPass' ? 'grid' : 'hidden'}`}>
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="Password"
              type="password"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isLoading}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 outline-none placeholder:text-[#AD8C70] text-white p-6 bg-[hsl(28,92%,32%,20%)] transition-all"
              ref={passwordRef}
              onChange={(e) => {
                setAuthCreds((prev) => ({
                  ...prev,
                  password: e.target.value
                }));
                setAuthErrors((prev) => ({
                  ...prev,
                  password: undefined
                }));
              }}
              error={
                {
                  message: authErrors.password,
                }
              }
            />
          </div>
          <Button disabled={isLoading} size={'lg'} className={`p-6 ${loginMethod === 'emailPass' ? 'visible' : 'hidden'} transition-all`} onClick={() => {
            if (!validateEmail(authCreds.email) || !validatePassword(authCreds.password)) return;
            authService.signinWithEmail(authCreds.email, authCreds.password);
          }}>
            Continue
          </Button>
          <Button disabled={isLoading} variant={'secondary'} size={'lg'} className={`p-6 ${loginMethod === 'emailPass' ? 'visible' : 'hidden'} bg-[hsl(28,92%,32%,55%)] transition-all`}
            onClick={() => {setLoginMethod(null); clearAllErrors();}}
          >
            Cancel
          </Button>
          <Button disabled={isLoading} size={'lg'} className={`p-6 ${!loginMethod ? 'visible' : 'hidden'} transition-all`} onClick={() => {
            if (!validateEmail(authCreds.email)) return;
            setLoginMethod('emailPass');
          }}>
            Sign In with Email
          </Button>
          <Button disabled={isLoading} variant={'secondary'} size={'lg'} className={`p-6 ${!loginMethod ? 'visible' : 'hidden'} bg-[hsl(28,92%,32%,55%)] transition-all`}
            onClick={() => {
              // redirect to oauth login page
              window.location.href = `${config.apiBaseUrl}/auth/oauth/google/login`;
            }}
          >
            <IconBrandGoogleFilled className="mr-2 h-4 w-4"/>Continue with Google
          </Button>
        </div>
      </form>
    </div>
  )
}
