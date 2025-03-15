
import { HeroImage } from "@/assets";
import CardsCarousel from "@/components/generic/cards-carousel/cards-carousel.component";
import { aboutUsInfo, faqs, processSteps } from "@/constants";

import { GridMdColsContainer } from "@/styles/global.styles";
import { Card, CardContent } from "@/components/generic/card/card.component";
import Faq from "@/components/generic/faq/faq.component";
import BaseButton, { buttonType } from "@/components/generic/base-button/base-button.component";
import SectionContainer from "@/components/generic/section-container.component";

const HomePage = () => {

  return (
    <>
      <section className="hero mt-28">
        <SectionContainer className="hero__container grid sm:grid-cols-1 lg:grid-cols-2 gap-4 ">
          <aside className="left flex flex-col justify-start items-center gap-4 text-left">
            <h2 className="font-semibold text-4xl mb-6">Don't need it anymore ? Someone else near you might</h2>
            <p className="text-lg font-normal">Share your surplus, reduce waste, and strengthen your community by helping those in need because — <span className="text-black/70 font-extrabold text-lg !underline !underline-offset-2">every little bit helps.</span></p>
            <div className="flex items-center justify-between md:justify-start w-full gap-12 pt-12">
              <BaseButton type={buttonType.green} className="hover:!bg-white hover:!text-green-500">Find NearBy</BaseButton>
              <BaseButton>Share Food</BaseButton>
            </div>
          </aside>
          <aside className="right hidden lg:flex">
            <img src={HeroImage} alt="" />
          </aside>
        </SectionContainer>
      </section>

      <section className="mb-6">
        <SectionContainer className="container explanation_container">
          <h2 className="font-semibold text-4xl my-6 w-full text-center">How it works</h2>
          <CardsCarousel steps={processSteps} />
        </SectionContainer>
      </section>

      <section id="about_us" className="mb-6">
        <SectionContainer className="container about_us_container">
          <h2 className="font-semibold text-4xl my-6 w-full text-center">Who we are</h2>
          <GridMdColsContainer>
            {
              aboutUsInfo.map(({ title, description, icon }, index) => {
                return (
                  <Card key={index}>
                    <div className="flex flex-col items-center justify-center">
                      <div className="icon text-4xl text-blue-600 mb-4 text-left">{icon}</div>
                      <div className="font-bold text-xl mb-2">{title}</div>
                    </div>
                    <CardContent><p className='line-clamp-3'>{description}</p></CardContent>
                  </Card>
                )
              })
            }
          </GridMdColsContainer>
        </SectionContainer>
      </section>

      <section id="faqs" className="mb-6">
            <SectionContainer className="container faqs__container">
              <h2 className="font-semibold text-4xl my-6 w-full text-center">Frequently Asked Questions</h2>
              <div className="faq_box grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-4">
                  {
                    faqs.map((faq, index) => (<Faq key={index} faq={faq} />))
                  }
              </div>
            </SectionContainer>
      </section>
    </>
  )
}

export default HomePage;