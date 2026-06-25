from django.templatetags.static import static

from .contact_info import contact_context


def site_contact(request):
    info = contact_context()
    og_image_url = request.build_absolute_uri(static("img/heroimage.png"))
    return {
        "contact": info,
        "company_name": info["company_name"],
        "contact_name": info["contact_name"],
        "contact_role": info["contact_role"],
        "og_image_url": og_image_url,
        "canonical_url": request.build_absolute_uri(),
    }
