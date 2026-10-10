# Development Workflow Rules

These rules dictate how the AI assistant must interact and develop this project:

1. **Step-by-Step Execution:** Split the project into logical parts and small steps. Do not build the entire application in a single prompt or commit.
2. **Stop and Wait:** Only perform a single step at a time. After completing the step, stop and wait for the user's explicit approval before proceeding to the next one.
3. **Teach and Discuss:** Take the time to teach, explain, and discuss what is happening. The user needs to understand the code being written and the rationale behind it.
4. **Realistic Git History:** GitHub commits should look organic, as if a human built the project incrementally step-by-step.
5. **No Docs on GitHub:** The `docs/` directory must never be pushed to the public GitHub repository. It is for internal use only.
