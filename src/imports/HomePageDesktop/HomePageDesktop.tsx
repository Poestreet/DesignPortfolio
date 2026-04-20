import imgBackground1 from "./be8ddc4a337a7eba36e81fa9a18982db512e3d5a.png";
import { imgBackground, imgBackground2 } from "./svg-pta88";

function Text() {
  return <div className="bg-[#070071] h-px shrink-0 w-[32px]" data-name="Text" />;
}

function Button() {
  return (
    <div className="relative shrink-0" data-name="button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative">
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
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative">
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
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative">
        <Text2 />
        <p className="font-['Outfit:ExtraBold',sans-serif] font-extrabold leading-[16.5px] relative shrink-0 text-[#070071] text-[11px] text-center tracking-[3px] uppercase whitespace-nowrap">contact</p>
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

export default function HomePageDesktop() {
  return (
    <div className="bg-[#fafafa] relative size-full" data-name="HomePage - Desktop">
      <Navigation />
      <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[1024px] left-[calc(50%-0.5px)] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[76px_734px] mask-size-[1120px_218px] top-1/2 w-[1527px]" data-name="background" style={{ maskImage: `url('${imgBackground}')` }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgBackground1} />
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[1024px] left-[calc(50%-1.5px)] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[77px_969px] mask-size-[560px_24px] top-[calc(50%-1px)] w-[1527px]" data-name="background" style={{ maskImage: `url('${imgBackground2}')` }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgBackground1} />
        </div>
      </div>
    </div>
  );
}