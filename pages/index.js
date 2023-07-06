import Content from "@/components/Content"
import { useSession } from "next-auth/react"

export default function Home() {
    const {data: session} = useSession();

    return <Content>
        <div className="flex font-bold text-xl">
            Logged in as: 
            <div className="flex items-center ml-4">
                <img className="w-6 h-6 mr-2 rounded-xl" src={session?.user?.image} />
                {session?.user?.email}
            </div>
        </div>
    </Content>
}
