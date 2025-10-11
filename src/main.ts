// Main plugin entry point
import {runPipeline} from "./run_pipeline";

figma.on("run", async () => {
  try {
    await runPipeline();
  } catch (error) {
    console.error("Plugin error:", error);
    figma.notify(`Error: ${error}`);
    figma.closePlugin();
  }
});
