import re
from urllib.parse import parse_qs, urlparse

YOUTUBE_ID_RE = re.compile(
    r"(?:youtube\.com/(?:watch\?.*v=|embed/|shorts/|live/)|youtu\.be/)([\w-]{11})",
    re.IGNORECASE,
)
IFRAME_SRC_RE = re.compile(
    r"""<iframe[^>]+src=["']([^"']+)["']""",
    re.IGNORECASE,
)


def parse_youtube_input(value):
    """
    Accept a YouTube watch/shorts URL, youtu.be link, embed URL, or iframe HTML.
    Returns (video_id, is_short) or (None, False).
    """
    raw = (value or "").strip()
    if not raw:
        return None, False

    iframe_match = IFRAME_SRC_RE.search(raw)
    if iframe_match:
        raw = iframe_match.group(1).strip()

    is_short = "/shorts/" in raw.lower()

    id_match = YOUTUBE_ID_RE.search(raw)
    if id_match:
        return id_match.group(1), is_short

    parsed = urlparse(raw)
    if "youtube.com" in parsed.netloc:
        video_id = parse_qs(parsed.query).get("v", [None])[0]
        if video_id and len(video_id) == 11:
            return video_id, is_short

    return None, False
