import { IDonation } from "@/api/types"

export type DonationItemType = {
    date:string,
    time:string,
    name:string,
    status:"completed"|"pending"|"failed"
}

type DonationItemProps = {
    className?:string,
    item:IDonation 
}

const DonationItem = ({className = "", item}:DonationItemProps) => {

    const formattedDate  = new Date(item.created_at).toLocaleDateString('en-GB', {
        year:"numeric", month:"short", day:"2-digit"
    })

    const formattedTime  = new Date(item.created_at).toLocaleTimeString('en-GB', {
        hour:"2-digit", minute:"2-digit", second:"2-digit", hour12:true
    })
    return (
        <div className={`${className} flex items-center justify-start w-full gap-6 py-2 px-2 border-black/30 border-b-[0.1rem]`}>
            <div className="flex flex-col items-start justify-start max-w-[4rem] w-full">
                <span style={{fontSize:"0.7rem"}} className="font-normal">{formattedDate}</span>
                <span style={{fontSize:"0.7rem"}} className="font-bold">{formattedTime}</span>
            </div>
            <div className="flex items-center justify-start gap-2">
                <span className="text-sm font-bold text-black/80 line-clamp-1 text-left">{item.name}</span>
                <span className={`text-xs px-3 py-[0.2rem] rounded-xl font-light ${ item.status === "ACCEPTED" ? ' bg-green-600/70': item.status === "PENDING"?'bg-indigo-950/40':'bg-orange-600/60'} text-white font-light`}>{item.status}</span>
            </div>
        </div>
    )
}

export default DonationItem