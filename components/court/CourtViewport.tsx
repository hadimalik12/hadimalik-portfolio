"use client";
import dynamic from "next/dynamic";
const CourtScene = dynamic(() => import("./CourtScene"), { ssr: false, loading: () => <div className="court-loading">Opening the court…</div> });
export default function CourtViewport() { return <CourtScene />; }
