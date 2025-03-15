
import { FaInstagram, FaWhatsapp } from "react-icons/fa"
import { LogoContainer, FooterWrapper } from "@/styles/global.styles"
import { Link } from "react-router-dom"
import { FiLinkedin, FiMail } from "react-icons/fi"
import SectionContainer from "../section-container.component"

const Footer = () => {
    return (
        <FooterWrapper>
            <SectionContainer className="container footer__container">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
                    <LogoContainer>
                        <Link className="bg-blue-600 border-white w-12 aspect-square rounded-full flex items-center justify-center" to="/">
                            {/* <img src={Logo} alt="logo" /> */}
                            <span className="text-white/90 text-xl">Up</span>
                        </Link>
                    </LogoContainer>
                    <ul className="socials flex items-center justify-center gap-4">
                        <li><Link className="text-3xl" to={'https://linkedin.com'} target="_blank" rel="noopener noreferrer"><FiLinkedin /></Link> </li>
                        <li><Link className="text-3xl" to={'https://we.me/+243975623008'} target="_blank" rel="noopener noreferrer"><FaWhatsapp /></Link> </li>
                        <li><Link className="text-3xl" to={'https://instagram.com'} target="_blank" rel="noopener noreferrer"><FaInstagram /></Link> </li>
                        <li><Link className="text-3xl" to={'mailto:dkasi634@gmail.com'} target="_blank" rel="noopener noreferrer"><FiMail /></Link> </li>
                    </ul>
                </div>
                <p className="text-sm text-white font-normal text-center w-full mt-6">{new Date().getFullYear()} &copy; DanKasi, All rights reserved</p>
            </SectionContainer>
        </FooterWrapper>
    )
}

export default Footer

