import { useSession, signIn } from "next-auth/react"
import Nav from "@/components/Nav"

export default function Content({children}) {
    const { data: session } = useSession()
    if(session === undefined) {
        return;
    }
    
    if(!session) {
        return (
            <div className="flex items-center w-screen min-h-screen bg-gradient-to-r from-blue-500 from-10% via-sky-500 via-30% to-cyan-500 to-90%">
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
        );
    }

    return (
        <div className="min-h-screen flex bg-gradient-to-r from-blue-500 from-10% via-sky-500 via-30% to-cyan-500 to-90% flex-wrap md:flex-nowrap">
            <Nav />
            <div className="min-h-[540px] h-fit flex-grow m-2 mb-8 p-4 bg-white/60 rounded-md border-white/30 border-4">
                {children}
            </div>
        </div>
    )
}
