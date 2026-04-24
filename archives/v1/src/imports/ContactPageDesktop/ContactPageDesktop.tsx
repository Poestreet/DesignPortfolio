import imgImage from "./05ecf1ce226d7b081d77b91c5a9eada68ab72e0a.png";

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
  return <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start min-w-px" data-name="RightCol" />;
}

function EyeBrow() {
  return (
    <div className="content-stretch flex gap-[4px] items-center leading-[normal] relative shrink-0 text-[#fafafa] text-[12px] whitespace-nowrap" data-name="EyeBrow">
      <p className="font-['Fraunces:Bold_Italic',sans-serif] font-bold italic relative shrink-0" style={{ fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}>
        01 .
      </p>
      <p className="font-['Outfit:ExtraBold',sans-serif] font-extrabold relative shrink-0">Contact</p>
    </div>
  );
}

function Field() {
  return (
    <div className="relative shrink-0 w-full" data-name="field">
      <div aria-hidden="true" className="absolute border-[#fafafa] border-b border-solid inset-[0_0_-1px_0] pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pb-[8px] px-[8px] relative size-full">
          <p className="font-['Outfit:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[14px] text-[rgba(250,250,250,0.7)] whitespace-nowrap">your name</p>
        </div>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-[492px]" data-name="input">
      <p className="font-['Fraunces:Bold_Italic',sans-serif] font-bold italic leading-[20px] relative shrink-0 text-[#fafafa] text-[16px] whitespace-nowrap" style={{ fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}>
        Who’s writing?
      </p>
      <Field />
    </div>
  );
}

function Field1() {
  return (
    <div className="relative shrink-0 w-full" data-name="field">
      <div aria-hidden="true" className="absolute border-[#fafafa] border-b border-solid inset-[0_0_-1px_0] pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pb-[8px] px-[8px] relative size-full">
          <p className="font-['Outfit:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[14px] text-[rgba(250,250,250,0.7)] whitespace-nowrap">your email</p>
        </div>
      </div>
    </div>
  );
}

function Input1() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-[492px]" data-name="input">
      <p className="font-['Fraunces:Bold_Italic',sans-serif] font-bold italic leading-[20px] relative shrink-0 text-[#fafafa] text-[16px] whitespace-nowrap" style={{ fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}>
        How do i reach you?
      </p>
      <Field1 />
    </div>
  );
}

function Field2() {
  return (
    <div className="relative shrink-0 w-full" data-name="field">
      <div aria-hidden="true" className="absolute border-[#fafafa] border-b border-solid inset-[0_0_-1px_0] pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pb-[96px] px-[8px] relative size-full">
          <p className="font-['Outfit:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[14px] text-[rgba(250,250,250,0.7)] whitespace-nowrap">whatever you want to talk about, anything...</p>
        </div>
      </div>
    </div>
  );
}

function TextArea() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-[492px]" data-name="textArea">
      <p className="font-['Fraunces:Bold_Italic',sans-serif] font-bold italic leading-[20px] relative shrink-0 text-[#fafafa] text-[16px] whitespace-nowrap" style={{ fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}>
        Tell me more?
      </p>
      <Field2 />
    </div>
  );
}

function Text() {
  return <div className="bg-[#fafafa] h-px shrink-0 w-[32px]" data-name="Text" />;
}

function Button() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="button">
      <Text />
      <p className="font-['Outfit:ExtraBold',sans-serif] font-extrabold leading-[16.5px] relative shrink-0 text-[#fafafa] text-[11px] text-center tracking-[3px] uppercase whitespace-nowrap">reach me</p>
    </div>
  );
}

function MainContent1() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full" data-name="main content">
      <Input />
      <Input1 />
      <TextArea />
      <Button />
    </div>
  );
}

function FormSection() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="FormSection">
      <EyeBrow />
      <p className="font-['Fraunces:Bold_Italic',sans-serif] font-bold italic leading-[30.8px] min-w-full relative shrink-0 text-[#fafafa] text-[22px] w-[min-content]" style={{ fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}>
        Get in touch!
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
      <p className="font-['Outfit:ExtraBold',sans-serif] font-extrabold relative shrink-0">Links</p>
    </div>
  );
}

function Text1() {
  return <div className="bg-[#fafafa] h-px shrink-0 w-[32px]" data-name="Text" />;
}

function Button1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="button">
      <Text1 />
      <p className="font-['Outfit:ExtraBold',sans-serif] font-extrabold leading-[16.5px] relative shrink-0 text-[#fafafa] text-[11px] text-center tracking-[3px] uppercase whitespace-nowrap">Linkedin</p>
    </div>
  );
}

function MainContent2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="main content">
      <Button1 />
    </div>
  );
}

function LinksSection() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="LinksSection">
      <EyeBrow1 />
      <MainContent2 />
    </div>
  );
}

function MainContent() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-[607.5px]" data-name="MainContent">
      <FormSection />
      <LinksSection />
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
        <p className="font-['Outfit:ExtraBold',sans-serif] font-extrabold leading-[16.5px] relative shrink-0 text-[#fafafa] text-[11px] text-center tracking-[3px] uppercase whitespace-nowrap">cases</p>
      </div>
    </div>
  );
}

function Text3() {
  return <div className="bg-[#fafafa] h-px shrink-0 w-[32px]" data-name="Text" />;
}

function Button3() {
  return (
    <div className="relative shrink-0" data-name="button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Text3 />
        <p className="font-['Outfit:ExtraBold',sans-serif] font-extrabold leading-[16.5px] relative shrink-0 text-[#fafafa] text-[11px] text-center tracking-[3px] uppercase whitespace-nowrap">about</p>
      </div>
    </div>
  );
}

function Text4() {
  return <div className="bg-[#fafafa] h-px shrink-0 w-[32px]" data-name="Text" />;
}

function Button4() {
  return (
    <div className="relative shrink-0" data-name="button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Text4 />
        <p className="font-['Outfit:ExtraBold',sans-serif] font-extrabold leading-[16.5px] relative shrink-0 text-[#fafafa] text-[11px] text-center tracking-[3px] uppercase whitespace-nowrap">homepage</p>
      </div>
    </div>
  );
}

function Navigation() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[81.5px] items-end right-[16px] top-[16px]" data-name="Navigation">
      <Button2 />
      <Button3 />
      <Button4 />
    </div>
  );
}

function LeftCol() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-center justify-center min-w-px relative" data-name="LeftCol">
      <MainContent />
      <Navigation />
    </div>
  );
}

export default function ContactPageDesktop() {
  return (
    <div className="bg-[#fafafa] content-stretch flex items-start relative size-full" data-name="ContactPage - Desktop">
      <AnimatedBackground />
      <RightCol />
      <LeftCol />
    </div>
  );
}