"""Document generation tool — creates PDFs and presentations."""
import os
from tools.content_gen import generate_content
from tools.file_system import file_write

try:
    from fpdf import FPDF
    HAS_FPDF = True
except ImportError:
    HAS_FPDF = False


def generate_document(doc_type: str, data: dict) -> str:
    """Generate a document (business plan, pitch deck, or funding strategy)."""
    generators = {
        "business_plan": _generate_business_plan,
        "pitch_deck": _generate_pitch_deck,
        "funding_strategy": _generate_funding_strategy,
        "branding_kit": _generate_branding_kit,
    }

    generator = generators.get(doc_type)
    if not generator:
        return f"ERROR: Unknown document type '{doc_type}'. Available: {list(generators.keys())}"

    return generator(data)


def _generate_business_plan(data: dict) -> str:
    """Generate a comprehensive business plan."""
    business_name = data.get("business_name", "My Business")
    industry = data.get("industry", "General")
    target_audience = data.get("target_audience", "General consumers")
    elevator_pitch = data.get("elevator_pitch", "")

    prompt = f"""Write a comprehensive, professional business plan for:

Business Name: {business_name}
Industry: {industry}
Target Audience: {target_audience}
Value Proposition: {elevator_pitch}

Include these sections with detailed content:
1. Executive Summary (1 page)
2. Company Description
3. Market Analysis (industry trends, target market size, competitors)
4. Organization & Management
5. Products/Services Description
6. Marketing & Sales Strategy
7. Operations Plan
8. Financial Projections (Year 1-3 revenue estimates)
9. Funding Requirements
10. Appendix

Write professionally. Include specific numbers and actionable strategies.
Format with clear headings and paragraphs.
"""

    content = generate_content(prompt, max_tokens=8000)
    slug = business_name.lower().replace(" ", "-")
    output_dir = f"/home/ubuntu/output/documents/{slug}"
    os.makedirs(output_dir, exist_ok=True)

    # Save as Markdown
    md_path = f"{output_dir}/business_plan.md"
    file_write(md_path, f"# Business Plan: {business_name}\n\n{content}")

    # Save as PDF if fpdf available
    if HAS_FPDF:
        try:
            pdf = FPDF()
            pdf.add_page()
            pdf.set_auto_page_break(auto=True, margin=15)
            pdf.set_font("Helvetica", "B", 16)
            pdf.cell(0, 10, f"Business Plan: {business_name}", ln=True)
            pdf.set_font("Helvetica", "", 11)
            pdf.ln(5)

            for line in content.split("\n"):
                if line.startswith("#"):
                    pdf.set_font("Helvetica", "B", 14)
                    pdf.cell(0, 8, line.replace("#", "").strip(), ln=True)
                    pdf.set_font("Helvetica", "", 11)
                else:
                    pdf.multi_cell(0, 6, line)

            pdf_path = f"{output_dir}/business_plan.pdf"
            pdf.output(pdf_path)
            return f"Business plan generated: {pdf_path} and {md_path}"
        except Exception:
            pass

    return f"Business plan generated: {md_path}"


def _generate_pitch_deck(data: dict) -> str:
    """Generate a pitch deck outline."""
    business_name = data.get("business_name", "My Business")
    industry = data.get("industry", "General")
    elevator_pitch = data.get("elevator_pitch", "")

    prompt = f"""Create a 12-slide investor pitch deck for:

Business: {business_name}
Industry: {industry}
Value Proposition: {elevator_pitch}

For each slide, provide:
- Slide title
- Key message (1-2 sentences)
- Bullet points or data to include
- Speaker notes

Slides should cover:
1. Title/Hook
2. Problem
3. Solution
4. Market Size (TAM/SAM/SOM)
5. Business Model
6. Traction/Milestones
7. Competition
8. Go-to-Market Strategy
9. Team
10. Financials
11. The Ask (funding amount + use of funds)
12. Contact/Close

Be specific and compelling. Use real industry data where possible.
"""

    content = generate_content(prompt, max_tokens=6000)
    slug = business_name.lower().replace(" ", "-")
    output_dir = f"/home/ubuntu/output/documents/{slug}"
    os.makedirs(output_dir, exist_ok=True)

    md_path = f"{output_dir}/pitch_deck.md"
    file_write(md_path, f"# Pitch Deck: {business_name}\n\n{content}")

    return f"Pitch deck generated: {md_path}"


def _generate_funding_strategy(data: dict) -> str:
    """Generate a funding strategy with grant research."""
    business_name = data.get("business_name", "My Business")
    industry = data.get("industry", "General")
    funding_amount = data.get("funding_amount", "$50,000")
    funding_types = data.get("funding_types", ["grants", "loans"])

    prompt = f"""Create a comprehensive funding strategy for:

Business: {business_name}
Industry: {industry}
Funding Needed: {funding_amount}
Preferred Types: {', '.join(funding_types) if isinstance(funding_types, list) else funding_types}

Include:
1. Top 10 relevant grants (with estimated amounts and eligibility)
2. Top 5 SBA loan programs (with rates and requirements)
3. Top 5 angel investor networks for this industry
4. Crowdfunding strategy (platform recommendations)
5. Application timeline (month-by-month plan)
6. Required documents checklist
7. Tips for maximizing approval chances

Be specific with grant names, amounts, and deadlines where possible.
"""

    content = generate_content(prompt, max_tokens=6000)
    slug = business_name.lower().replace(" ", "-")
    output_dir = f"/home/ubuntu/output/documents/{slug}"
    os.makedirs(output_dir, exist_ok=True)

    md_path = f"{output_dir}/funding_strategy.md"
    file_write(md_path, f"# Funding Strategy: {business_name}\n\n{content}")

    return f"Funding strategy generated: {md_path}"


def _generate_branding_kit(data: dict) -> str:
    """Generate a branding guidelines document."""
    business_name = data.get("business_name", "My Business")
    brand_tone = data.get("brand_tone", "Professional")
    colors = data.get("colors", "#4169E1, #BF00FF")
    industry = data.get("industry", "General")

    prompt = f"""Create a comprehensive brand identity guide for:

Business: {business_name}
Industry: {industry}
Brand Tone: {brand_tone}
Primary Colors: {colors}

Include:
1. Brand Story & Mission Statement
2. Brand Voice & Tone Guidelines
3. Color Palette (primary, secondary, accent colors with hex codes)
4. Typography Recommendations (heading font, body font, sizes)
5. Logo Usage Guidelines
6. Social Media Brand Guidelines
7. Email Signature Template
8. Tagline Options (3-5 options)
9. Brand Do's and Don'ts
"""

    content = generate_content(prompt, max_tokens=4000)
    slug = business_name.lower().replace(" ", "-")
    output_dir = f"/home/ubuntu/output/documents/{slug}"
    os.makedirs(output_dir, exist_ok=True)

    md_path = f"{output_dir}/branding_kit.md"
    file_write(md_path, f"# Brand Identity Guide: {business_name}\n\n{content}")

    return f"Branding kit generated: {md_path}"
