import { TotoAPIController } from "toto-api-controller";
import { ControllerConfig } from "./Config.js";
import { PostPrompt } from "./dlg/PostPrompt.js";

const api = new TotoAPIController("toto-ms-llm", new ControllerConfig())

api.path('POST', '/prompts', new PostPrompt())

api.init().then(() => {
    api.listen()
});