import imgBackground1 from "./be8ddc4a337a7eba36e81fa9a18982db512e3d5a.png";
import { imgBackground, imgBackground2 } from "./svg-v4b9j";

function Text() {
  return <div className="bg-[#070071] h-px shrink-0 w-[32px]" data-name="Text" />;
}

function Button() {
  return (
    <div className="relative shrink-0" data-name="button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Text />
        <p className="font-['Outfit:ExtraBold',sans-serif] font-extrabold leading-[16.5px] relative shrink-0 text-[#070071] text-[11px] text-center tracking-[3px] uppercase whitespace-nowrap">About</p>
      </div>
    </div>
  );
}

function Text1() {
  return <div className="bg-[#070071] h-px shrink-0 w-[32px]" data-name="Text" />;
}

function Button1() {
  return (
    <div className="relative shrink-0" data-name="button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Text1 />
        <p className="font-['Outfit:ExtraBold',sans-serif] font-extrabold leading-[16.5px] relative shrink-0 text-[#070071] text-[11px] text-center tracking-[3px] uppercase whitespace-nowrap">cases</p>
      </div>
    </div>
  );
}

function Text2() {
  return <div className="bg-[#070071] h-px shrink-0 w-[32px]" data-name="Text" />;
}

function Button2() {
  return (
    <div className="relative shrink-0" data-name="button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Text2 />
        <p className="font-['Outfit:ExtraBold',sans-serif] font-extrabold leading-[16.5px] relative shrink-0 text-[#070071] text-[11px] text-center tracking-[3px] uppercase whitespace-nowrap">contact</p>
      </div>
    </div>
  );
}

function Navigation() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[32px] items-end right-[16px] top-[16px]" data-name="Navigation">
      <Button />
      <Button1 />
      <Button2 />
    </div>
  );
}

function MaskGroup() {
  return (
    <div className="absolute contents left-[16px] top-[762px]" data-name="Mask group">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[874px] left-1/2 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[658px_842px] mask-size-[370px_16px] top-1/2 w-[1686px]" style={{ maskImage: `url('${imgBackground}')` }} data-name="background">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgBackground1} />
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[874px] left-1/2 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[658px_762px] mask-size-[370px_72px] top-1/2 w-[1686px]" style={{ maskImage: `url('${imgBackground2}')` }} data-name="background">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgBackground1} />
        </div>
      </div>
    </div>
  );
}

export default function HomePageMobile() {
  return (
    <div className="bg-[#fafafa] relative size-full" data-name="HomePage - Mobile">
      <Navigation />
      <MaskGroup />
    </div>
  );
}