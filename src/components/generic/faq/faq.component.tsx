import { FaAngleDown, FaAngleUp } from "react-icons/fa"

import { useState } from "react"
import { Card } from "../card/card.component";

export interface IFaq  {
  question:string,
  answer:string
}

type FaqProps = {
  className?:string,
  faq:IFaq
}

const Faq = ({className="", faq}:FaqProps) => {

    const [IsToggled, setIsToggled] = useState(false);
    const toggleFaq = () =>{
        setIsToggled(!IsToggled);
    }
  return (
    <Card className={`${className} rounded-lg relative flex flex-col items-center justify-start text-left h-fit p-4 gap-4`}>
        <p className={`text-lg font-semibold text-left w-full ${!IsToggled && 'line-clamp-1'}`}>{faq.question} </p>
        { IsToggled &&  <p className="text-left text-sm animate-slide-in">{faq.answer}</p> }
        <span className="absolute top-2 right-2 cursor-pointer p-1 text-xl " onMouseDown={toggleFaq}>
            { IsToggled ?  <FaAngleUp/>: <FaAngleDown/> }
        </span>
        
    </Card>
  )
}

export default Faq