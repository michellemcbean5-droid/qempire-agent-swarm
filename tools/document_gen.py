"""Document generation tool — creates PDFs and presentations."""
import os
import re
from tools.content_gen import generate_content
from tools.file_system import file_write

try:
    from fpdf import FPDF
    HAS_FPDF = True
except ImportError:
    HAS_FPDF = False


# Brand voice template used across document generation
BRAND_VOICE_TEMPLATE = "This is being created by Q-Empire Automation, guided by Michelle (the Black Mermaid Queen of the Deep) and Q-Bot (the friendly automation agent). The tone should be empowering, clear, and welcoming to founders of color."


def _format_error_message(error: Exception, max_length: int = 100) -> str:
    """Format error message with exception type and message, with intelligent truncation."""
    error_type = type(error).__name__
    error_msg = str(error)
    formatted = f"{error_type}: {error_msg}"
    if len(formatted) > max_length:
        # Truncate to max_length, but ensure we keep the exception type
        truncated = formatted[:max_length]
        if not truncated.endswith("..."):
            truncated = truncated.rsplit(" ", 1)[0] + "..."
        return truncated
    return formatted


def _sanitize_slug(business_name: str) -> str:
    """Sanitize business name to create safe directory slug."""
    # Convert to lowercase and replace spaces with hyphens
    slug = business_name.lower().replace(" ", "-")
    # Remove any non-alphanumeric characters except hyphens
    slug = re.sub(r"[^a-z0-9\-]", "", slug)
    # Collapse multiple consecutive hyphens into a single hyphen
    slug = re.sub(r"-+", "-", slug)
    # Remove leading/trailing hyphens
    slug = slug.strip("-")
    # Enforce maximum length (50 characters for safety)
    slug = slug[:50]
    # Ensure slug is not empty and doesn't allow path traversal
    if not slug:
        slug = "business"
    return slug


def generate_document(doc_type: str, data: dict) -> str:
    """Generate a document (business plan, pitch deck, or funding strategy)."""
    generators = {
        "business_plan": _generate_business_plan,
        "pitch_deck": _generate_pitch_deck,
        "funding_strategy": _generate_funding_strategy,
        "branding_kit": _generate_branding_kit,
        "roadmap": _generate_roadmap,
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

Brand Voice: This business plan is being created by Q-Empire Automation, guided by Michelle (the Black Mermaid Queen of the Deep) and Q-Bot (the friendly automation agent). The tone should be empowering, clear, and welcoming to founders of color — turning complex business strategy into an easy-to-follow roadmap.

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
    slug = _sanitize_slug(business_name)
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
        except Exception as e:
            # If PDF generation fails, return markdown path with a note
            error_msg = _format_error_message(e)
            return f"Business plan generated: {md_path} (PDF generation failed: {error_msg})"

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
    slug = _sanitize_slug(business_name)
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
    slug = _sanitize_slug(business_name)
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

Brand Inspiration: The Q-Empire brand is guided by Michelle, the Black Mermaid Queen of the Deep, her human son, and Q-Bot the automation agent. The aesthetic is magical, ocean-inspired, tech-forward, and welcoming to founders of color. Use this as inspiration for the client's brand guide.

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
    slug = _sanitize_slug(business_name)
    output_dir = f"/home/ubuntu/output/documents/{slug}"
    os.makedirs(output_dir, exist_ok=True)

    md_path = f"{output_dir}/branding_kit.md"
    file_write(md_path, f"# Brand Identity Guide: {business_name}\n\n{content}")

    return f"Branding kit generated: {md_path}"


def _generate_roadmap(data: dict) -> str:
    """Generate a strategic business roadmap tailored to the brand theme."""
    business_name = data.get("business_name", "My Business")
    industry = data.get("industry", "General")
    target_audience = data.get("target_audience", "General consumers")
    elevator_pitch = data.get("elevator_pitch", "")
    brand_tone = data.get("brand_tone", "Professional")

    # Customize prompt based on brand tone
    tone_guidance = {
        "Professional": "Use formal, structured language. Include specific metrics, timelines, and KPIs. Be organized and methodical.",
        "Friendly": "Use warm, approachable language. Make the roadmap feel like a journey with a friend. Use encouraging language.",
        "Bold": "Use confident, action-oriented language. Emphasize innovation and disruption. Make it inspiring and ambitious.",
        "Luxurious": "Use sophisticated, premium language. Focus on exclusivity, quality, and prestige. Emphasize high-end positioning.",
        "Playful": "Use creative, fun language. Include emojis and creative formatting. Make it engaging and entertaining.",
        "Minimal": "Use clean, concise language. Avoid jargon. Focus on essentials. Keep it simple and direct.",
    }

    tone_description = tone_guidance.get(brand_tone, tone_guidance["Professional"])

    prompt = f"""Create a detailed 12-month strategic roadmap for:

Business: {business_name}
Industry: {industry}
Target Audience: {target_audience}
Value Proposition: {elevator_pitch}
Brand Tone: {brand_tone}

Tone Guidelines: {tone_description}

Brand Voice: {BRAND_VOICE_TEMPLATE} Turning business strategy into an easy-to-follow roadmap.

Create a comprehensive 12-month roadmap with the following structure:

**Phase 1: Foundation (Months 1-2)**
- Key milestones and quick wins
- Essential setup tasks
- First 30, 60, and 90-day targets

**Phase 2: Growth (Months 3-6)**
- Customer acquisition strategies
- Product/service optimization
- Revenue targets

**Phase 3: Scale (Months 7-9)**
- Market expansion plans
- Team building considerations
- Infrastructure scaling

**Phase 4: Optimization (Months 10-12)**
- Profitability improvements
- Customer retention strategies
- Next-year planning

For each phase, include:
- Specific, measurable objectives
- Key activities and deliverables
- Resource requirements
- Success metrics and KPIs
- Risk mitigation strategies

Make it practical, achievable, and inspiring."""

    content = generate_content(prompt, max_tokens=6000)
    slug = _sanitize_slug(business_name)
    output_dir = f"/home/ubuntu/output/documents/{slug}"
    os.makedirs(output_dir, exist_ok=True)

    md_path = f"{output_dir}/roadmap.md"
    file_write(md_path, f"# Strategic Roadmap: {business_name}\n\n{content}")

    # Save as PDF if fpdf available
    if HAS_FPDF:
        try:
            pdf = FPDF()
            pdf.add_page()
            pdf.set_auto_page_break(auto=True, margin=15)
            pdf.set_font("Helvetica", "B", 16)
            pdf.cell(0, 10, f"Strategic Roadmap: {business_name}", ln=True)
            pdf.set_font("Helvetica", "", 11)
            pdf.ln(5)

            for line in content.split("\n"):
                if line.startswith("#"):
                    pdf.set_font("Helvetica", "B", 14)
                    pdf.cell(0, 8, line.replace("#", "").strip(), ln=True)
                    pdf.set_font("Helvetica", "", 11)
                elif line.startswith("**") and line.endswith("**"):
                    pdf.set_font("Helvetica", "B", 12)
                    pdf.cell(0, 7, line.replace("**", "").strip(), ln=True)
                    pdf.set_font("Helvetica", "", 11)
                else:
                    pdf.multi_cell(0, 6, line)

            pdf_path = f"{output_dir}/roadmap.pdf"
            pdf.output(pdf_path)
            return f"Roadmap generated: {pdf_path} and {md_path}"
        except Exception as e:
            # If PDF generation fails, return markdown path with a note
            error_msg = _format_error_message(e)
            return f"Roadmap generated: {md_path} (PDF generation failed: {error_msg})"

    return f"Roadmap generated: {md_path}"
