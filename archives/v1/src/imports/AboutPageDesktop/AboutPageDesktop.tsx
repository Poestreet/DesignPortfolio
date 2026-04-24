import imgImage from "./05ecf1ce226d7b081d77b91c5a9eada68ab72e0a.png";
import imgRightCol from "./4b4a98ebdf8ee3d638fcd41fb40af9b5b6aa4999.png";

function Image() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[1024px] left-1/2 top-1/2 w-[1460px]" data-name="Image">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage} />
    </div>
  );
}

function AnimatedBackground() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[1024px] left-1/2 overflow-clip top-1/2 w-[1440px]" data-name="AnimatedBackground">
      <Image />
    </div>
  );
}

function RightCol() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start min-h-px min-w-px relative" data-name="RightCol">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgRightCol} />
    </div>
  );
}

function MainContent1() {
  return (
    <div className="content-stretch flex flex-col font-['Outfit:Medium',sans-serif] font-medium gap-[20px] h-[265px] items-start leading-[24.5px] relative shrink-0 text-[14px] w-full" data-name="main content">
      <p className="relative shrink-0 w-[608px]">Self-taught, I discovered « the graphic arts » – as they were called at the time – in 1998. My career path then consisted of training and working first as a computer graphics artist, as a webdesigner, then as a UX/UI designer and now as a product designer. I worked in both print and web, on a freelance and salaried basis, and both on his own and in teams of various sizes. And since the profession is constantly evolving, as I have written here, I am continuously training myself in data, accessibility, front-end, methodology, artificial intelligence, and design systems.</p>
      <p className="relative shrink-0 w-[608px]">{`Sports and the free press, European association, tourism, airlines, mobility, retail, e-commerce, B2B, B2C, B2G, design OPS, I had the opportunity to deal with a wide variety of issues (national and international), and i'm keen to bring my experience to other fields, helping to solve clients' problems while satisfying my curiosity.`}</p>
    </div>
  );
}

function MainContent() {
  return (
    <div className="content-stretch flex flex-col gap-[40px] items-start relative shrink-0 text-[#fafafa] w-[607.5px]" data-name="MainContent">
      <p className="font-['Fraunces:Bold_Italic',sans-serif] font-bold italic leading-[30.8px] relative shrink-0 text-[22px] w-full" style={{ fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}>
        « Simplicity is inexhaustible »
      </p>
      <MainContent1 />
    </div>
  );
}

function Text() {
  return <div className="bg-[#fafafa] h-px shrink-0 w-[32px]" data-name="Text" />;
}

function Button() {
  return (
    <div className="relative shrink-0" data-name="button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative">
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
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative">
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
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative">
        <Text2 />
        <p className="font-['Outfit:ExtraBold',sans-serif] font-extrabold leading-[16.5px] relative shrink-0 text-[#fafafa] text-[11px] text-center tracking-[3px] uppercase whitespace-nowrap">homepage</p>
      </div>
    </div>
  );
}

function Navigation() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[81.5px] items-end right-[16px] top-[16px]" data-name="Navigation">
      <Button />
      <Button1 />
      <Button2 />
    </div>
  );
}

function LeftCol() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-center justify-center min-h-px min-w-px relative" data-name="LeftCol">
      <MainContent />
      <Navigation />
    </div>
  );
}

export default function AboutPageDesktop() {
  return (
    <div className="bg-[#fafafa] content-stretch flex items-start relative size-full" data-name="AboutPage - Desktop">
      <AnimatedBackground />
      <RightCol />
      <LeftCol />
    </div>
  );
}