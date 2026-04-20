import imgBackground from "./be8ddc4a337a7eba36e81fa9a18982db512e3d5a.png";
import imgRightCol from "./4b4a98ebdf8ee3d638fcd41fb40af9b5b6aa4999.png";

function RightCol() {
  return (
    <div className="content-stretch flex flex-col h-[874px] items-start relative shrink-0 w-[402px]" data-name="right col">
      <img alt="" className="absolute inset-0 max-w-none object-cover opacity-80 pointer-events-none size-full" src={imgRightCol} />
    </div>
  );
}

function EyeBrow() {
  return (
    <div className="content-stretch flex gap-[4px] items-center leading-[normal] relative shrink-0 text-[12px] whitespace-nowrap" data-name="EyeBrow">
      <p className="font-['Fraunces:Bold_Italic',sans-serif] font-bold italic relative shrink-0" style={{ fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}>
        01 .
      </p>
      <p className="font-['Outfit:ExtraBold',sans-serif] font-extrabold relative shrink-0">About</p>
    </div>
  );
}

function MainContent1() {
  return (
    <div className="content-stretch flex flex-col font-['Outfit:Medium',sans-serif] font-medium gap-[20px] items-start leading-[24.5px] relative shrink-0 text-[14px] w-full" data-name="main content">
      <p className="relative shrink-0 w-full">Self-taught, I discovered « the graphic arts » – as they were called at the time – in 1998. My career path then consisted of training and working first as a computer graphics artist, as a webdesigner, then as a UX/UI designer and now as a product designer. I worked in both print and web, on a freelance and salaried basis, and both on his own and in teams of various sizes. And since the profession is constantly evolving, as I have written here, I am continuously training myself in data, accessibility, front-end, methodology, artificial intelligence, and design systems.</p>
      <p className="relative shrink-0 w-full">{`Sports and the free press, European association, tourism, airlines, mobility, retail, e-commerce, B2B, B2C, B2G, design OPS, I had the opportunity to deal with a wide variety of issues (national and international), and i'm keen to bring my experience to other fields, helping to solve clients' problems while satisfying my curiosity.`}</p>
    </div>
  );
}

function AboutSection() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 text-[#fafafa] w-full" data-name="AboutSection">
      <EyeBrow />
      <p className="font-['Fraunces:Bold_Italic',sans-serif] font-bold italic leading-[30.8px] min-w-full relative shrink-0 text-[22px] w-[min-content]" style={{ fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}>
        « Simplicity is inexhaustible »
      </p>
      <MainContent1 />
    </div>
  );
}

function EyeBrow1() {
  return (
    <div className="content-stretch flex gap-[4px] items-center leading-[normal] relative shrink-0 text-[#fafafa] text-[12px] whitespace-nowrap" data-name="EyeBrow">
      <p className="font-['Fraunces:Bold_Italic',sans-serif] font-bold italic relative shrink-0" style={{ fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}>
        02 .
      </p>
      <p className="font-['Outfit:ExtraBold',sans-serif] font-extrabold relative shrink-0">Experiences</p>
    </div>
  );
}

function Frontguys() {
  return (
    <div className="content-stretch flex gap-[4px] items-start relative shrink-0 text-[#fafafa] w-full" data-name="frontguys">
      <p className="font-['Fraunces:Bold_Italic',sans-serif] font-bold italic leading-[normal] relative shrink-0 text-[18px] whitespace-nowrap" style={{ fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}>
        2023 - 2025 .
      </p>
      <p className="flex-[1_0_0] font-['Outfit:ExtraBold',sans-serif] font-extrabold leading-[0] min-w-px relative text-[0px]">
        <span className="font-['Outfit:Medium',sans-serif] font-medium leading-[normal] text-[18px]">Frontguys / Senior Product Designer</span>
        <span className="font-['Outfit:Medium',sans-serif] font-medium leading-[normal] text-[18px]">Experience</span>
      </p>
    </div>
  );
}

function Connect() {
  return (
    <div className="content-stretch flex gap-[4px] items-start leading-[normal] relative shrink-0 text-[#fafafa] text-[18px] w-full" data-name="connect">
      <p className="font-['Fraunces:Bold_Italic',sans-serif] font-bold italic relative shrink-0 whitespace-nowrap" style={{ fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}>
        2021 - 2023 .
      </p>
      <p className="flex-[1_0_0] font-['Outfit:Medium',sans-serif] font-medium min-w-px relative">SNCF Connect / Senior Product Designer</p>
    </div>
  );
}

function RailEurope() {
  return (
    <div className="content-stretch flex gap-[4px] items-start leading-[normal] relative shrink-0 text-[#fafafa] text-[18px] w-full" data-name="railEurope">
      <p className="font-['Fraunces:Bold_Italic',sans-serif] font-bold italic relative shrink-0 whitespace-nowrap" style={{ fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}>
        2016 - 2021 .
      </p>
      <p className="flex-[1_0_0] font-['Outfit:Medium',sans-serif] font-medium min-w-px relative">Rail Europe / UXI Designer</p>
    </div>
  );
}

function Starting() {
  return (
    <div className="content-stretch flex gap-[4px] items-start leading-[normal] relative shrink-0 text-[#fafafa] text-[18px] w-full" data-name="starting">
      <p className="font-['Fraunces:Bold_Italic',sans-serif] font-bold italic relative shrink-0 whitespace-nowrap" style={{ fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}>
        From 2006 .
      </p>
      <p className="flex-[1_0_0] font-['Outfit:Medium',sans-serif] font-medium min-w-px relative">Hebdoprint, Edreams/GoVoyages/Opodo, Pixalione, ENSP, WordAppeal x Lafarge, L’Équipe, Radio France, ...</p>
    </div>
  );
}

function Tag() {
  return (
    <div className="bg-[rgba(250,250,250,0.2)] content-stretch flex items-center justify-center px-[12px] py-[6px] relative rounded-[999px] shrink-0" data-name="tag">
      <div aria-hidden="true" className="absolute border border-[#fafafa] border-solid inset-0 pointer-events-none rounded-[999px]" />
      <p className="font-['Outfit:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#fafafa] text-[12px] whitespace-nowrap">accessibility</p>
    </div>
  );
}

function Tag1() {
  return (
    <div className="bg-[rgba(250,250,250,0.2)] content-stretch flex items-center justify-center px-[12px] py-[6px] relative rounded-[999px] shrink-0" data-name="tag">
      <div aria-hidden="true" className="absolute border border-[#fafafa] border-solid inset-0 pointer-events-none rounded-[999px]" />
      <p className="font-['Outfit:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#fafafa] text-[12px] whitespace-nowrap">data</p>
    </div>
  );
}

function Tag2() {
  return (
    <div className="bg-[rgba(250,250,250,0.2)] content-stretch flex items-center justify-center px-[12px] py-[6px] relative rounded-[999px] shrink-0" data-name="tag">
      <div aria-hidden="true" className="absolute border border-[#fafafa] border-solid inset-0 pointer-events-none rounded-[999px]" />
      <p className="font-['Outfit:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#fafafa] text-[12px] whitespace-nowrap">design system</p>
    </div>
  );
}

function Tag3() {
  return (
    <div className="bg-[rgba(250,250,250,0.2)] content-stretch flex items-center justify-center px-[12px] py-[6px] relative rounded-[999px] shrink-0" data-name="tag">
      <div aria-hidden="true" className="absolute border border-[#fafafa] border-solid inset-0 pointer-events-none rounded-[999px]" />
      <p className="font-['Outfit:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#fafafa] text-[12px] whitespace-nowrap">design thinking</p>
    </div>
  );
}

function Tag4() {
  return (
    <div className="bg-[rgba(250,250,250,0.2)] content-stretch flex items-center justify-center px-[12px] py-[6px] relative rounded-[999px] shrink-0" data-name="tag">
      <div aria-hidden="true" className="absolute border border-[#fafafa] border-solid inset-0 pointer-events-none rounded-[999px]" />
      <p className="font-['Outfit:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#fafafa] text-[12px] whitespace-nowrap">artificial intelligence</p>
    </div>
  );
}

function TagsSection() {
  return (
    <div className="content-start flex flex-wrap gap-[8px] items-start pt-[12px] relative shrink-0 w-full" data-name="tagsSection">
      <Tag />
      <Tag1 />
      <Tag2 />
      <Tag3 />
      <Tag4 />
    </div>
  );
}

function MainContent2() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-full" data-name="main content">
      <Frontguys />
      <Connect />
      <RailEurope />
      <Starting />
      <TagsSection />
    </div>
  );
}

function ExperienceSection() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="ExperienceSection">
      <EyeBrow1 />
      <MainContent2 />
    </div>
  );
}

function MainContent() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="MainContent">
      <AboutSection />
      <ExperienceSection />
    </div>
  );
}

function LeftCol() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-[16px] py-[32px] relative shrink-0 w-[402px]" data-name="left col">
      <MainContent />
    </div>
  );
}

function Text() {
  return <div className="bg-[#fafafa] h-px shrink-0 w-[32px]" data-name="Text" />;
}

function Button() {
  return (
    <div className="relative shrink-0" data-name="button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Text />
        <p className="font-['Outfit:ExtraBold',sans-serif] font-extrabold leading-[16.5px] relative shrink-0 text-[#fafafa] text-[11px] text-center tracking-[3px] uppercase whitespace-nowrap">cases</p>
      </div>
    </div>
  );
}

function Text1() {
  return <div className="bg-[#fafafa] h-px shrink-0 w-[32px]" data-name="Text" />;
}

function Button1() {
  return (
    <div className="relative shrink-0" data-name="button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Text1 />
        <p className="font-['Outfit:ExtraBold',sans-serif] font-extrabold leading-[16.5px] relative shrink-0 text-[#fafafa] text-[11px] text-center tracking-[3px] uppercase whitespace-nowrap">contact</p>
      </div>
    </div>
  );
}

function Text2() {
  return <div className="bg-[#fafafa] h-px shrink-0 w-[32px]" data-name="Text" />;
}

function Button2() {
  return (
    <div className="relative shrink-0" data-name="button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Text2 />
        <p className="font-['Outfit:ExtraBold',sans-serif] font-extrabold leading-[16.5px] relative shrink-0 text-[#fafafa] text-[11px] text-center tracking-[3px] uppercase whitespace-nowrap">homepage</p>
      </div>
    </div>
  );
}

function Navigation() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[32px] items-end pr-[16px] pt-[16px] right-[16px] top-[16px]" data-name="Navigation">
      <Button />
      <Button1 />
      <Button2 />
    </div>
  );
}

export default function AboutPageMobile() {
  return (
    <div className="bg-[#fafafa] content-stretch flex flex-col items-end relative size-full" data-name="AboutPage - Mobile">
      <div className="-translate-x-1/2 absolute h-[1941px] left-1/2 top-0 w-[3744px]" data-name="background">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgBackground} />
        </div>
      </div>
      <RightCol />
      <LeftCol />
      <Navigation />
    </div>
  );
}