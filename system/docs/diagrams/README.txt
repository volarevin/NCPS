This directory contains the Mermaid definitions for the system diagrams.
You can render these using the Mermaid Live Editor (https://mermaid.live) or a VS Code extension.

Files:
- existing_flowchart.mmd: Flowchart of the manual system.
- proposed_flowchart.mmd: Flowchart of the new web-based system.
- context.mmd: Context diagram showing system actors.
- dfd-level1.mmd: Data Flow Diagram Level 1.
- use-cases.mmd: Use Case diagram.
- system-architecture.mmd: High-level system architecture.
- gantt.mmd: Project timeline.

To generate PNGs, you can use the Mermaid CLI if installed:
`mmdc -i existing_flowchart.mmd -o existing_flowchart.png`
