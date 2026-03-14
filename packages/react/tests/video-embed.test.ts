import { describe, expect, it } from "vitest";

import {
  isDirectPlayableVideoUrl,
  isEmbeddableVideoUrl,
  toEmbedVideoUrl,
} from "../utils/video-embed";

describe("video-embed", () => {
  describe("isDirectPlayableVideoUrl", () => {
    it.each([
      ["https://example.com/video.mp4", true],
      ["https://example.com/video.webm", true],
      ["https://example.com/video.ogg", true],
      ["https://example.com/video.ogv", true],
      ["https://example.com/video.mov", true],
      ["https://example.com/video.m4v", true],
      ["https://example.com/video.MP4", true],
      ["https://example.com/page.html", false],
      ["https://youtube.com/watch?v=abc", false],
      ["not-a-url", false],
    ])("%s → %s", (url, expected) => {
      expect(isDirectPlayableVideoUrl(url)).toBe(expected);
    });
  });

  describe("isEmbeddableVideoUrl", () => {
    it.each([
      ["https://www.youtube.com/watch?v=abc123", true],
      ["https://youtu.be/abc123", true],
      ["https://www.bilibili.com/video/BV1xx411c7mu", true],
      ["https://vimeo.com/123456", true],
      ["https://www.tiktok.com/@user/video/123", true],
      ["https://www.douyin.com/video/123", false],
      ["https://example.com/video.mp4", false],
      ["not-a-url", false],
    ])("%s → %s", (url, expected) => {
      expect(isEmbeddableVideoUrl(url)).toBe(expected);
    });
  });

  describe("toEmbedVideoUrl", () => {
    it("converts YouTube long URL", () => {
      expect(toEmbedVideoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ"))
        .toBe("https://www.youtube.com/embed/dQw4w9WgXcQ");
    });

    it("converts YouTube short URL", () => {
      expect(toEmbedVideoUrl("https://youtu.be/dQw4w9WgXcQ"))
        .toBe("https://www.youtube.com/embed/dQw4w9WgXcQ");
    });

    it("converts Bilibili URL", () => {
      expect(toEmbedVideoUrl("https://www.bilibili.com/video/BV1xx411c7mu"))
        .toBe("https://player.bilibili.com/player.html?bvid=BV1xx411c7mu");
    });

    it("converts Vimeo URL", () => {
      expect(toEmbedVideoUrl("https://vimeo.com/123456789"))
        .toBe("https://player.vimeo.com/video/123456789");
    });

    it("converts TikTok URL", () => {
      expect(toEmbedVideoUrl("https://www.tiktok.com/@user/video/7890123456"))
        .toBe("https://www.tiktok.com/embed/v2/7890123456");
    });

    it("returns original URL for unknown hosts", () => {
      const url = "https://example.com/some-video";
      expect(toEmbedVideoUrl(url)).toBe(url);
    });

    it("returns original URL for invalid input", () => {
      expect(toEmbedVideoUrl("not-a-url")).toBe("not-a-url");
    });

    it("returns original YouTube URL when no video ID", () => {
      expect(toEmbedVideoUrl("https://www.youtube.com/"))
        .toBe("https://www.youtube.com/");
    });
  });
});
