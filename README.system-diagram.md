# MockMate System Diagram

Below is a high-level system architecture diagram for MockMate, visualized using Mermaid.

```mermaid
flowchart TD
    %% Use quoted labels and safe node ids to avoid GitHub mermaid parse issues
    subgraph Frontend
        direction TB
        A["React App — Vite"]
        B["User Context"]
        C["Pages & Components"]
        D["Axios Instance"]
    end

    subgraph Backend
        direction TB
        E["Express.js Server"]
        F["Controllers"]
        G["Models"]
        H["Routes"]
        I["DB Config"]
        J["Utils"]
    end

    subgraph Database
        K[(MongoDB)]
    end

    subgraph External_Services
        L["AI/ML APIs"]
        M["Authentication Provider"]
    end

    A -->|HTTP Requests| D
    D -->|API Calls| E
    E --> H
    H --> F
    F --> G
    F --> J
    E --> I
    G --> K
    E -->|AI/ML Requests| L
    E -->|Auth Requests| M
    B --> A
    C --> A
```

**Legend:**
- **Frontend:** React app (Vite), user context, pages/components, and Axios for API calls.
- **Backend:** Express.js server, controllers, models, routes, DB config, and utility functions.
- **Database:** MongoDB for data storage.
- **External Services:** AI/ML APIs for interview analysis, and authentication provider (e.g., OAuth).

---

Notes:
- GitHub's Mermaid parser is sensitive to certain label characters and layout; quoting labels and using `flowchart TD` with safe node ids avoids common parse errors.
- If rendering still fails on GitHub, view the diagram at https://mermaid.live by copying the mermaid block there.

For more details, see the respective folders in the repository.
