
import { Outlet , Link, useNavigate} from "react-router-dom"
import { LogoContainer, LandingNavWrapper } from "@/styles/global.styles"

import Footer from "@/components/generic/footer/footer.component"
import BaseButton, { buttonType } from "@/components/generic/base-button/base-button.component"
import SectionContainer from "@/components/generic/section-container.component"

const LandingNavigation = () => {

    const navigate = useNavigate();
    const handleNavigateToDonate = () =>{
        navigate("/me/donate")
    }

  return (
    <>
        <LandingNavWrapper className="backdrop-blur-lg">
            <SectionContainer className="container nav__container flex items-center justify-between px-4">
                <LogoContainer>
                    <Link className="bg-white w-12 aspect-square border-2 p-1 border-black/80 rounded-full flex items-center justify-center text-xl" to="/">
                    {/* <img src={Logo} alt="logo" /> */}
                    <span className="text-indigo-600/90">U</span><span className="text-green-600/90">p</span>
                    </Link>
                </LogoContainer>
                <div className="nav__actions flex items-center justify-center gap-2">
                    <BaseButton type={buttonType.dark} href="/me/dashboard" className="rounded-3xl">My Dashboard</BaseButton>
                    <BaseButton clickHandler={handleNavigateToDonate}  className=" rounded-3xl">Donate</BaseButton>
                </div>
            </SectionContainer>
        </LandingNavWrapper>
        <main>
            <Outlet/>
        </main>
        <Footer/>
    
    </>
  )
}

export default LandingNavigation