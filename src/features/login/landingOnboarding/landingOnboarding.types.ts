import { type ElementType } from "react";

export type DeliveryId = "radar" | "planning" | "course" | "bi";

export interface DeliveryHighlight {
    type: string;
    title: string;
    url: string;
    img: string;
    label: string;
    icon: ElementType;
    buttonText: string;
}

export interface DeliveryContent {
    id: DeliveryId;
    title: string;
    icon: ElementType;
    subtitle: string;
    bullets: string[];
    howToUse: string[];
    badge: string;
    highlight?: DeliveryHighlight;
}

export interface DeliveryCardItem {
    id: DeliveryId;
    title: string;
    desc: string;
    icon: ElementType;
    tag: string;
}

export interface WhyNowItem {
    icon: ElementType;
    title: string;
    desc: string;
}

export interface FaqItem {
    q: string;
    a: string;
}

export interface QuickLink {
    label: string;
    href: string;
}
