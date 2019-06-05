import styled from '../../../utils/styled';

const Title = styled.h1`
    color: white;
    font-size: 6em;
    margin: 0;
    padding: 0;
`;

const CentreDiv = styled.div`
    text-align:center;
    padding-top: 10%;
`;

const SubTitle = styled.h4`
    color: white;
    padding: 0;
    margin: 0;
`;

const Button = styled.button`
    color: white;
    border: solid 2px white;
    background: transparent;
    border-radius: 10em;
    overflow: hidden;
    margin: 1rem;
    padding: 0;
    box-sizing: border-box;
    outline: none;
    text-align: center;
    line-height: 1.5em;
    width: 150px;
    height: 40px;
    font-size: 1em;
    cursor: pointer;
    transition: 1s ease;
    -webkit-transition: 1s ease;
    &:hover {
        background: #fff;
        color: #34495e;
        transition: 1s ease;
        -webkit-transition: 1s ease;
    }
`;

export default {
    Title,
    SubTitle,
    Button,
    CentreDiv
};