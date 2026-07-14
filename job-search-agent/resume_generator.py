#!/usr/bin/env python3
"""resume_generator.py — Genera un CV en PDF por cada perfil de rol.

Lee `base_resume.json` (fuente única de verdad) y produce un PDF por cada
perfil de rol definido en `role_profiles`, guardado como:

    tailored_resumes/[NombreDelCandidato]_[EtiquetaDelPerfil].pdf

- El encabezado de contacto, la experiencia laboral, la educación y las
  certificaciones son COMPARTIDOS entre todos los PDFs.
- El resumen profesional y las skills destacadas CAMBIAN según el perfil.
- Ejecutar el script regenera todos los PDFs desde cero.

Requiere: pip install reportlab
"""

import json
import os

from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.platypus import (
    HRFlowable,
    ListFlowable,
    ListItem,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
)

HERE = os.path.dirname(os.path.abspath(__file__))
BASE_RESUME_PATH = os.path.join(HERE, "base_resume.json")
OUTPUT_DIR = os.path.join(HERE, "tailored_resumes")

# Etiqueta de archivo por cada ID de perfil de rol (Sección 2 / Sección 6).
PROFILE_FILE_LABELS = {
    "ai_engineer": "AI-Engineer",
    "automation_engineer": "Automation-Engineer",
    "backend_python": "Python-Backend",
    "fullstack": "Full-Stack",
}

ACCENT = colors.HexColor("#1F3A5F")
MUTED = colors.HexColor("#555555")


def load_base_resume():
    with open(BASE_RESUME_PATH, "r", encoding="utf-8") as fh:
        return json.load(fh)


def candidate_slug(nombre: str) -> str:
    """'Jose Da Luz Pereira' -> 'JoseDaLuzPereira'."""
    return "".join(part.capitalize() for part in nombre.split())


def build_styles():
    styles = getSampleStyleSheet()

    styles.add(ParagraphStyle(
        name="Name", fontName="Helvetica-Bold", fontSize=20,
        leading=24, textColor=ACCENT, alignment=TA_CENTER, spaceAfter=2))
    styles.add(ParagraphStyle(
        name="RoleTitle", fontName="Helvetica", fontSize=12,
        leading=15, textColor=MUTED, alignment=TA_CENTER, spaceAfter=4))
    styles.add(ParagraphStyle(
        name="Contact", fontName="Helvetica", fontSize=8.5,
        leading=12, textColor=MUTED, alignment=TA_CENTER, spaceAfter=2))
    styles.add(ParagraphStyle(
        name="Section", fontName="Helvetica-Bold", fontSize=11.5,
        leading=14, textColor=ACCENT, spaceBefore=10, spaceAfter=3))
    styles.add(ParagraphStyle(
        name="Body", fontName="Helvetica", fontSize=9.5,
        leading=13, alignment=TA_LEFT, textColor=colors.black))
    styles.add(ParagraphStyle(
        name="JobHeader", fontName="Helvetica-Bold", fontSize=10,
        leading=13, textColor=colors.black, spaceBefore=4))
    styles.add(ParagraphStyle(
        name="JobMeta", fontName="Helvetica-Oblique", fontSize=8.5,
        leading=11, textColor=MUTED, spaceAfter=2))
    styles.add(ParagraphStyle(
        name="CVBullet", fontName="Helvetica", fontSize=9,
        leading=12, textColor=colors.black))
    return styles


def rule():
    return HRFlowable(width="100%", thickness=0.7, color=ACCENT,
                      spaceBefore=1, spaceAfter=3)


def build_story(data, profile_id, styles):
    personal = data["personal"]
    profile = data["role_profiles"][profile_id]
    story = []

    # --- Encabezado (compartido) ---
    story.append(Paragraph(personal["nombre"], styles["Name"]))
    story.append(Paragraph(profile["role_title"], styles["RoleTitle"]))

    contact_bits = [
        personal["ciudad"],
        personal["email_principal"],
        personal["telefono"],
        personal["linkedin"],
    ]
    story.append(Paragraph(" &nbsp;|&nbsp; ".join(contact_bits), styles["Contact"]))
    story.append(Paragraph(
        f"{personal['nacionalidad']} &nbsp;|&nbsp; {personal['idiomas']} "
        f"&nbsp;|&nbsp; {personal['zona_horaria']}",
        styles["Contact"]))
    story.append(Paragraph(personal["autorizacion_trabajo"], styles["Contact"]))
    story.append(Spacer(1, 4))
    story.append(rule())

    # --- Resumen profesional (adaptado al perfil) ---
    story.append(Paragraph("PERFIL PROFESIONAL", styles["Section"]))
    story.append(Paragraph(profile["summary"], styles["Body"]))

    # --- Skills destacadas (adaptadas al perfil) ---
    story.append(Paragraph("SKILLS DESTACADAS", styles["Section"]))
    story.append(Paragraph(
        " &nbsp;•&nbsp; ".join(profile["highlight_skills"]), styles["Body"]))

    # --- Experiencia (compartida) ---
    story.append(Paragraph("EXPERIENCIA LABORAL", styles["Section"]))
    for exp in data["experience"]:
        header = f"{exp['rol']} — {exp['empresa']}"
        if exp.get("cliente"):
            header += f" (cliente: {exp['cliente']})"
        story.append(Paragraph(header, styles["JobHeader"]))
        story.append(Paragraph(
            f"{exp['fecha_inicio']} – {exp['fecha_fin']}", styles["JobMeta"]))
        if exp.get("descripcion"):
            story.append(Paragraph(exp["descripcion"], styles["Body"]))
        bullets = [
            ListItem(Paragraph(r, styles["CVBullet"]), leftIndent=8)
            for r in exp.get("responsabilidades", [])
        ]
        if bullets:
            story.append(ListFlowable(
                bullets, bulletType="bullet", bulletColor=ACCENT,
                start="•", leftIndent=10, spaceBefore=2))
        if exp.get("tech_stack"):
            story.append(Paragraph(
                f"<b>Stack:</b> {', '.join(exp['tech_stack'])}", styles["Body"]))

    # --- Educación (compartida) ---
    story.append(Paragraph("EDUCACIÓN", styles["Section"]))
    for edu in data["education"]:
        story.append(Paragraph(
            f"<b>{edu['titulo']}</b> — {edu['institucion']} "
            f"<font color='#555555'>({edu['fecha_inicio']} – {edu['fecha_fin']})</font>",
            styles["Body"]))

    # --- Certificaciones (compartidas) ---
    certs = data.get("certifications", [])
    if certs:
        story.append(Paragraph("CERTIFICACIONES", styles["Section"]))
        cert_items = [
            ListItem(Paragraph(c, styles["CVBullet"]), leftIndent=8) for c in certs
        ]
        story.append(ListFlowable(
            cert_items, bulletType="bullet", bulletColor=ACCENT,
            start="•", leftIndent=10))

    return story


def generate_pdf(data, profile_id, styles, candidate):
    label = PROFILE_FILE_LABELS.get(profile_id, profile_id)
    filename = f"{candidate}_{label}.pdf"
    path = os.path.join(OUTPUT_DIR, filename)

    doc = SimpleDocTemplate(
        path, pagesize=A4,
        leftMargin=16 * mm, rightMargin=16 * mm,
        topMargin=14 * mm, bottomMargin=14 * mm,
        title=f"{data['personal']['nombre']} - {data['role_profiles'][profile_id]['role_title']}",
        author=data["personal"]["nombre"],
    )
    doc.build(build_story(data, profile_id, styles))
    return path


def main():
    data = load_base_resume()
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    styles = build_styles()
    candidate = candidate_slug(data["personal"]["nombre"])

    generated = 0
    for profile_id in data["role_profiles"]:
        path = generate_pdf(data, profile_id, styles, candidate)
        print(f"[OK] CV generado: {os.path.relpath(path, HERE)}")
        generated += 1

    print(f"\n{generated} PDF(s) generado(s) en '{os.path.relpath(OUTPUT_DIR, HERE)}/'.")


if __name__ == "__main__":
    main()
