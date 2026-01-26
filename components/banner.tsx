import Link from "next/link";

export function Banner(){
    return <div className="w-full bg-primary font-bold text-white p-1 text-center text-sm">
        Know a great one-time purchase or free app/tool? → <Link href={"/submit"}>Submit it</Link>
    </div>
}