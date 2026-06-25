from urllib.parse import quote

COMPANY_NAME = "Juspaid International"
CONTACT_NAME = "Arun Kumar"
CONTACT_ROLE = "Franchise Partner"
WHATSAPP_PHONE = "919946299011"
WHATSAPP_DISPLAY = "+91 99462 99011"
EMAIL = "arunkumarnpppppp@gmail.com"
ADDRESS_LINES = (
    "Naduvilakunnal house",
    "Kulayattikara PO",
    "Krrchary",
    "Kerala, India",
)
HOURS = "Monday – Saturday, 9:30 AM – 6:00 PM"


def whatsapp_url(text=""):
    base = f"https://wa.me/{WHATSAPP_PHONE}"
    if text:
        return f"{base}?text={quote(text)}"
    return base


def contact_context():
    default_enquiry = (
        f"Hello, I would like to enquire about {COMPANY_NAME} projects. "
        "Please share more details."
    )
    return {
        "company_name": COMPANY_NAME,
        "contact_name": CONTACT_NAME,
        "contact_role": CONTACT_ROLE,
        "whatsapp_phone": WHATSAPP_PHONE,
        "whatsapp_display": WHATSAPP_DISPLAY,
        "whatsapp_url": whatsapp_url(),
        "whatsapp_enquiry_url": whatsapp_url(default_enquiry),
        "whatsapp_site_visit_url": whatsapp_url(
            f"Hello, I would like to schedule a site visit to Pulpally, Wayanad with {COMPANY_NAME}."
        ),
        "whatsapp_talk_url": whatsapp_url(
            f"Hello {CONTACT_NAME}, I would like to speak with your team at {COMPANY_NAME}."
        ),
        "email": EMAIL,
        "address_lines": ADDRESS_LINES,
        "address_full": ", ".join(ADDRESS_LINES),
        "hours": HOURS,
    }
