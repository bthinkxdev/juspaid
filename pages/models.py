from django.core.exceptions import ValidationError
from django.db import models

from .youtube import parse_youtube_input


class GalleryUpdate(models.Model):
    title = models.CharField(max_length=200)
    video_url = models.TextField(
        help_text="Paste a YouTube link (watch, Shorts, youtu.be) or the full iframe embed code.",
    )
    youtube_id = models.CharField(max_length=11, editable=False, blank=True)
    is_short = models.BooleanField(
        default=False,
        editable=False,
        help_text="Detected automatically from Shorts URLs.",
    )
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Gallery / Update"
        verbose_name_plural = "Gallery / Updates"

    def __str__(self):
        return self.title

    @property
    def embed_src(self):
        if not self.youtube_id:
            return ""
        return f"https://www.youtube.com/embed/{self.youtube_id}"

    def clean(self):
        super().clean()
        video_id, is_short = parse_youtube_input(self.video_url)
        if not video_id:
            raise ValidationError(
                {
                    "video_url": "Could not read a YouTube video ID. Paste a watch link, Shorts link, youtu.be link, or iframe embed code.",
                }
            )
        self.youtube_id = video_id
        self.is_short = is_short

    def save(self, *args, **kwargs):
        video_id, is_short = parse_youtube_input(self.video_url)
        if video_id:
            self.youtube_id = video_id
            self.is_short = is_short
        super().save(*args, **kwargs)
