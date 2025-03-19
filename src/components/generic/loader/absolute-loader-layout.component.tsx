import LoaderItem from "./loader.component"


const AbsoluteLoaderLayout = () => {
  return (
    <div className="absolute inset-0 w-full h-full bg-white/40 backdrop-blur-sm flex items-center justify-center z-40"><LoaderItem className="!border-[0.2rem]"/></div>
  )
}

export default AbsoluteLoaderLayout