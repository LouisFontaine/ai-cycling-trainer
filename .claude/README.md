# .claude folder - Local project configuration

This folder contains configurations and skills specific to the AI Cycling Trainer project.

## Structure

- **skills/**: Custom skills for this project
  - Skills are reusable prompts that Claude can invoke with `/skill-name`
  - Each skill must be in a `.md` file with YAML front matter

## Creating a custom skill

Example structure for a skill (`skills/example-skill.md`):

```markdown
---
name: example-skill
description: Short description of the skill
---

Your detailed prompt here...
```

## Usage

Skills defined here will be available via the `/skill-name` command in Claude Code.
