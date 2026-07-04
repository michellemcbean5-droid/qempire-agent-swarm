# Q-Empire Automation App - GitHub Copilot Prompt & Architecture Guide

## Overview
This document contains the exact architecture, component structure, and design tokens extracted from the Q-Empire Automation Division website (`https://qempireai.com/`). Use this as a prompt for GitHub Copilot (or any other AI coding assistant) to rebuild the site or build a mobile/web app version.

## Copilot System Prompt
Copy and paste the following text to GitHub Copilot to set the context for your app:

> **Role:** You are an expert React/React Native developer building the Q-Empire Automation app.
> 
> **Context:** We are rebuilding/extending the Q-Empire Automation Division website into an app. The brand is focused on "Building empires on autopilot with AI," targeting parents, solopreneurs, and enterprises. The design is dark-themed, futuristic, and highly animated.
> 
> **Tech Stack:**
> - Frontend: React (Vite) or React Native (Expo)
> - Styling: Tailwind CSS
> - Icons: Lucide React
> - Animations: Framer Motion
> - Routing: Wouter (for web) or React Navigation (for mobile)
> - UI Components: Radix UI / shadcn/ui patterns (button, card, input, select, textarea, sonner for toasts)
> 
> **Design Tokens (Tailwind Colors):**
> - Background: `#0A0A1A` (Deep dark blue/black)
> - Primary Text: `#FFFFFF` (White)
> - Accent 1 (Cyan/Teal): `#00FFFF`, `#00E5FF`, `#00b7d7`
> - Accent 2 (Purple/Magenta): `#BF00FF`, `#5C24FF`, `#FF007F`, `#f6339a`
> - Accent 3 (Gold/Premium): `#D4AF37`, `#FFD700`
> - Secondary Backgrounds: `#1a1a2e`, `#0a0a0f`
> - Success: `#00C853`
> 
> **Typography:**
> - Headings: Playfair Display (weights: 700, 900)
> - Subheadings: Montserrat (weights: 400, 600, 700, 900)
> - Body: Inter (weights: 400, 500, 600)

## App Architecture & Routing

The app consists of the following main routes/screens:

1. **Public Pages:**
   - `/` (Home)
   - `/about`
   - `/services`
   - `/use-cases`
   - `/pricing`
   - `/case-studies`
   - `/investors`
   - `/resources`
   - `/careers`
   - `/apply`
   - `/booking`
   - `/onboard` (InteractiveOnboarding)

2. **Internal/Portal Pages:**
   - `/team-portal` (Employee Portal)
   - `/admin` (Admin Dashboard)

## Component Structure

When asking Copilot to generate specific screens, reference these core components:

1. **Navigation/Header:**
   - Sticky top bar with glassmorphism (`bg-[#0A0A1A]/90 backdrop-blur-xl border-b border-[#4169E1]/20`)
   - Logo: "Q" in a gradient box (`bg-gradient-to-br from-[#4169E1] to-[#BF00FF]`) with "Q-EMPIRE AUTOMATION" text.
   - Links: Services, Use Cases, Pricing, Investors, Team.
   - CTA Button: "Get Started" (`bg-gradient-to-r from-[#4169E1] to-[#BF00FF] hover:from-[#3158D0] hover:to-[#A600DD]`)

2. **Hero Section:**
   - Headline: "Build Your Empire on Autopilot."
   - Subheadline: "Whether you're a parent breaking into tech, a solopreneur scaling up, or an enterprise streamlining operations — Q-Empire builds your entire automated business from the ground up."
   - Two CTAs: "Start Interactive Builder" and "Get My Business-in-a-Box"
   - Stats row: "30 Day Buildout", "15+ Hours Saved/Week", "3.7x ROI Average"

3. **Core Reusable Components:**
   - `AIChatAssistant`: A floating or embedded AI chat interface for user support.
   - `FAQSection`: Accordion-style FAQ using Framer Motion for smooth open/close (`initial:{opacity:0,height:0}`).
   - `ImageCarousel`: For displaying use cases or portfolio items.
   - `CalendarBooking`: For scheduling consultations.

## Animation Patterns (Framer Motion)

The original site heavily uses Framer Motion for scroll reveals. Tell Copilot to use these patterns:

```jsx
// Standard fade up on scroll pattern
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5 }}
>
  {/* Content */}
</motion.div>
```

## Required Assets

The app references several specific media assets. You should ask Copilot to add placeholders for these, or download them directly from the live site:

- `/manus-storage/hero_michelle_2a39ec22.png` (Hero image: Michelle with Q-Bot)
- `/manus-storage/automation_flow_diagram_766386c4.png` (5-Step Engine Diagram)
- `/manus-storage/brand_logo_791c1bd9.png`
- `/manus-storage/qai_hero_banner_9189b9d4.png`
- `/manus-storage/qempire_client_video_60s_2aab3d23.mp4`

## Example Copilot Prompts to Get Started

**Prompt 1: Setup the Layout**
> "Generate a React Native (or React) Layout component that includes a dark-themed navigation bar. The background should be `#0A0A1A`. Include a logo section on the left with a gradient 'Q' icon (from `#4169E1` to `#BF00FF`), and a 'Get Started' button on the right using the same gradient."

**Prompt 2: Build the Hero Section**
> "Create a Hero component using Tailwind CSS. It should have a large Playfair Display heading 'Build Your Empire on Autopilot.' Add a subtitle in Inter font. Below that, add two buttons side-by-side: a primary gradient button and a secondary outline button. Include a 3-column stats row below the buttons."

**Prompt 3: Build the FAQ Component**
> "Create an FAQ Accordion component using Framer Motion and Lucide React icons. The questions should have a background gradient `from-slate-900/50 to-purple-900/30`. When clicked, the answer should smoothly expand using Framer Motion's `height` animation."
