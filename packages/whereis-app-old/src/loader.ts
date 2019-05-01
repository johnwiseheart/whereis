import { cssRaw } from "typestyle/lib";

export const setupLoader = () => {
  cssRaw(`
    .loader,
    .loader:after {
    border-radius: 50%;
    width: 1em;
    height: 1em;
    }
    .loader {
    margin: 30px auto;
    font-size: 10px;
    position: relative;
    text-indent: -9999em;
    border-top: 0.4em solid rgba(0, 0, 0, 0.1);
    border-right: 0.4em solid rgba(0, 0, 0, 0.1);
    border-bottom: 0.4em solid rgba(0, 0, 0, 0.1);
    border-left: 0.4em solid #000000;
    -webkit-transform: translateZ(0);
    -ms-transform: translateZ(0);
    transform: translateZ(0);
    -webkit-animation: load8 1.1s infinite linear;
    animation: load8 1.1s infinite linear;
    }
    @-webkit-keyframes load8 {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
    }
    }
    @keyframes load8 {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
    }
    }
  `);
};
