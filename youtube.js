(() => {
  document.querySelectorAll("[data-youtube-embed]").forEach((poster) => {
    poster.addEventListener("click", () => {
      const iframe = document.createElement("iframe");
      iframe.className = "youtube-embed";
      iframe.src = poster.dataset.youtubeEmbed;
      iframe.title = poster.dataset.youtubeTitle || "AIS FLOWS trailer";
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      iframe.allow = "autoplay; encrypted-media; picture-in-picture";
      iframe.allowFullscreen = true;
      poster.replaceWith(iframe);
      window.AISFlowsAnalytics?.track("featured_media_play", {
        action_id: "featured_media_play",
        object_id: "featured-youtube-trailer",
      });
    });
  });
})();
