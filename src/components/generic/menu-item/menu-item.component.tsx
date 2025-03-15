import { ReactElement } from "react"
import { NavLink } from "react-router-dom"

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
    <NavLink to={item.path} className={({isActive}) =>  `${className} flex items-center justify-start gap-2 px-2 py-2 text-black/70 ${isActive && 'text-blue-600 bg-black/15'} hover:text-blue-600 cursor-pointer hover:bg-black/15 rounded-lg transition-all min-w-full`}>
        <span className="text-2xl px-1">{item.icon}</span>
        <span className="text-xs font-bold hidden lg:inline-block">{item.label}</span>
    </NavLink>
  )
}

export default MenuItem