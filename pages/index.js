import { useSession, signIn, signOut } from "next-auth/react"

export default function Home() {
    const { data: session } = useSession()

    if(!session) {
        return (
            <div className="flex items-center w-screen h-screen bg-gradient-to-r from-blue-500 from-10% via-sky-500 via-30% to-cyan-500 to-90%">
                <div className="text-center flex w-full justify-center">
                    <div className="text-center w-[320px] backdrop-blur-xl bg-white/30 p-5 rounded-md border-white/20 border-4">
                        <button 
                            className="bg-white py-3 px-6 rounded-md"
                            onClick={() => signIn('google')}>
                                Login with Google
                            </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex w-screen h-screen bg-gradient-to-r from-blue-500 from-10% via-sky-500 via-30% to-cyan-500 to-90%">
            i'm logged in as {session.user.email}
        </div>
    )
}
