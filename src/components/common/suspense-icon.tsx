import { FC } from "react";

const SuspensIcon: FC = () => {
  return (<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="dark:text-white">
    <style>
      {`
        .spinner_OSmW {
          transform-origin: center;
          animation: spinner_T6mA 0.75s step-end infinite;
        }
        @keyframes spinner_T6mA {
          8.3% { transform: rotate(30deg); }
          16.6% { transform: rotate(60deg); }
          25% { transform: rotate(90deg); }
          33.3% { transform: rotate(120deg); }
          41.6% { transform: rotate(150deg); }
          50% { transform: rotate(180deg); }
          58.3% { transform: rotate(210deg); }
          66.6% { transform: rotate(240deg); }
          75% { transform: rotate(270deg); }
          83.3% { transform: rotate(300deg); }
          91.6% { transform: rotate(330deg); }
          100% { transform: rotate(360deg); }
        }
        `}
    </style>
    <g className="spinner_OSmW">
      <rect x="11" y="1" width="2" height="5" opacity="0.14" />
      <rect x="11" y="1" width="2" height="5" transform="rotate(30 12 12)" opacity="0.29" />
      <rect x="11" y="1" width="2" height="5" transform="rotate(60 12 12)" opacity="0.43" />
      <rect x="11" y="1" width="2" height="5" transform="rotate(90 12 12)" opacity="0.57" />
      <rect x="11" y="1" width="2" height="5" transform="rotate(120 12 12)" opacity="0.71" />
      <rect x="11" y="1" width="2" height="5" transform="rotate(150 12 12)" opacity="0.86" />
      <rect x="11" y="1" width="2" height="5" transform="rotate(180 12 12)" />
    </g>
  </svg>);
};

export default SuspensIcon;
