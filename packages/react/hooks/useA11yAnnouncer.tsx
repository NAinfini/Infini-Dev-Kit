import { useEffect, useRef, useState, type ReactElement } from "react";

type Announcement = {
  id: number;
  message: string;
  politeness: "polite" | "assertive";
};

let nextId = 0;

const srOnlyStyle: React.CSSProperties = {
  position: "absolute", width: 1, height: 1,
  overflow: "hidden", clip: "rect(0,0,0,0)",
  whiteSpace: "nowrap", border: 0,
};

function AnnouncerRegionImpl({ announcements }: { announcements: Announcement[] }): ReactElement {
  return (
    <>
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={srOnlyStyle}
      >
        {announcements.filter((a) => a.politeness === "polite").map((a) => a.message).join(". ")}
      </div>
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        style={srOnlyStyle}
      >
        {announcements.filter((a) => a.politeness === "assertive").map((a) => a.message).join(". ")}
      </div>
    </>
  );
}

export type UseA11yAnnouncerReturn = {
  announce: (message: string, politeness?: "polite" | "assertive") => void;
  announcements: Announcement[];
  AnnouncerRegion: typeof AnnouncerRegionImpl;
};

export function useA11yAnnouncer(): UseA11yAnnouncerReturn {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const timeoutRefs = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  const announce = (message: string, politeness: "polite" | "assertive" = "polite") => {
    const id = ++nextId;
    setAnnouncements((prev) => [...prev, { id, message, politeness }]);

    const timeout = setTimeout(() => {
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      timeoutRefs.current.delete(id);
    }, 5000);

    timeoutRefs.current.set(id, timeout);
  };

  return { announce, announcements, AnnouncerRegion: AnnouncerRegionImpl };
}
