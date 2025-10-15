import Image from "next/image";
import { MouseEventHandler } from "react";


export default function Home() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col w-[375px] h-[1065px] max-w-[1200px] p-6 gap-8">
        <Header />
        <Searchbar />
        <Search_keyword />
        <Noun />
        <Verb />
        <Source />
      </div>
    </div>
    
  );
}

// header component
function Header() {
  return (
    <div className="flex items-start justify-evenly gap-21 text-black">
      <img className="h-fit w-fit font-bold" src="images/logo.svg" alt="" />
      <div className="flex items-center justify-center gap-4">
        <Dropdown />
        <div className="h-[34px] w-[2px] bg-gray-200"></div>
        <div className="flex gap-3">
          <Toggle />
          <img className="w-[24px] h-[24px]" src="images/icon-moon.svg" alt="" />
        </div>
      </div>
    </div>
  );
}

function Searchbar() {
  return (
    <div className="flex">
      <div className="relative w-82 h-12"> 
        <input placeholder="search" type="search" id="search-bar" className="flex justify-end items-center w-full h-full bg-[#f4f4f4] rounded-xl px-6 text-[#2d2d2d] font-bold shadow-base focus:outline-none focus:ring-2 focus:ring-[#a445ed]" />

        <label htmlFor="search-bar" className="absolute right-0 top-0 h-full flex items-center justify-center px-6 cursor-pointer" >
          <button className="h-5 w-5">
            {/* Use a fixed size for the icon/image */}
            <img className="w-full h-full" src="/images/icon-search.svg" alt="Search" />
          </button>
        </label>
    
      </div>
    </div>
  );
}

function Search_keyword() {
  return (
    <div className="flex justify-between items-center">
      <div className="flex flex-col justify-start gap-1">
        <h1 className="text-3xl font-bold text-[#2d2d2d]">keyboard</h1>
        <h3 className="text-xl text-[#a445ed]">/ˈkiːbɔːd/</h3>
      </div>
      <div>
        <button><img className="w-12 h-12" src="/images/icon-play.svg" alt="" /></button>
      </div>
    </div>
  );
}

function Noun() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-6 items-center">
        <h2 className="text-lg font-bold text-[#2d2d2d]">noun</h2>
        <div className="h-[2px] w-full bg-[#e9e9e9]"></div>
      </div>
      <div className="flex flex-col text-[#2d2d2d] gap-4 text-[15px]">
        <h3 className="text-base text-[#757575]">Meaning</h3>
        <div className="w-full ml-4">
          <ul className="list-outside list-disc marker:text-[#8f19e8] text-start space-y-4">
            <li>(etc.) A set of keys used to operate a typewriter, computer etc.</li>
            <li>A component of many instruments including the piano, organ, and harpsichord consisting of usually black and white keys that cause different tones to be produced when struck.</li>
            <li>A device with keys of a musical keyboard, used to control electronic sound-producing devices which may be built into or separate from the keyboard device.</li>
          </ul>
        </div>
      </div>
      <div className="flex text-base gap-6">
        <h3 className="text-[#757575]">Synonyms</h3>
        <p className="font-bold text-[#a445ed]">electronic keyboard</p>
      </div>
    </div>
  );
}

function Verb() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-6 items-center">
        <h2 className="text-lg font-bold text-[#2d2d2d]">verb</h2>
        <div className="h-[2px] w-full bg-[#e9e9e9]"></div>
      </div>
      <div className="flex flex-col text-[#2d2d2d] gap-4 text-[15px]">
        <h3 className="text-base text-[#757575]">Meaning</h3>
        <div className="w-full ml-4">
          <ul className="list-outside list-disc marker:text-[#8f19e8] text-start flex flex-col gap-4">
            <li>To type on a computer keyboard.</li>
            <span className="text-[#757575]">“Keyboarding is the part of this job I hate the most.”</span>
          </ul>
        </div>
      </div>
      <div className="mt-4 h-[2px] w-full bg-[#e9e9e9]"></div>
    </div>
  );
}

function Source() {
  return (
    <div className="flex flex-col text-sm gap-2">
      <h3 className="underline decoration-[#757575] underline-offset-2 text-[#757575]">Source</h3>
      <div className="flex text-[#2d2d2d] gap-2">
       <a className="underline decoration-[#757575] underline-offset-2" href="http://https://en.wiktionary.org/wiki/keyboard" target="_blank">https://en.wiktionary.org/wiki/keyboard</a>
       <img src="/images/icon-new-window.svg" alt="" />
      </div>
    </div>
  );
}

function Dropdown() {
  return (
          <div className="flex gap-4">
            <span className="text-[14px] font-bold whitespace-nowrap">Sans Serif</span>
            <button>
              <img src="images/icon-arrow-down.svg" alt="" />
            </button>            
            <ul className="hidden">
              <button><li>Sans Serif</li></button>
              <button><li>Serif</li></button>
              <button><li>Mono</li></button>
            </ul>
          </div>
  );
}


function Toggle() {
  return (
    <div className="flex items-center">
      <input type="checkbox" id="toggleSwitch" className="sr-only peer" />

      <label
        htmlFor="toggleSwitch"
        className="
          relative 
          inline-flex 
          items-center 
          cursor-pointer 
          w-[42px] 
          h-[20px] 
          rounded-full 
          transition-colors 
          duration-300
          
          bg-gray-500 
          peer-checked:bg-indigo-600
        "
      >
        <span
          className="
            absolute 
            left-[4px] 
            w-[14px]
            h-[14px]
            bg-white 
            rounded-full 
            shadow-md 
            
            transition duration-300   <-- Transition for the slide
            transform                 <-- Enables the translate-x to work
            
            peer-checked:translate-x-full
          "
        ></span>
      </label>
    </div>
  );
}
// interface Prop {
//   onClick: MouseEventHandler<HTMLDivElement>;
//   checked: boolean | undefined;
//   className: string | undefined;
// }
// function Toggle({ onClick, checked, className }: Prop) {
//   return (
//     <div className={`relative ${className}`} onClick={onClick}>
//       <input type="checkbox" checked={checked} readOnly className="sr-only" />
//       <div className="block bg-grayCustom dark:bg-purpleCustom h-5 w-[2.08rem] rounded-full"></div>
//       <div
//         className={`absolute left-[0.20rem] top-[0.20rem] bg-white w-[0.85rem] h-[0.85rem] rounded-full transition
//                 ${checked ? "translate-x-full" : "translate-x-0"}
//                   `}
//       ></div>
//     </div>
//   );
// }

