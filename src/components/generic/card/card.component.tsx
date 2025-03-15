import React from "react"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    className?:string,
}

const Card:React.FC<CardProps> = ({ className="", ...props }) => (
    <div
      className={`${className} rounded-xl border bg-card text-card-foreground shadow p-4`}
      {...props} />
  )

  
const CardHeader:React.FC<CardProps> = ({ className="", ...props }) => (
    <div 
      className={`${className} flex flex-col space-y-1.5 p-6", className`}
      {...props} />
  )
CardHeader.displayName = "CardHeader"
  
const CardTitle:React.FC<CardProps> = ({ className="", ...props }) => (
    <div
      className={`${className} font-semibold leading-none tracking-tight", className`}
      {...props} />
  )
CardTitle.displayName = "CardTitle"
  

  const CardDescription:React.FC<CardProps> = ({ className="", ...props }) => (
    <div 
      className={`${className} text-sm text-muted-foreground", className`}
      {...props} />
  )
CardDescription.displayName = "CardDescription"
  
const CardContent: React.FC<CardProps> = ({ className="", ...props }) => (
    <div  className={`${className} p-6 pt-0", className`} {...props} />
  )
  CardContent.displayName = "CardContent"
  
  const CardFooter:React.FC<CardProps> = ({ className="", ...props }) => (
    <div 
      className={`${className} flex items-center p-6 pt-0", className`}
      {...props} />
  )
  CardFooter.displayName = "CardFooter"
  

  export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

