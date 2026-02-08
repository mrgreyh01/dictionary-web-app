"use client";

import { useState, useEffect  } from 'react';
import { createContext, useContext } from 'react';
import  {Dictionary}  from '../model/dictionary.js';

const SearchContext = createContext();
const SearchDataContext = createContext();
const InputContext = createContext();
const FontContext = createContext();
const ModeContext = createContext();


export default function Home() {

  const [selectedFont, setSelectedFont] = useState({"fontName":"font-sans", "fontFamily":"Sans-Serif"});
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchData, setSearchData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const serverUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchKeyword(inputValue);
    }, 850);
    return () => clearTimeout(timer);
  }, [inputValue]);

  useEffect(() => {
    
    setIsLoading(true);
    closeKeyboard();

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
        } else {
          setSearchData(null);
        }
        console.log("Model:",searchData);
        
        
      } catch (error) {
        console.error('Error fetching data:', error);
        setSearchData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

  }, [searchKeyword]);

  return (
    <ModeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
    <FontContext.Provider value={{ selectedFont, setSelectedFont }}>  
    <InputContext.Provider value={{ inputValue, setInputValue }}>
    <SearchContext.Provider value={{ searchKeyword, setSearchKeyword,  }}>
    <SearchDataContext.Provider value={{ searchData, setSearchData }}>  
      <>
        <div className={` ${isDarkMode ? "bg-[#050505]" : "bg-white"} min-h-screen flex items-start justify-center`}>
          <div className={` ${selectedFont.fontName} flex flex-col w-full min-w-[365px] max-w-[1088px] p-6 gap-8`}>
            <Header />
            <Searchbar />
            {!isLoading && searchData !== null && searchKeyword.length >= 2 && (
              <>
                <Search_keyword />
                <Meanings />
                <Source />
              </>
            )}
            {!isLoading && (searchData === null || searchData.length <= 0) && searchKeyword.length >= 2 && (
              <NoDefinitionFound />
            )}
          </div>
        </div>
      </>
    </SearchDataContext.Provider>
    </SearchContext.Provider>
    </InputContext.Provider>
    </FontContext.Provider>
    </ModeContext.Provider>
  );  
}

// header component
function Header() {

  const { isDarkMode } = useContext(ModeContext);

  return (
    <div className={`flex items-center justify-between gap-20 ${isDarkMode ? "text-white" : "text-black"} md:pt-8`}>
      <img className="h-fit w-fit font-bold " src="./images/logo.svg" alt="" />
      <div className="flex items-center justify-center gap-4">
        <Dropdown />
        <div className={`h-[34px] w-[2px] bg-gray-200 ${isDarkMode ? "bg-[#e9e9e9]" : ""}`}></div>
        <div className="flex gap-3">
          <Toggle />
          <img className={`w-[24px] h-[24px] ${isDarkMode ? "hidden" : ""}`} src="images/icon-moon.svg" alt="" />
          <img className={`w-[24px] h-[24px] ${isDarkMode ? "" : "hidden"}`} src="images/dark-moon.png" alt="" />
        </div>
      </div>
    </div>
  );
}

function Searchbar() {

  const { inputValue, setInputValue } = useContext(InputContext);
  const { isDarkMode } = useContext(ModeContext);


  return (
    <div className="flex">
      <div className="relative w-full h-12"> 
        <input placeholder="Search for any word..." type="search" id="search-bar" className={`flex justify-end items-center w-full h-full  ${isDarkMode ? "bg-[#1f1f1f]" : "bg-[#f4f4f4]"} rounded-xl px-6 ${isDarkMode ? "text-white" : "text-[#2d2d2d]"} font-bold shadow-base focus:outline-none focus:border-transparent border-none focus:ring-2 focus:ring-[#a445ed]
        
        ... [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none `} value={inputValue} onChange={(e) => {
          setInputValue(e.target.value);
}} />

        <label htmlFor="search-bar" className="absolute right-0 top-0 h-full flex items-center justify-center px-6 cursor-pointer" >
            { (inputValue === '') ? (
            <button className="h-5 w-5" readOnly>
              <img className="w-full h-full" src="./images/icon-search.svg" alt="Search" />
            </button>
          ) : (
            <button className="h-7 w-7" onClick={() => setInputValue('')}>
              <img className="w-full h-full cursor-pointer" src="./images/icon-cross.png" alt="cut" />
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
  const { isDarkMode } = useContext(ModeContext);


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
        <h1 className={`text-3xl lg:text-5xl font-bold ${isDarkMode ? "text-white" : "text-[#2d2d2d]"}`}>{searchData.word}</h1>
        <h3 className="text-xl lg:text-2xl text-[#a445ed]">{searchData.phonetic}</h3>
      </div>                  
      <div>
        {searchData.audio && (
          <button onClick={playAudio}>
            <div className="">
              {isPlaying 
                ? <img className="flex w-12 h-12 lg:w-15 lg:h-15 cursor-pointer" src="./images/icon-play-active.svg" alt="" />
                : <img className="w-12 h-12 lg:w-15 lg:h-15 cursor-pointer" src="./images/icon-play.svg" alt="" />
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
  const { isDarkMode } = useContext(ModeContext);


  if (!searchData || !searchData.meanings || searchData.meanings.length === 0) {
    return null;
  }

  return (
    <>
      {searchData.meanings.map((meaning, index) => (
        <div key={index} className="flex flex-col gap-4 mt-2">
          <div className="flex gap-6 items-center">
            <h2 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-[#2d2d2d]"} italic`}>{meaning.partOfSpeech}</h2>
            <div className={`h-[2px] w-full ${isDarkMode ? "bg-[#3a3a3a]" : "bg-[#e9e9e9]"}`}></div>
          </div>
          <div className="flex flex-col text-[#2d2d2d] gap-4 text-[15px]">
            <h3 className={`text-base ${isDarkMode ? "text-[#A0A0A0]" : "text-[#757575]"}`}>Meaning</h3>
            <div className="max-w-full ml-4">
              <ul className={`list-outside list-disc marker:text-[#8f19e8] ${isDarkMode ? "text-white" : "text-[#2d2d2d]"} text-start flex flex-col gap-4`}>
                {meaning.definitions.map((def, idx) => (
                  <li key={idx}>
                    {def.definition}
                    {def.example && (
                      <span className={`block mt-3 ${isDarkMode ? "text-[#A0A0A0]" : "text-[#757575]"}`}>“{def.example}”</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {meaning.synonyms && meaning.synonyms.length > 0 && (
            <div className="flex text-base gap-6 flex-wrap">
              <h3 className={` ${isDarkMode ? "text-[#A0A0A0]" : "text-[#757575]"}`}>Synonyms</h3>
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
  const { isDarkMode } = useContext(ModeContext);


  if (!searchData || !searchData.source || searchData.source.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col text-sm gap-3">
      <h3 className={`underline decoration-[#757575] underline-offset-2 ${isDarkMode ? "text-[#A0A0A0]" : "text-[#757575]"}`}>Source</h3>
      <div className="flex text-[#2d2d2d] gap-2">
       <a className={`underline decoration-[#757575] underline-offset-2 ${isDarkMode ? "text-[#a445ed]" : "text-[#2d2d2d]"}`} href={searchData.source} target="_blank">{searchData.source}</a>
       <img src="/images/icon-new-window.svg" alt="" />
      </div>
    </div>
  );
}

function Dropdown() {

  const [isOpen, setIsOpen] = useState(false);
  const { selectedFont, setSelectedFont } = useContext(FontContext);
  const { isDarkMode } = useContext(ModeContext);


  return (
          <div className="flex gap-4 relative">
            <button className="cursor-pointer flex gap-4 items-center" onClick={() => setIsOpen(!isOpen)}>
              <span className={`text-[14px] ${isDarkMode ? "text-white" : "text-black"} font-bold whitespace-nowrap`}>{selectedFont.fontFamily}</span>

              {isOpen && (
                <img className="w-fit h-fit rotate-180" src="./images/icon-arrow-down.svg" alt="" />
              )}
              {!isOpen && (
                <img className="w-fit h-fit" src="./images/icon-arrow-down.svg" alt="" />
              )}  
            </button>  

            {isOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-5" 
                    onClick={() => setIsOpen(false)} 
                  /> 
                  <ul className={`flex flex-col gap-4 absolute w-40 py-4 px-6 rounded-2xl shadow-[0_5px_30px_0px_rgba(0,0,0,0.1)] shadow-[#a445ed] ${isDarkMode ? "bg-[#1f1f1f]" : "bg-white"} ${isDarkMode ? "text-white" : "text-[#2d2d2d]"} z-10 right-0 top-10`}>
                    <li className="font-sans hover:text-[#a445ed] w-full">
                      <button className="w-full text-left cursor-pointer font-bold" onClick={() => { setSelectedFont({fontName:"font-sans", fontFamily:"Sans Serif"}); setIsOpen(false); }}>Sans Serif</button>
                    </li>
                    <li className="font-serif hover:text-[#a445ed] w-full">
                      <button className="w-full text-left cursor-pointer font-bold" onClick={() => { setSelectedFont({fontName:"font-serif", fontFamily:"Serif"}); setIsOpen(false); }}>Serif</button>
                    </li>
                    <li className="font-mono hover:text-[#a445ed] w-full">
                      <button className="w-full text-left cursor-pointer font-bold" onClick={() => { setSelectedFont({fontName:"font-mono", fontFamily:"Mono"}); setIsOpen(false); }}>Mono</button>
                    </li>
                  </ul>
                </>
            )}
          </div>
  );
}

function Toggle() {

  const { isDarkMode, setIsDarkMode } = useContext(ModeContext);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    if (mediaQuery.matches) {
      setIsDarkMode(true);
    }
  }, [setIsDarkMode]);

  return (
    <div className="flex items-center">
      <label className="inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          className="sr-only peer" 
          checked={isDarkMode}
          onChange={() => setIsDarkMode(!isDarkMode)} 
        />
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

function closeKeyboard() {
  // Find the currently focused element
  const activeElement = document.activeElement;

  // If the active element is an input or textarea, blur it (remove focus)
  if (activeElement && activeElement.tagName === 'INPUT') {
    activeElement.blur();
  }
}

function NoDefinitionFound() {
  const { isDarkMode } = useContext(ModeContext);
  return (
    <div className="flex flex-col items-center text-center gap-6 mt-24">
      <img src="./images/emoji.png" alt="" />
      <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-black"} mt-2`}>No Definitions Found</h2>
      <p className={`text-base text-[#757575] max-w-[625px]`}>Sorry pal, we couldn't find definitions for the word you were looking for. You can try the search again at later time or head to the web instead.</p>
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

