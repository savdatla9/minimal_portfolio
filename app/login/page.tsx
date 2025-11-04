import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="tw-:flex tw-:min-h-svh tw-:flex-col tw-:items-center tw-:justify-center tw-:bg-muted tw-:p-6 tw-:md:p-10">
      <div className="tw-:w-full tw-:max-w-sm tw-:md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  )
}
