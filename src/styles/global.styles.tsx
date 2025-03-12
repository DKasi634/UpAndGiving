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