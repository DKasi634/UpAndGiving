import { useRef, useState } from 'react'
import { CardsCarouselWrapper, PaginationDotsContainer, PaginationDot, CarouselCard } from './cards-carousel.styles'
import { LandingProcessStep } from '@/types';

type CardsCarouselProps = {
    className?:string,
    steps:LandingProcessStep[]
}

const CardsCarousel = ({className="", steps }:CardsCarouselProps) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const carouselWrapperRef = useRef<HTMLDivElement|null>(null)

    const handleScroll = ()=>{
        if(!carouselWrapperRef.current){ return }
        const leftOffset = carouselWrapperRef.current.scrollLeft;
        const cardWidth = (carouselWrapperRef.current.querySelector(".card") as HTMLElement).offsetWidth;
        const activeIndex = Math.floor(leftOffset / cardWidth);
        setActiveIndex(activeIndex);
    }
    

  return (
    <>
        <CardsCarouselWrapper ref={carouselWrapperRef} onScroll={handleScroll} className={`${className}`}>
            {
                steps.map(({title, description, icon}, index) => {
                    return (
                        <CarouselCard key={index} className={`w-[24rem] md:w-[28rem] card`}>
                            <div className='flex flex-col space-y-1.5 p-6'>
                                <div className="icon text-4xl text-indigo-600 mb-4 text-left">{icon}</div>
                                <div className="font-bold text-xl mb-2">{title}</div>
                            </div>
                            <div className='p-6 pt-0'><p className='line-clamp-3'>{description}</p></div>
                        </CarouselCard>
                    )
                })
            }
        </CardsCarouselWrapper>
        <PaginationDotsContainer>
            {
            steps.map((_, index) =>(
                <PaginationDot key={index} $active={index === activeIndex} />
            ))
            
            }
        </PaginationDotsContainer>
    </>
  )
}

export default CardsCarousel