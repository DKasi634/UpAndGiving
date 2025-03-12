import { ReactElement } from "react"

export type MenuItemType = {
    icon:ReactElement,
    label:string,
    name:string,
    path:string
}

type MenuItemProps = {
    className?:string,
    item:MenuItemType
}

const MenuItem = ({className="", item}:MenuItemProps) => {
  return (
    <div className={`${className} flex items-center justify-start gap-2 px-2 py-2 text-black/70 hover:text-blue-600 cursor-pointer hover:bg-black/5 rounded-lg transition-all min-w-full`}>
        <span className="text-2xl px-2 lg:px-1">{item.icon}</span>
        <span className="text-xs font-bold hidden lg:inline-block">{item.label}</span>
    </div>
  )
}

export default MenuItem