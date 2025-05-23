import { create } from "zustand";
import { RefObject } from "react";
import { Domain } from "../utils/types";
import { TrackDimensions } from "../components/tracks/types";

export interface IntitialBrowserState {
  domain: Domain;
  marginWidth: number;
  trackWidth: number;
  multiplier: number;
}

interface BrowserStore {
  domain: Domain;
  delta: number;
  svgRef: RefObject<SVGSVGElement | null> | null;
  browserWidth: number;
  trackWidth: number;
  marginWidth: number;
  multiplier: number;
  getDomain: () => Domain;
  getExpandedDomain: () => Domain;
  setDomain: (domain: Domain) => void;
  shiftDomain: () => void;
  setDelta: (delta: number) => void;
  setSvgRef: (ref: RefObject<SVGSVGElement | null>) => void;
  initialize: (state: IntitialBrowserState) => void;
  getTrackDimensions: () => TrackDimensions;
}

export const useBrowserStore = create<BrowserStore>((set, get) => ({
  domain: { chromosome: "chr1", start: 0, end: 1350 },
  delta: 0,
  svgRef: null,
  browserWidth: 1500,
  trackWidth: 1350,
  marginWidth: 150,
  multiplier: 3,
  initialize: (state: IntitialBrowserState) => {
    set({
      domain: state.domain,
      browserWidth: state.trackWidth + state.marginWidth,
      trackWidth: state.trackWidth,
      marginWidth: state.marginWidth,
      multiplier: state.multiplier,
    });
  },
  setDomain: (domain: Domain) => {
    const state = get();
    if (domain.start == state.domain.start && domain.end == state.domain.end) {
      return;
    }
    set({ domain });
  },
  shiftDomain: () => {
    const state = get();
    const shift = Math.floor((state.delta / state.trackWidth) * (state.domain.end - state.domain.start));
    const newDomain = {
      chromosome: state.domain.chromosome,
      start: state.domain.start - shift,
      end: state.domain.end - shift,
    };
    get().setDomain(newDomain);
  },
  setDelta: (delta: number) => set({ delta }),
  setSvgRef: (ref: RefObject<SVGSVGElement | null>) => set({ svgRef: ref }),
  getExpandedDomain: () => {
    const state = get();
    const visibleWidth = state.domain.end - state.domain.start;
    const sidePiece = Math.floor((visibleWidth * (state.multiplier - 1)) / 2);
    const expandedDomain: Domain = {
      chromosome: state.domain.chromosome,
      start: state.domain.start - sidePiece,
      end: state.domain.end + sidePiece,
    };
    return expandedDomain;
  },
  getDomain: () => {
    return get().domain;
  },
  getTrackDimensions: () => {
    const trackWidth = get().trackWidth;
    const multiplier = get().multiplier;
    const sidePortion = (multiplier - 1) / 2;

    const dim: TrackDimensions = {
      totalWidth: trackWidth * multiplier,
      viewWidth: trackWidth,
      sideWidth: sidePortion * trackWidth,
      sidePortion,
      multiplier,
    };
    return dim;
  },
}));
