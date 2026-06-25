from .contact_info import contact_context


def site_contact(request):
    info = contact_context()
    return {
        "contact": info,
        "company_name": info["company_name"],
        "contact_name": info["contact_name"],
        "contact_role": info["contact_role"],
    }
