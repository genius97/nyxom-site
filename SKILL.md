---
name: nyxom-handoff
description: Use at the start of any new Nyxom session to load the full state of in-progress work — website, Coolify, nyxom-docs OCR service, ElevenLabs cost fix, and the ElevenLabs-free WhatsApp sales agent proof of concept — with IDs, rules and next steps.
---

# Nyxom — session handoff (2026-10-20)

## Hard rules (always)
- Never delete/modify/stop/redeploy existing Coolify, n8n or ElevenLabs resources without Saleh naming that resource and approving. Read-only checks are fine. Build new things as NEW copies.
- Coffeato café agent + number 7124-7700 must never stop or be touched.
- Reply in Arabic, short numbered steps, always give direct links.
- Never print/commit secrets; read from env vars. No model names in commits. No PR unless asked.
- The website repo is served publicly by nginx — never put notes/secrets in it.

## Environment variables needed in the session
- COOLIFY_URL = https://coolify.nyxom.ai  (old value had typo `.a`)
- COOLIFY_TOKEN = the "claude agent" token with write (old one returns 401)
- WA_TOKEN = WhatsApp Cloud API permanent token (for the PoC)
- GEMINI_API_KEY = from https://aistudio.google.com/apikey (for the PoC)

## 1. Website (done)
- Repo genius97/nyxom-site, work branch `claude/nyxom-website-design-wvoqfw`, also push to `main` (Coolify deploy branch).
- Last commit 7351a83: founder photo (assets/img/founder.jpg), mobile centered alignment (≤640px), HTML Cache-Control no-cache, CSS/JS ?v=3.
- NOT YET DEPLOYED: needs Redeploy of app nyxom-web uuid `amts95t1cpufrcfgacocafw1` → `GET $COOLIFY_URL/api/v1/deploy?uuid=amts95t1cpufrcfgacocafw1` (Bearer token).
- Business WhatsApp +968 9186 0264 (96891860264); email admin@nyxom.ai; footer: "© 2026 نكسوم لحلول الذكاء الاصطناعي — مؤسسة طيبات الجنة للتجارة · سجل تجاري 1352762" / EN "TAYIBAT ALJANNA TRAD · CR 1352762". Privacy at /privacy (#data-deletion).
- Screenshot locally: `python3 -m http.server`, Playwright with python3.13 and executable_path=/opt/pw-browsers/chromium.

## 2. Coolify
- Server `ggyqpuqs5k7xomw5o3nnefxx` (178.105.245.63); project nyxom `vz4hm8xzzfv81f8s57kqdacu`.
- Known issues (not touched, offer only): mujeeb-stack exited/unhealthy, coffeato-test restart loop.

## 3. nyxom-docs OCR service (next)
- DNS A `docs` → 178.105.245.63 now EXISTS in GoDaddy.
- Code in this skill: docs-service/ (FastAPI; Tesseract ara+eng, OCRmyPDF, MarkItDown). Build on the server (local docker build fails on apt).
- Create as NEW Coolify app in project nyxom, domain https://docs.nyxom.ai, port from Dockerfile. Then update doc-token-saver skill to call it.
- Later: self-hosted Firecrawl — check server RAM first, ask approval.

## 4. ElevenLabs cost fix (done)
- Drain cause: n8n "Nyxom Sales Outreach Sender" `WnCMn8YF8JogOZL5` (every 15 min outbound templates). Campaigns paused in sales.nyxom.ai; no sends since 2026-10-20 08:30 UTC. Workflow still active (sends nothing) — disabling needs permission.
- Nyxom Sales agent LLM switched to gemini-2.5-flash-lite (approved). Café agent unchanged.

## 5. PoC: sales agent WITHOUT ElevenLabs (in progress)
Goal: prove ElevenLabs can be dropped. New copy only, sales agent only, same UX. Meta WhatsApp Cloud API + n8n + Gemini Flash-Lite. Voice notes → Gemini audio. No calls, no dashboards needed.
- Existing inbound n8n workflow "WhatsApp — استقبال الرسائل (نكسوم + كوفياتو)" `426Wq2sKkUlrIATK`: webhook https://n8n.nyxom.ai/webhook/wa-inbound, verify token nyxom_wa_2026; phone_number_id 1338494659348113=nyxom, 1247462991792042=coffeato. Only 2 executions ever → Meta currently routes to ElevenLabs, not here. DO NOT re-point Meta webhook without approval (would affect Coffeato too).
- Sales tools gateway "Nyxom Sales Agent Tools" `wQLesaODU2XVooN2`: POST https://n8n.nyxom.ai/webhook/nx-sales-0a05f3469b04 body {fn, p_phone, ...}; fns: agent_turn(p_phone,p_message), update_lead(p_stage,p_tier,p_score,p_summary,p_contact_name,p_contact_role,p_contact_phone,p_next_action), opt_out. Supabase https://upxqeontwoghuqfowmwf.supabase.co/rest/v1/rpc/, n8n cred "Supabase Nyxom Sales" lQAHbhDbU2Q2KM4Z.
- Other: Lead Analyst 7e5UCBEs4F0UCrj1, Transcript Sync 2WQAExVWI7eQAU0N, Conversation Init vzHcwRXglUiYaXpc, n8n cred "ElevenLabs Nyxom Sales" STD3deBUgxdOu9Vs.
- ElevenLabs agents: Nyxom Sales agent_2001m4z8swfyeqxsc16pt3ccjndt (copy its system prompt via agents_get — rules: get_lead_context first, skip_turn for auto-replies, update_lead after each human msg, opt_out, ≤45 words); Cafe agent_2301m2812cf5ej49deex4qngy6f9 (DO NOT TOUCH); GlowZone agent_2701m4nck9d9erybqx5kxhmf8xjs; Rashid agent_1001m56nhff8etms8r0sn1w9tn1w.
- Plan: new n8n workflow (via n8n MCP: SDK reference → best practices → search_nodes → get_node_types → validate → create): webhook → filter (sales phone_number_id + whitelist Saleh's own number only) → history/context → Gemini Flash-Lite with copied prompt + tools → reply via Graph API. Avoid double replies: test with a Meta test number or whitelisted sender. Report before switching live routing.
