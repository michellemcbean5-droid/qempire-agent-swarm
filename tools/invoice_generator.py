"""
Invoice Generator Tool — Create professional PDF invoices.
Uses fpdf2 if available, falls back to plain text invoice.
"""
import os
import time
import json

INVOICES_DIR = os.getenv("INVOICES_DIR", "/app/memory/invoices")


def create_invoice(
    client_name: str,
    client_email: str,
    line_items: list[dict],
    business_name: str = "Q-Empire Client",
    due_days: int = 30,
    invoice_number: str = "",
) -> str:
    """
    Generate an invoice and save it as a JSON file (PDF generation requires fpdf2).

    Args:
        client_name: Client's full name
        client_email: Client's email
        line_items: List of dicts with 'description', 'quantity', 'unit_price'
        business_name: The service provider's business name
        due_days: Days until payment due
        invoice_number: Optional custom invoice number

    Returns:
        Path to the generated invoice file
    """
    os.makedirs(INVOICES_DIR, exist_ok=True)

    invoice_num = invoice_number or f"INV-{int(time.time())}"
    subtotal = sum(
        item.get("quantity", 1) * item.get("unit_price", 0)
        for item in line_items
    )
    tax_rate = 0.0  # Tax configured per jurisdiction
    tax = subtotal * tax_rate
    total = subtotal + tax

    invoice_data = {
        "invoice_number": invoice_num,
        "issued_date": time.strftime("%Y-%m-%d"),
        "due_date": time.strftime("%Y-%m-%d", time.localtime(time.time() + due_days * 86400)),
        "from": business_name,
        "to": {
            "name": client_name,
            "email": client_email,
        },
        "line_items": line_items,
        "subtotal": round(subtotal, 2),
        "tax": round(tax, 2),
        "total": round(total, 2),
        "currency": "USD",
        "status": "unpaid",
    }

    filename = os.path.join(INVOICES_DIR, f"{invoice_num}.json")
    with open(filename, "w") as f:
        json.dump(invoice_data, f, indent=2)

    # Try to generate PDF
    try:
        _generate_pdf(invoice_data, filename.replace(".json", ".pdf"))
        return filename.replace(".json", ".pdf")
    except Exception:
        pass

    return filename


def _generate_pdf(invoice: dict, path: str) -> None:
    """Generate a PDF invoice using fpdf2."""
    from fpdf import FPDF  # type: ignore

    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Helvetica", "B", 20)
    pdf.cell(0, 12, "INVOICE", ln=True, align="C")

    pdf.set_font("Helvetica", "", 11)
    pdf.ln(4)
    pdf.cell(0, 8, f"Invoice #: {invoice['invoice_number']}", ln=True)
    pdf.cell(0, 8, f"Issued: {invoice['issued_date']}  |  Due: {invoice['due_date']}", ln=True)
    pdf.cell(0, 8, f"From: {invoice['from']}", ln=True)
    pdf.cell(0, 8, f"To: {invoice['to']['name']} ({invoice['to']['email']})", ln=True)

    pdf.ln(6)
    pdf.set_font("Helvetica", "B", 11)
    pdf.cell(100, 8, "Description", border=1)
    pdf.cell(25, 8, "Qty", border=1, align="C")
    pdf.cell(35, 8, "Unit Price", border=1, align="R")
    pdf.cell(30, 8, "Total", border=1, align="R", ln=True)

    pdf.set_font("Helvetica", "", 10)
    for item in invoice["line_items"]:
        qty = item.get("quantity", 1)
        price = item.get("unit_price", 0)
        pdf.cell(100, 8, item.get("description", ""), border=1)
        pdf.cell(25, 8, str(qty), border=1, align="C")
        pdf.cell(35, 8, f"${price:,.2f}", border=1, align="R")
        pdf.cell(30, 8, f"${qty * price:,.2f}", border=1, align="R", ln=True)

    pdf.ln(4)
    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(160, 8, "TOTAL DUE:")
    pdf.cell(30, 8, f"${invoice['total']:,.2f} {invoice['currency']}", align="R", ln=True)

    pdf.output(path)
