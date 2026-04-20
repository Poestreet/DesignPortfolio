import imgBackground from "./be8ddc4a337a7eba36e81fa9a18982db512e3d5a.png";

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
        <p className="font-['Outfit:ExtraBold',sans-serif] font-extrabold leading-[16.5px] relative shrink-0 text-[#fafafa] text-[11px] text-center tracking-[3px] uppercase whitespace-nowrap">about</p>
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
    <div className="relative shrink-0 w-full" data-name="Navigation">
      <div className="flex flex-col items-end size-full">
        <div className="content-stretch flex flex-col gap-[32px] items-end pr-[16px] pt-[16px] relative size-full">
          <Button />
          <Button1 />
          <Button2 />
        </div>
      </div>
    </div>
  );
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
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-name="input">
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
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-name="input">
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
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-name="textArea">
      <p className="font-['Fraunces:Bold_Italic',sans-serif] font-bold italic leading-[20px] relative shrink-0 text-[#fafafa] text-[16px] whitespace-nowrap" style={{ fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}>
        Tell me more?
      </p>
      <Field2 />
    </div>
  );
}

function Text3() {
  return <div className="bg-[#fafafa] h-px shrink-0 w-[32px]" data-name="Text" />;
}

function Button3() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="button">
      <Text3 />
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
      <Button3 />
    </div>
  );
}

function FormSection() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="FormSection">
      <EyeBrow />
      <p className="font-['Fraunces:Bold_Italic',sans-serif] font-bold italic leading-[30.8px] relative shrink-0 text-[#fafafa] text-[22px] whitespace-nowrap" style={{ fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}>
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

function Text4() {
  return <div className="bg-[#fafafa] h-px shrink-0 w-[32px]" data-name="Text" />;
}

function Button4() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="button">
      <Text4 />
      <p className="font-['Outfit:ExtraBold',sans-serif] font-extrabold leading-[16.5px] relative shrink-0 text-[#fafafa] text-[11px] text-center tracking-[3px] uppercase whitespace-nowrap">Linkedin</p>
    </div>
  );
}

function MainContent2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="main content">
      <Button4 />
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
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="MainContent">
      <FormSection />
      <LinksSection />
    </div>
  );
}

function RightCol() {
  return (
    <div className="content-stretch flex flex-col h-[874px] items-start px-[16px] py-[32px] relative shrink-0 w-[402px]" data-name="right col">
      <MainContent />
    </div>
  );
}

export default function ContactPageMobile() {
  return (
    <div className="bg-[#fafafa] content-stretch flex flex-col items-end relative size-full" data-name="ContactPage - Mobile">
      <div className="-translate-x-1/2 absolute h-[874px] left-1/2 top-0 w-[1686px]" data-name="background">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgBackground} />
        </div>
      </div>
      <Navigation />
      <RightCol />
    </div>
  );
}