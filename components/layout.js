import Nav from "@/components/nav";
import { useSession, signIn, signOut } from "next-auth/react"

export default function Layout({children}) {
  const { data: session } = useSession();
  if(!session){
    return (
      <div className="wrapper w-screen h-screen flex items-center">
        <div className="text-center w-full">
          <button onClick={() => signIn('google')} className="bg-white p-2 px-4 rounded-lg">Login with Google</button>
        </div>
      </div>
    )
  }
  return (
    <>
      <div className="wrapper min-h-screen flex flex-col sm:flex-row">
        <Nav />
        <div className="content">
          {/* Signed in as {session.user.email} <br/> */}
          {children}
          {/* <button onClick={() => signOut()}>Sign out</button> */}
        </div>
      </div>
    </>
  )
}