import styled from "styled-components";
import { Card } from "../card/card.component";

export const CardsCarouselWrapper = styled.div`
    display: flex;
    align-items: end;
    justify-content: start;
    gap: 2rem;
    padding-inline:1rem;
    overflow-x: scroll;
    scroll-snap-type:inline mandatory;
    &::-webkit-scrollbar{
        width: 0px;
    }
`

export const CarouselCard = styled(Card)`
    scroll-snap-align: start;
    flex-shrink: 0;
`

export const PaginationDotsContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-block: 1rem 3rem;
    gap: 1rem;
`

interface PaginationDotProps {
    $active:boolean
}

export const PaginationDot = styled.span<PaginationDotProps>`
    width: 1.5rem;
    height: 0.5rem;
    border-radius: 1rem;
    background-color: ${({$active}) => $active ? '#155dfc':"#E0E0E0"};
`