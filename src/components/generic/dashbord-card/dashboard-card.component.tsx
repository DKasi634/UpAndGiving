import { ReactElement } from "react"

type DashBoardCardProps = {
    className?: string,
    title: string,
    icon: ReactElement,
    figure: number,
    subtitle: string,
}

const DashBoardCard = ({ className = "", title, icon, figure, subtitle }: DashBoardCardProps) => {
    return (
        <div className={`${className} p-4 rounded-2xl flex flex-col bg-gradient-to-tr from-indigo-500/50 via-violet-800/50 to-pink-500/60 w-full lg:max-w-[12rem]`}>
            <div className="flex items-center w-full justify-between">
                <span className="font-semibold text-white text-wrap text-sm">
                    {title}
                </span>
                <span className="p-2 rounded-lg bg-white/30 backdrop-blur-2xl flex items-center justify-center text-lg text-black">
                    {icon}
                </span>
            </div>
            <div className="flex flex-col justify-start items-start gap-2 pt-[3rem]">
                <span className="text-5xl font-extrabold text-white">{figure}+</span>
                <span className="text-xs font-bold text-white">
                    {subtitle}
                </span>
            </div>
        </div>
    )
}

export default DashBoardCard