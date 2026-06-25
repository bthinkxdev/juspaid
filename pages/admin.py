from django.contrib import admin

from .models import GalleryUpdate


@admin.register(GalleryUpdate)
class GalleryUpdateAdmin(admin.ModelAdmin):
    list_display = ("title", "is_short", "is_published", "created_at")
    list_filter = ("is_published", "is_short")
    search_fields = ("title", "video_url", "youtube_id")
    readonly_fields = ("youtube_id", "is_short", "created_at", "updated_at")
    ordering = ("-created_at",)
    fieldsets = (
        (
            None,
            {
                "fields": (
                    "title",
                    "video_url",
                    "is_published",
                ),
            },
        ),
        (
            "Detected from link",
            {
                "fields": ("youtube_id", "is_short", "created_at", "updated_at"),
            },
        ),
    )
