"use client";

import { useState, useEffect  } from 'react';
import { createContext, useContext } from 'react';
import  {Dictionary}  from '../model/dictionary.js';

const SearchContext = createContext();
const SearchDataContext = createContext();
const InputContext = createContext();
const FontContext = createContext();


export default function Home() {

  const [selectedFont, setSelectedFont] = useState({"fontName":"font-sans", "fontFamily":"Sans-Serif"});
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchData, setSearchData] = useState([]);
  const serverUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchKeyword(inputValue);
    }, 1000);
    return () => clearTimeout(timer);
  }, [inputValue]);

  useEffect(() => {

    if (!searchKeyword || searchKeyword.trim() === "" || searchKeyword.length < 2) {
      return; 
    }

    const fetchData = async () => {
      try {
        const fullUrl = `${serverUrl}${encodeURIComponent(searchKeyword)}`;
        const response = await fetch(fullUrl);
        const data = await response.json();
        const apiData = Dictionary.fromJSON(data);
        if(apiData !== null) {
          setSearchData(apiData);          
        }
        console.log("Model:",apiData);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

  }, [searchKeyword]);

  return (
    <FontContext.Provider value={{ selectedFont, setSelectedFont }}>  
    <InputContext.Provider value={{ inputValue, setInputValue }}>
    <SearchContext.Provider value={{ searchKeyword, setSearchKeyword,  }}>
    <SearchDataContext.Provider value={{ searchData, setSearchData }}>  
      <>
        <div className="min-h-screen bg-white dark:bg-[#050505] flex items-center justify-center">
          <div className={` ${selectedFont.fontName} flex flex-col w-full h-full min-w-[365px] min-h-[1065] max-w-[1088px] max-h-[1205px] p-6 gap-8`}>
            <Header />
            <Searchbar />
            <Search_keyword />
            <Meanings />
            <Source />
          </div>
        </div>
      </>
    </SearchDataContext.Provider>
    </SearchContext.Provider>
    </InputContext.Provider>
    </FontContext.Provider>
  );  
}

// header component
function Header() {
  return (
    <div className="flex items-center justify-between gap-20  text-black md:pt-8">
      <img className="h-fit w-fit font-bold " src="images/logo.svg" alt="" />
      <div className="flex items-center justify-center gap-4">
        <Dropdown />
        <div className="h-[34px] w-[2px] bg-gray-200 dark:bg-[#e9e9e9]"></div>
        <div className="flex gap-3">
          <Toggle />
          <img className="w-[24px] h-[24px] dark:hidden" src="images/icon-moon.svg" alt="" />
          <img className="w-[24px] h-[24px] hidden dark:block" src="images/dark-moon.png" alt="" />
        </div>
      </div>
    </div>
  );
}

function Searchbar() {

  const { searchKeyword,  setSearchKeyword } = useContext(SearchContext);
  const { inputValue, setInputValue } = useContext(InputContext);

  return (
    <div className="flex">
      <div className="relative w-full h-12"> 
        <input placeholder="search" type="search" id="search-bar" className="flex justify-end items-center w-full h-full bg-[#f4f4f4] dark:bg-[#1f1f1f] rounded-xl px-6 text-[#2d2d2d] dark:text-white font-bold shadow-base focus:outline-none focus:ring-2 focus:ring-[#a445ed]
        
        ... [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none " value={inputValue} onChange={(e) => {
          setInputValue(e.target.value);
        }} />

        <label htmlFor="search-bar" className="absolute right-0 top-0 h-full flex items-center justify-center px-6 cursor-pointer" >
            { (inputValue === '') ? (
            <button className="h-5 w-5" readOnly>
              <img className="w-full h-full" src="/images/icon-search.svg" alt="Search" />
            </button>
          ) : (
            <button className="h-7 w-7" onClick={() => setInputValue('')}>
              <img className="w-full h-full cursor-pointer" src="/images/icon-cross.png" alt="cut" />
            </button>
          )}
        </label>
    
      </div>
    </div>
  );
}

function Search_keyword() {
  const { searchData } = useContext(SearchDataContext);
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = async () => {
    const audio = new Audio(searchData.audio);
    await audio.play();
    setIsPlaying(true);
    setTimeout(() => {
      setIsPlaying(false);
      audio.pause();
    }, 1600);
    
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex flex-col justify-start gap-1">
        <h1 className="text-3xl lg:text-5xl font-bold text-[#2d2d2d] dark:text-white">{searchData.word}</h1>
        <h3 className="text-xl lg:text-2xl text-[#a445ed]">{searchData.phonetic}</h3>
      </div>
      <div>
        {searchData.audio && (
          <button onClick={playAudio}>
            <div className="">
              {isPlaying 
                ? <img className="flex w-12 h-12 lg:w-15 lg:h-15 cursor-pointer" src="/images/icon-play-active.svg" alt="" />
                : <img className="w-12 h-12 lg:w-15 lg:h-15 cursor-pointer" src="/images/icon-play.svg" alt="" />
              }
            </div>
          </button>
        )}
      </div>
    </div>
  );
}

function Meanings() {
  const { searchData } = useContext(SearchDataContext);

  if (!searchData || !searchData.meanings || searchData.meanings.length === 0) {
    return null;
  }

  return (
    <>
      {searchData.meanings.map((meaning, index) => (
        <div key={index} className="flex flex-col gap-4 mt-6">
          <div className="flex gap-6 items-center">
            <h2 className="text-lg font-bold text-[#2d2d2d] dark:text-white italic">{meaning.partOfSpeech}</h2>
            <div className="h-[2px] w-full bg-[#e9e9e9] dark:bg-[#3a3a3a]"></div>
          </div>
          <div className="flex flex-col text-[#2d2d2d] gap-4 text-[15px]">
            <h3 className="text-base text-[#757575]">Meaning</h3>
            <div className="max-w-full ml-4">
              <ul className="list-outside list-disc marker:text-[#8f19e8] dark:text-white text-start flex flex-col gap-4">
                {meaning.definitions.map((def, idx) => (
                  <li key={idx}>
                    {def.definition}
                    {def.example && (
                      <span className="text-[#757575] block mt-3 ">“{def.example}”</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {meaning.synonyms && meaning.synonyms.length > 0 && (
            <div className="flex text-base gap-6 flex-wrap">
              <h3 className="text-[#757575]">Synonyms</h3>
              {meaning.synonyms.map((syn, idx) => (
                <p key={idx} className="font-bold text-[#a445ed]">{syn}</p>
              ))}
            </div>
          )}
        </div>
      ))}
    </>
  );
}

function Source() {
  const { searchData } = useContext(SearchDataContext);

  if (!searchData || !searchData.source || searchData.source.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col text-sm gap-4">
      <h3 className="underline decoration-[#757575] underline-offset-2 text-[#757575]">Source</h3>
      <div className="flex text-[#2d2d2d] gap-2">
       <a className="underline decoration-[#757575] underline-offset-2 dark:text-white" href={searchData.source} target="_blank">{searchData.source}</a>
       <img src="/images/icon-new-window.svg" alt="" />
      </div>
    </div>
  );
}

function Dropdown() {

  const [isOpen, setIsOpen] = useState(false);
  const { selectedFont, setSelectedFont } = useContext(FontContext);

  return (
          <div className="flex gap-4 relative">
            <span className="text-[14px] text-white font-bold whitespace-nowrap">{selectedFont.fontFamily}</span>
            <button className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
              {isOpen && (
                <img className="w-full h-full rotate-180" src="images/icon-arrow-down.svg" alt="" />
              )}
              {!isOpen && (
                <img className="w-full h-full" src="images/icon-arrow-down.svg" alt="" />
              )}  
            </button>  

            {isOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-5" 
                    onClick={() => setIsOpen(false)} 
                  /> 
                  <ul className="flex flex-col items-start gap-5  absolute size-36 font-sans z-10 right-0 top-10 p-4 rounded-lg shadow-[0_0_30px_10px] shadow-[#a445ed] bg-black dark:text-white">
                    <button onClick={() => { setSelectedFont({fontName:"font-sans", fontFamily:"Sans-Serif"}); setIsOpen(false); }}><li className="cursor-pointer">Sans Serif</li></button>
                    <button onClick={() => { setSelectedFont({fontName:"font-serif", fontFamily:"Serif"}); setIsOpen(false); }}><li className="cursor-pointer">Serif</li></button>
                    <button onClick={() => { setSelectedFont({fontName:"font-mono", fontFamily:"Mono"}); setIsOpen(false); }}><li className="cursor-pointer">Mono</li></button>
                  </ul>
                </>
            )}
          </div>
  );
}

function Toggle() {
  return (
    <div className="flex items-center">
      <label className="inline-flex items-center cursor-pointer">
        <input type="checkbox" value="" className="sr-only peer" />
        <div className="
          relative w-[44px] h-[22px]
        bg-[#757575]
          dark:bg-gray-700
          peer-focus:outline-none 
          rounded-full peer
          peer-checked:after:translate-x-[21px] 
          rtl:peer-checked:after:-translate-x-full 
          after:content-[''] 
          after:absolute 
          after:top-[3px] 
          after:start-[4px] 
        after:bg-white 
          after:rounded-full 
          after:h-[15px]
          after:w-[15px] 
          after:transition-all 
        peer-checked:bg-[#a445ed]
        dark:peer-checked:bg-[#a445ed]">

          </div>
      </label>
    </div>
  );
}

function Verb() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-6 items-center">
        <h2 className="text-lg font-bold text-[#2d2d2d] dark:text-white">verb</h2>
        <div className="h-[2px] w-full bg-[#e9e9e9] dark:bg-[#3a3a3a]"></div>
      </div>
      <div className="flex flex-col text-[#2d2d2d] gap-4 text-[15px]">
        <h3 className="text-base text-[#757575]">Meaning</h3>
        <div className="w-full ml-4">
          <ul className="list-outside list-disc marker:text-[#8f19e8] dark:text-white text-start flex flex-col gap-4">
            <li>To type on a computer keyboard.</li>
            <span className="text-[#757575]">“Keyboarding is the part of this job I hate the most.”</span>
          </ul>
        </div>
      </div>
      <div className="flex flex-col text-base gap-4">
        <h3 className="text-[#757575]">Synonyms</h3>
        <div className="flex flex-wrap gap-6 space-y-[-16px]">
        <p className="font-bold text-[#a445ed]">electronic keyboard</p>
        <p className="font-bold text-[#a445ed]">operator</p>
        <p className="font-bold text-[#a445ed]">Yellow Pages</p>
        <p className="font-bold text-[#a445ed]">type</p>
        <p className="font-bold text-[#a445ed]">type</p>
        <p className="font-bold text-[#a445ed]">type</p>    
        <p className="font-bold text-[#a445ed]">type</p>    
        <p className="font-bold text-[#a445ed]">type</p>    
        <p className="font-bold text-[#a445ed]">type</p>    
        <p className="font-bold text-[#a445ed]">type</p>    
        <p className="font-bold text-[#a445ed]">type</p>    
        <p className="font-bold text-[#a445ed]">type</p>    
        <p className="font-bold text-[#a445ed]">type</p>    
        <p className="font-bold text-[#a445ed]">type</p>    
        <p className="font-bold text-[#a445ed]">type</p>    
        <p className="font-bold text-[#a445ed]">type</p>    
        <p className="font-bold text-[#a445ed]">type</p> 
        <p className="font-bold text-[#a445ed]">type</p>    

        </div>



      </div>
      <div className="mt-4 h-[2px] w-full bg-[#e9e9e9] dark:bg-[#3a3a3a]"></div>
    </div>
  );
}

function Noun() {
  return (
    <div className="flex flex-col gap-4 ">
      <div className="flex gap-6 items-center">
        <h2 className="text-lg font-bold text-[#2d2d2d] dark:text-white">noun</h2>
        <div className="h-[2px] w-full bg-[#e9e9e9] dark:bg-[#3a3a3a]"></div>
      </div>
      <div className="flex flex-col text-[#2d2d2d] gap-4 text-[15px]">
        <h3 className="text-base text-[#757575]">Meaning</h3>
        <div className="max-w-full ml-4">
          {/* <ul className="list-outside list-disc marker:text-[#8f19e8] dark:text-white text-start space-y-4">
            <li>(etc.) A set of keys used to operate a typewriter, computer etc.</li>
            <li>A component of many instruments including the piano, organ, and harpsichord consisting of usually black and white keys that cause different tones to be produced when struck.</li>
            <li>A device with keys of a musical keyboard, used to control electronic sound-producing devices which may be built into or separate from the keyboard device.</li>
          </ul> */}
          
          <ul className="list-outside list-disc marker:text-[#8f19e8] dark:text-white text-start flex flex-col gap-4">
            <li>To type on a computer keyboard.</li>
            <li>To type on a computer keyboard.</li>

            <span className="text-[#757575]">“Keyboarding is the part of this job I hate the most.”</span>
          </ul>
        </div>
      </div>
      <div className="flex text-base gap-6">
        <h3 className="text-[#757575]">Synonyms</h3>
        <p className="font-bold text-[#a445ed]">electronic keyboard</p>
        <p className="font-bold text-[#a445ed]">Yellow Pages</p>
        <p className="font-bold text-[#a445ed]">Yellow Pages</p>
        <p className="font-bold text-[#a445ed]">Yellow Pages</p>

      </div>
    </div>
  );
}

// function Toggle() {
//   return (
//     <div className="flex items-center">
//       <input type="checkbox" id="toggleSwitch" className="sr-only peer" />

//       <label
//         htmlFor="toggleSwitch"
//         className="
//           relative 
//           inline-flex 
//           items-center 
//           cursor-pointer 
//           w-[42px] 
//           h-[20px] 
//           rounded-full 
//           transition-colors 
//           duration-300
          
//           bg-gray-500 
//           peer-checked:bg-indigo-600
//         "
//       >
//         <span
//           className="
//             absolute 
//             left-[4px] 
//             w-[14px]
//             h-[14px]
//             bg-white 
//             rounded-full 
//             shadow-md 
            
//             transition duration-300   <-- Transition for the slide
//             transform                 <-- Enables the translate-x to work
            
//             peer-checked:translate-x-full
//           "
//         ></span>
//       </label>
//     </div>
//   );
// }


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

