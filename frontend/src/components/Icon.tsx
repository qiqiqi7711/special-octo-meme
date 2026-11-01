// 破茧 UI 图标：源自素材包 icons_sprite.svg，改为内联 React 组件（currentColor 可着色）。
// 原 sprite 采用外部 <use href> 引用，Vite 构建下无法可靠改写，故按规范建议内联 <symbol> 路径。
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function base(props: IconProps) {
  return {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...props,
  };
}

export function ButterflyIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 64 64" strokeWidth={2.5} {...base(props)}>
      <path d="M31 31C21 5 4 8 8 25c2 9 12 13 23 10C20 42 14 55 24 57c7 1 9-9 8-19 1 10 4 20 11 18 10-3 2-17-7-22 12 3 22-2 22-12 0-16-18-17-27 9Z" />
      <path strokeWidth={2} d="M32 25v24M32 25c-3-7-8-9-11-9M33 25c3-7 8-9 11-9" />
    </svg>
  );
}

export function SparkleIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.7} {...base(props)}>
      <path d="M12 2.5 14.4 9.6 21.5 12l-7.1 2.4L12 21.5l-2.4-7.1L2.5 12l7.1-2.4L12 2.5Z" />
    </svg>
  );
}

export function NodesIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.7} {...base(props)}>
      <circle cx="5" cy="12" r="2.2" />
      <circle cx="18.5" cy="5" r="2.2" />
      <circle cx="18.5" cy="19" r="2.2" />
      <path d="m7 11 9.4-5M7 13l9.4 5" />
    </svg>
  );
}

export function EyeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.7} {...base(props)}>
      <path d="M2.5 12s3.3-6 9.5-6 9.5 6 9.5 6-3.3 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.8" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2} {...base(props)}>
      <path d="m4.5 12.5 5 5L20 6.5" />
    </svg>
  );
}

export function ScaleIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.6} {...base(props)}>
      <path d="M12 3v17M6 6h12M8 6 4.5 13h7L8 6Zm8 0-3.5 7h7L16 6ZM7 21h10" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} {...base(props)}>
      <path d="M4 12h15m-6-6 6 6-6 6" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} {...base(props)}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
