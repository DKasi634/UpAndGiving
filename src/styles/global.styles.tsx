import styled, { keyframes } from "styled-components";

export const shimer = keyframes`
    from{
        background-position: -200px -100px;
    }to {
        background-position: 200px 100px;
    }
`

export const ShimerEffect = styled.div`
    background: linear-gradient(to right, #eeeeee 8%, #dddddd 18%, #eeeeee 30%);
    background-size: 800px 100%;
    animation: ${shimer} 1.5s infinite;
`

export const VerticalScrollableWrapper = styled.div`
    padding: 0.5rem 1rem ;
    gap: 0.5rem;
    overflow-y: scroll;

    &::-webkit-scrollbar{
        width: 0.3rem;
        scrollbar-color: gray;
        scrollbar-width: thin;
    }
    &::-webkit-scrollbar-thumb{
        background: #929e9e;
        border-radius: 0.2rem;
    }
    &::-webkit-scrollbar-track{
        background: #e1e1e1;
    } 
`
export const NoScrollbarConatiner = styled.div`
    scrollbar-width: none !important;
    
`

export const LoaderSmWrapper = styled.div`
    border: 0.3rem solid rgb(16, 16, 16);
    border-top-color: rgb(245, 122, 30);
`

export const GridMdColsContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
    gap: 1rem 2rem;
    padding: 0.5rem;
`

export const LogoContainer = styled.div`
    height:3rem;
    min-width: fit-content;
    & img{
        width: 100%;
        min-width: fit-content;
        height: 100%;
        object-fit: cover;
        object-position: center;
    }
`
export const FooterWrapper = styled.footer`
    background: rgba(34, 34, 34, 1);
    color: rgba(235, 235, 235, 0.9);
    margin-top: 4rem;
    padding-block: 2rem;
    border-top-right-radius: 1rem;
    border-top-left-radius: 1rem;
`

export const LandingNavWrapper = styled.div`
    height: 4rem;
    padding-block: 0.5rem;
    display: grid;
    place-content: center;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    box-shadow:0 0.2rem 0.3rem rgba(0, 0, 0, 0.2) ;
    z-index: 100;
    background-color: rgba(235, 235, 235, 0.4);
`
